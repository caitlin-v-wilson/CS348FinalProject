from django.contrib import admin
from .models import Example

@admin.register(Example)
class ExampleAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at', 'updated_at')
    list_filter = ('created_at',)
    search_fields = ('title', 'description')
