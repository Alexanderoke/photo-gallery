from rest_framework import serializers
from .models import Photo

class PhotoSerializer(serializers.ModelSerializer):
  image=serializers.ImageField(required=False)

  class Meta:
    model = Photo
    fields =["id", "title", "description", "image", "created_at"]
    read_only_fields =["id", "created_at"]


  def validate(self, attrs):
    if self.instance is None and "image" not in attrs:
      raise serializers.ValidationError({"image": "Please chose a photo to upload."})
    return attrs