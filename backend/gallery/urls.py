from rest_framework.routers import DefaultRouter
from .views import PhotoViewSet

router = DefaultRouter()
router.register("photos", PhotoViewSet, basename="photo")

urlpatterns = router.urls