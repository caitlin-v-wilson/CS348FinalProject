from django.db import models

# Users
class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=255)
    about = models.CharField(max_length=300, blank=True)

    class Meta:
        db_table = 'users'
        indexes = [
            # MySQL doesnt support hash indexes directly - convert to B-tree; 
            models.Index(fields=['username'], name='idx_username'),
        ]

    def __str__(self):
        return self.username

#Posts
class Post(models.Model):
    post_id = models.AutoField(primary_key=True)
    date_created = models.DateTimeField()
    user_owner = models.IntegerField()
    post_title = models.CharField(max_length=255)
    post_text = models.CharField(max_length=500)

    class Meta:
        db_table = 'posts'
        indexes = [
            models.Index(fields=['user_owner'], name='idx_posts_user_owner'),
        ]

    def __str__(self):
        return self.post_title
