# chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import User
from .models import Message, Conversation, ConversationParticipant, Notification
from asgiref.sync import sync_to_async


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]

        self.user = await sync_to_async(User.objects.get)(
            id=self.scope["user"].id
        )

        self.room_group_name = f"chat_{self.conversation_id}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        content = data["message"]
        conversation = await sync_to_async(
            Conversation.objects.get)(
                id=self.conversation_id
            )
        receiver = await sync_to_async(
            lambda: ConversationParticipant.objects
            .filter(conversation=conversation)
            .exclude(user=self.user)
            .select_related("user")
            .first()
        )()

        message = await sync_to_async(
        Message.objects.create)(
            conversation=conversation,
            receiver=receiver.user,
            sender=self.user,
            content=content
        )
        notification = await sync_to_async(Notification.objects.create)(
            sender=self.user,
            receiver=receiver.user,
            message=message
        )

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type':'chat_message',
                'content':message.content,
                'sender':{
                    'username':self.user.username,
                },
                'created_at':message.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                'msg_id':message.id
            }
        )

        await self.channel_layer.group_send(
            f"notification_{receiver.user.id}",
            {
                "type": "notification",

                "notification_id": notification.id,

                "conversation_id": str(conversation.id),

                "message": {
                    'id':message.id,
                    'content':message.content
                },


                "sender": {
                    "id": self.user.id,
                    "username": self.user.username
                },

                "created_at": message.created_at.strftime("%Y-%m-%d %H:%M:%S")
            }
            
        )

    async def chat_message(self, event):

        await self.send(text_data=json.dumps({
            'sender': event['sender'],
            'content': event['content'],
            'created_at':event['created_at'],
            'id':event['msg_id']
        }))


class NotificationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.user_id = self.scope["url_route"]["kwargs"]["user_id"]
        self.room_group_name = f"notification_{self.user_id}"
        print("Joining group:", self.room_group_name)

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        print("NotificationConsumer DISCONNECT:", close_code)
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def notification(self, event):
        await self.send(text_data=json.dumps({
            "id": event["notification_id"],
            "conv_id": event["conversation_id"],
            "message": event["message"],
            "sender": event["sender"],
            "created_at": event["created_at"]
        }))
    
    async def chat_export_ready(self, event):
        print("Consumer received:", event)
        await self.send(text_data=json.dumps({
            "type": "export_ready",
            "export_id": event["export_id"],
            'message':event['message']
        }))