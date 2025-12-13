from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Category, Book, UserLibrary, SEOSettings, CustomUser


# Register CustomUser with the standard UserAdmin
@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    pass


admin.site.register(SEOSettings)
admin.site.register(Category)
admin.site.register(Book)
admin.site.register(UserLibrary)
