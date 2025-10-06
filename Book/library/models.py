from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    pass


class Category(models.Model):
    name = models.CharField("اسم الفئة", max_length=100)
    description = models.TextField("الوصف", blank=True)

    class Meta:
        verbose_name = "فئة"
        verbose_name_plural = "الفئات"

    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField("عنوان الكتاب", max_length=200)
    author = models.CharField("اسم المؤلف", max_length=100)
    category = models.ForeignKey(Category, verbose_name="الفئة", on_delete=models.CASCADE)
    description = models.TextField("الوصف")
    cover_image = models.ImageField("غلاف الكتاب", upload_to='book_covers/')
    audio_file = models.FileField("ملف صوتي", upload_to='audio_books/')
    created_at = models.DateTimeField("تاريخ الإضافة", auto_now_add=True)

    class Meta:
        verbose_name = "كتاب"
        verbose_name_plural = "الكتب"
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class UserLibrary(models.Model):
    user = models.ForeignKey(CustomUser, verbose_name="المستخدم", on_delete=models.CASCADE)
    book = models.ForeignKey(Book, verbose_name="الكتاب", on_delete=models.CASCADE)
    added_at = models.DateTimeField("تاريخ الإضافة", auto_now_add=True)
    is_favorite = models.BooleanField("مفضل؟", default=False)

    class Meta:
        verbose_name = "مكتبة المستخدم"
        verbose_name_plural = "مكتبات المستخدمين"
        unique_together = ('user', 'book')

    def __str__(self):
        return f"{self.user.username} - {self.book.title}"

class SEOSettings(models.Model):
    page_name = models.CharField("اسم الصفحة", max_length=100, unique=True)
    title = models.CharField("عنوان الصفحة (Meta Title)", max_length=255)
    description = models.TextField("وصف الصفحة (Meta Description)", blank=True)
    keywords = models.CharField("الكلمات المفتاحية", max_length=500, blank=True)

    class Meta:
        verbose_name = "إعدادات SEO"
        verbose_name_plural = "إعدادات SEO"

    def __str__(self):
        return self.page_name
