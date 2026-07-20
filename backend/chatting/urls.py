from rest_framework.routers import SimpleRouter
from . import views


app_name = 'chatting'

router = SimpleRouter()
router.register('message', views.MessageViewSet)
router.register('attachment', views.AttachmentViewSet)

urlpatterns = router.urls