from django.contrib import admin
from .models import User, Post

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'username', 'about')
    search_fields = ('username',)


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('post_id', 'post_title', 'user_owner', 'date_created')
    search_fields = ('post_title',)
    list_filter = ('date_created',)
