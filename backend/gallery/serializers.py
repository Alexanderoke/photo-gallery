from rest_framwork import serializers
from .models import photo

class PhotoSerializer(serializers.ModelSerializer):
  image=serializers.ImageField(required=False)

  class Meta:
    model = Photo
    fields =["id", "title", "description", "image", "created_at"]
    read_only_fields =["id", "created_at"]


  def validate(self, attrs):
    if self.instance is None and "image" is not in attrs:
      raise serializers.ValidationError({"image": "Please chose a photo to upload."})