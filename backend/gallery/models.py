"""
models.py- describes WHAT we store.
A "model" is a python class that Django turns into a database table.
Each attribute(title, description, ...) becomesa column in that table,
and each photo you create becomes one row.
"""
from django.db import models

class Photo(models.Model):
  #short texxt, at most 120 characters. Becomes a VARCHAR(120) column.
  title = models.CharField(max_length=120)

  # Long text. blank=True means the form may leave it empty.
  description = models.TextField(blank=True)
  image = models.ImageField(upload_to="photos/")
  created_at = models.DateTimeField(auto_now_add=True)

  class Meta:
    ordering=["-created_at", "-id"]


def __str__(self):
  return self.title


    
