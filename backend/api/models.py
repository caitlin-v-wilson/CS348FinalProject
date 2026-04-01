from django.db import models

# Users
class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=255)
    about = models.CharField(max_length=300, blank=True)

    class Meta:
        db_table = 'users'

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

    def __str__(self):
        return self.post_title
