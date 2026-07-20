from django.contrib import admin
from .models import Message, Attachment


admin.site.register(Message)
admin.site.register(Attachment)