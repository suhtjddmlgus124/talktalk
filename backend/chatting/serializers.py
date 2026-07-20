from rest_framework import serializers
from .models import Message, Attachment


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'kind', 'content', 'sender', 'sent_at']
        read_only_fields = ['id', 'sender', 'sent_at']


class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = ['file']

    def create(self, validated_data):
        file = validated_data['file']
        
        attachment = Attachment.objects.create(
            file=file,
            filename=file.name
        )
        return attachment