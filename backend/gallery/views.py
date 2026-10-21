from rest_framework import viewsets
from .models import Photo
from .serializers import PhotoSerializer


class PhotoViewSet(viewsets.ModelViewSet):
  queryset = Photo.objects.all()
  serializer_class = PhotoSerializer

  def perform_destroy(self, instance):
    instance.image.delete(save=False)
    instance.delete()
