from rest_frameworks.routers import DefaultRouter
from .views import PhotoViewSet

router = DefaultRouter()
router.register("photos", PhotoViewSet, basename="photo")

urlpatterns = router.urls