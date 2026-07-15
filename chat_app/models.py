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
    content = models.CharField(max_length=200,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)
    is_read = models.BooleanField(default=False)

class MessageFile(models.Model):
    message = models.ForeignKey(Message,on_delete=models.CASCADE,related_name='files')
    file = models.FileField(upload_to='chat_files/')

class Notification(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE,related_name="sent_notifications")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_notifications", null=True)
    message = models.ForeignKey(Message,on_delete=models.CASCADE,related_name='message_notifications',null=True)
    notification_type = models.TextField(max_length=100,default='messages')
    is_read= models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Sender: {self.sender} | Receiver: {self.receiver} | message: {self.message} | created_at: {self.created_at}'

class ChatExport(models.Model):

    STATUS_CHOICES = (
        ("PENDING", "Pending"),
        ("COMPLETED", "Completed"),
        ("FAILED", "Failed"),
    )

    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    pdf = models.FileField(
        upload_to="chat_exports/",
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING"
    )

    created_at = models.DateTimeField(auto_now_add=True)