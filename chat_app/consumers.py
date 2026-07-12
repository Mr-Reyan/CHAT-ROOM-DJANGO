# chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import User
from .models import Message, Conversation, ConversationParticipant
from asgiref.sync import sync_to_async


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]

        print("scope user id:", getattr(self.scope["user"], "id", None))
        print("scope user pk:", getattr(self.scope["user"], "pk", None))

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
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        print("receivreadaweva: ",text_data)
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
        print("Conversation:", conversation)
        print("Current user:", self.user)
        print("Receiver:", receiver.user)
        message = await sync_to_async(
        Message.objects.create)(
            conversation=conversation,
            receiver=receiver.user,
            sender=self.user,
            content=content
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

    async def chat_message(self, event):

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'sender': event['sender'],
            'content': event['content'],
            'created_at':event['created_at'],
            'id':event['msg_id']
        }))


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        pass