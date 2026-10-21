from django.test import TestCase
import io
import shutil
import tempfile

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from PIL import Image
from rest_framework.test import APITestCase

TEMP_MEDIA = tempfile.mkdtemp()

def make_image(name="test.png"):
    buf = io.BytesIO()
    Image.new("RGB", (10, 10), "red").save(buf, format="PNG")
    return SimpleUploadedFile(name, buf.getvalue(), content_type="image/png")


@override_settings(MEDIA_ROOT=TEMP_MEDIA)
class PhotoApiTests(APITestCase):
    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(TEMP_MEDIA, ignore_errors=True)
        super().tearDownClass()

    def create_photo(self, title="sunset"):
        return self.client.post(
            "/api/photos/",
            {"title": title, "description": "Evening", "image": make_image()},
            format="multipart",
        )

    def test_create_and_list(self):
        res = self.create_photo()
        self.assertEqual(res.status_code, 201)
        res = self.client.get("/api/photos/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.json()), 1)
        self.assertEqual(res.json()[0]["title"], "sunset")

    def test_create_requires_image(self):
        res = self.client.post(
            "/api/photos/", {"title": "No pic"}, format="multipart"
        )
        self.assertEqual(res.status_code, 400)

    def test_update_title_keeps_image(self):
        photo = self.create_photo().json()
        res = self.client.patch(
            f"/api/photos/{photo['id']}/",
            {"title": "Sunrise"},
            format="json",
        )
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["title"], "Sunrise")
        self.assertTrue(res.json()["image"])

    def test_delete(self):
        photo = self.create_photo().json()
        res = self.client.delete(f"/api/photos/{photo['id']}/")
        self.assertEqual(res.status_code, 204)
        self.assertEqual(self.client.get("/api/photos/").json(), [])



