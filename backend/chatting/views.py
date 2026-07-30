from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.http import HttpResponse, FileResponse
from django.conf import settings
from django.db import transaction
from urllib.parse import quote
import json
from .models import Message, Attachment
from .serializers import MessageSerializer, AttachmentSerializer


class MessageListView(ListAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [ IsAuthenticated ]


class AttachmentRetrieveView(RetrieveAPIView):
    queryset = Attachment.objects.all()
    serializer_class = AttachmentSerializer
    permission_classes = [ IsAuthenticated ]

    def retrieve(self, request: Request, *args, **kwargs):
        attachment = self.get_object()
        as_attachment = (request.query_params.get('as_attachment', "false") == "true")

        if settings.USE_X_ACCEL_REDIRECT:
            response = HttpResponse()
            response['X-Accel-Redirect'] = attachment.file.url
            response['Content-Disposition'] = f"{'attachment' if as_attachment else 'inline'}; filename*=UTF-8''{quote(attachment.file.filename)}"
            return response

        else:
            return FileResponse(
                attachment.file.open('rb'),
                filename=attachment.filename,
                as_attachment=as_attachment,
            )


class UploadFileView(APIView):
    permission_classes = [ IsAuthenticated ]

    def post(self, request: Request):
        with transaction.atomic():
            attachment_serializer = AttachmentSerializer(data=request.data)
            attachment_serializer.is_valid(raise_exception=True)
            attachment_serializer.save()

            message_serializer = MessageSerializer(data={
                'kind': Message.KindChoices.FILE, 
                'content': json.dumps({'url': f'/api/chatting/attachment/{attachment_serializer.data['id']}/?as_attachment=true', 'filename': attachment_serializer.data['filename']}),
            })
            message_serializer.is_valid(raise_exception=True)
            message_serializer.save(sender=request.profile)

            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                'chatroom',
                {
                    'type': 'message.send',
                    'id': message_serializer.data['id'],
                    'kind': message_serializer.data['kind'],
                    'content': message_serializer.data['content'],
                    'sender': message_serializer.data['sender'],
                    'sent_at': message_serializer.data['sent_at'],
                }
            )

        return Response({'detail': '파일이 전송되었습니다.'}, status.HTTP_200_OK)


class UploadImageView(APIView):
    permission_classes = [ IsAuthenticated ]

    def post(self, request: Request):
        with transaction.atomic():
            attachment_serializer = AttachmentSerializer(data=request.data)
            attachment_serializer.is_valid(raise_exception=True)
            attachment_serializer.save()

            message_serializer = MessageSerializer(data={
                'kind': Message.KindChoices.IMAGE,
                'content': json.dumps({'url': f'/api/chatting/attachment/{attachment_serializer.data['id']}/?as_attachment=false'})
            })
            message_serializer.is_valid(raise_exception=True)
            message_serializer.save(sender=request.profile)

            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                'chatroom',
                {
                    'type': 'message.send',
                    'id': message_serializer.data['id'],
                    'kind': message_serializer.data['kind'],
                    'content': message_serializer.data['content'],
                    'sender': message_serializer.data['sender'],
                    'sent_at': message_serializer.data['sent_at'],
                }
            )

        return Response({'detail': '이미지가 전송되었습니다.'}, status.HTTP_200_OK)