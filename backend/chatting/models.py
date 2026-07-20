from django.db import models
from account.models import Profile
import os
import uuid


class Message(models.Model):
    class KindChoices(models.TextChoices):
        TEXT = 'TEXT', '텍스트'
        IMAGE = 'IMAGE', '이미지'
        FILE = 'FILE', '파일'

    kind = models.CharField(max_length=20, choices=KindChoices)
    content = models.TextField()
    sender = models.ForeignKey(Profile, related_name='messages', on_delete=models.CASCADE)
    sent_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.sender.nickname}]: {self.content} ({self.sent_at}, {self.kind})"


def upload_to(instance, filename):
    _, ext = os.path.splitext(filename)
    return f"attachment/{uuid.uuid4()}{ext}"

class Attachment(models.Model):
    file = models.FileField(upload_to=upload_to)
    filename = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.filename}"