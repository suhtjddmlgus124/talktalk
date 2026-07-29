from django.urls import path
from rest_framework.routers import SimpleRouter
from . import views


app_name = 'chatting'

router = SimpleRouter()
router.register('message', views.MessageViewSet)
router.register('attachment', views.AttachmentViewSet)

urlpatterns = [
    path('file/', views.UploadFileView.as_view(), name='upload-file'),
    path('image/', views.UploadImageView.as_view(), name='upload-image'),
    *router.urls,
]