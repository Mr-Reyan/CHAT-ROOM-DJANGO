from .models import  Conversation, ConversationParticipant, Message, Notification
from rest_framework import serializers
from django.contrib.auth.models import User

class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True)
    class Meta:
        model = User
        fields = ['username','email','password']

    def validate(self,data):
        if User.objects.filter(username=data["username"]).exists():
            raise serializers.ValidationError("Username already exists!")

        if len(data["password"])<8 :
            raise serializers.ValidationError("Password should be atleast 8 characters long!")


        if "@" not in data["email"] or "." not in data["email"]:
            raise serializers.ValidationError("Email Invalid!")

        return data

    def create(self,validated_data):
        password = validated_data.pop('password')
        
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user



class UserSerializer(serializers.ModelSerializer):
    has_conversation = serializers.SerializerMethodField()
    conversation_id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username","email","has_conversation","conversation_id"]

    def _get_conversation(self, obj):
        request = self.context["request"]

        return Conversation.objects.filter(
            is_group = False,
            participants__user = request.user
        ).filter(
            participants__user = obj
        ).first()
    
    def get_has_conversation(self, obj):
        return self._get_conversation(obj) is not None

    def get_conversation_id(self, obj):
        convo = self._get_conversation(obj)
        return convo.id if convo else None



class SimpleUserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ["id", "username","email"]




class ParticipantSerializer(serializers.ModelSerializer):
    user = SimpleUserSerializer()

    class Meta:
        model = ConversationParticipant
        fields = ['user','joined_at']



class MessageSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S",read_only=True)
    sender = SimpleUserSerializer(read_only = True)

    class Meta:
        model = Message
        fields = ["id", "sender", "content", "created_at","conversation"]
        
    def validate_content(self,value):
        if len(value)>200:
            raise serializers.ValidationError("Text Message should be less than 200 letters.")


class ConversationSerializer(serializers.ModelSerializer):
    participants = ParticipantSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            "id",
            "is_group",
            "name",
            "participants",
            "last_message",
        ]

    def get_last_message(self, obj):
        message = obj.messages.order_by("-created_at").first()

        if message:
            return MessageSerializer(message).data

        return None
    
class NotificationSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S",read_only=True)
    sender = SimpleUserSerializer()
    receiver = SimpleUserSerializer()

    class Meta:
        model = Notification
        fields = ['id','sender','receiver','message','notification_type','is_read','created_at']