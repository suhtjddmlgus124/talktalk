from rest_framework import serializers
from .models import Message, Attachment


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.CharField(source='sender.nickname', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'kind', 'content', 'sender', 'sent_at']
        read_only_fields = ['id', 'sender', 'sent_at']


class AttachmentSerializer(serializers.ModelSerializer):
    filename = serializers.CharField(read_only=True)

    class Meta:
        model = Attachment
        fields = ['file', 'filename']

    def create(self, validated_data):
        file = validated_data['file']
        
        attachment = Attachment.objects.create(
            file=file,
            filename=file.name
        )
        return attachment