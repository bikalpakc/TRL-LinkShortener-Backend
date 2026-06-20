from django.contrib import admin
from .models import MyUser
# Register your models here.

@admin.register(MyUser)
class MyUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'is_active', 'is_staff', 'created_at')
    search_fields = ('email', 'name')
    list_filter = ('is_active', 'is_staff')