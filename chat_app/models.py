from django.db import models

# Create your models here.

class ChatMessage(models.Model):
    sent_by = models.CharField(max_length=40)
    text_message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

