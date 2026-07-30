from django.urls import path
from . import views


app_name = 'chatting'

urlpatterns = [
    path('message/', views.MessageListView.as_view(), name='message-list'),
    path('attachment/<int:pk>/', views.AttachmentRetrieveView.as_view(), name='attachment-retrieve'),
    path('upload-file/', views.UploadFileView.as_view(), name='upload-file'),
    path('upload-image/', views.UploadImageView.as_view(), name='upload-image'),
]