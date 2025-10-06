from django.contrib import admin
from .models import Category, Book, UserLibrary
from .models import SEOSettings


admin.site.register(SEOSettings)
admin.site.register(Category)
admin.site.register(Book)
admin.site.register(UserLibrary)
