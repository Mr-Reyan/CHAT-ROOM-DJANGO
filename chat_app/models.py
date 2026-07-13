from django.db import models
from django.contrib.auth.models import User
import uuid
# Create your models here.


    
class Conversation(models.Model):
    is_group = models.BooleanField()
    name = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

class ConversationParticipant(models.Model):
    conversation = models.ForeignKey(Conversation,on_delete=models.CASCADE, related_name="participants")
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="conversations"
    )
    joined_at = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
    conversation = models.ForeignKey(Conversation,on_delete=models.CASCADE,related_name="messages")
    receiver = models.ForeignKey(User,related_name="received_messages",on_delete=models.CASCADE,null=True)
    sender = models.ForeignKey(User,on_delete=models.CASCADE,related_name="sent_messages")
    content = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)


class Notification(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE,related_name="sent_notifications")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_notifications", null=True)
    message = models.TextField(max_length=200)
    notification_type = models.TextField(max_length=100,default='messages')
    is_read= models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)