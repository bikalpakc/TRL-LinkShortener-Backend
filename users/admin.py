from django.contrib import admin
from .models import myUser
# Register your models here.

@admin.register(myUser)
class myUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'is_active', 'is_staff', 'created_at')
    search_fields = ('email', 'name')
    list_filter = ('is_active', 'is_staff')