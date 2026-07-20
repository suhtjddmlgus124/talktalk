from rest_framework import mixins, viewsets
from rest_framework.request import Request
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse, FileResponse
from django.conf import settings
from urllib.parse import quote
from .models import Message, Attachment
from .serializers import MessageSerializer, AttachmentSerializer


class MessageViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [ IsAuthenticated ]


class AttachmentViewSet(mixins.RetrieveModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
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