from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import  Conversation, ConversationParticipant, Message
from .serializers import  SignUpSerializer, UserSerializer, ConversationSerializer,SimpleUserSerializer, ParticipantSerializer, MessageSerializer
from django.contrib.auth.models import User
from .pagination import UserPagination
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.shortcuts import render




def chat_room(request, room_name):
    users = User.objects.exclude(id=request.user.id) 
    chats = Message.objects.filter(
        (Q(sender=request.user) & Q(receiver__username=room_name)) |
        (Q(receiver=request.user) & Q(sender__username=room_name))
    )


    chats = chats.order_by('timestamp') 
    user_last_messages = []

    for user in users:
        last_message = Message.objects.filter(
            (Q(sender=request.user) & Q(receiver=user)) |
            (Q(receiver=request.user) & Q(sender=user))
        ).order_by('-timestamp').first()

        user_last_messages.append({
            'user': user,
            'last_message': last_message
        })

    # Sort user_last_messages by the timestamp of the last_message in descending order
    user_last_messages.sort(
        key=lambda x: x['last_message'].timestamp if x['last_message'] else None,
        reverse=True
    )

    return render(request, 'chat.html', {
        'room_name': room_name,
        'chats': chats,
        'users': users,
        'user_last_messages': user_last_messages
    })




@api_view(['POST'])
def signup_view(request):
    if User.objects.filter(username=request.data["username"]).exists():
        return Response({"detail":"Username already exists."},status=400)
    serializer = SignUpSerializer(data = request.data)

    

    if serializer.is_valid():
        user = serializer.save()
        return Response({"message":"User created Successfully","user":SimpleUserSerializer(user).data},status=201)
    return Response(serializer.errors,status=400)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user(request):
    me_user = User.objects.get(id=request.user.id)
    serializer = SimpleUserSerializer(me_user)
    return Response(serializer.data,status=200)






# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def send_text(request):

#     # if not (request.data["sent_to"]):
#     serializer = ChatMessageSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=201)
    
    
#     return Response(serializer.errors,status=400)



# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def get_text(request):
#     messages = ChatMessage.objects.all().order_by('timestamp')

#     if not messages.exists():
#         return Response({"info":"No text messages yet"},status=200)
    
#     serializer = ChatMessageSerializer(messages,many=True)
#     return Response(serializer.data,status=200)
    

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_direct_message(request,conv_id):
    conversation = get_object_or_404(
    Conversation.objects.filter(participants__user=request.user),
    id=conv_id
    ) 
    

    serializer = MessageSerializer(data={
        "conversation":conversation.id,
        "content": request.data["text_message"]
    })

    if serializer.is_valid():
        serializer.save(sender=request.user,conversation=conversation)
        return Response(serializer.data,status=201)

    return Response(serializer.errors,status=400)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_direct_message(request,conv_id):
    conversation = get_object_or_404(
        Conversation.objects.filter(participants__user=request.user),
        id=conv_id
    )
    
    if not conversation.participants.filter(user=request.user).exists():
        return Response(
            {"detail": "You do not have permission."},
            status=403
        )

    messages = Message.objects.filter(conversation=conversation).order_by("created_at")
    
    serializer = MessageSerializer(messages,many=True)

    return Response(serializer.data,status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_conversations(request):
    
    my_convos = Conversation.objects.filter(participants__user=request.user)
    serializer = ConversationSerializer(my_convos, many=True)
    return Response(serializer.data,status=200)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_users(request):

    all_users = User.objects.exclude(id=request.user.id).order_by("username")   

    if not all_users.exists():
        return Response({"info":"No Users Yet!"},status=200) 
    
    paginator = UserPagination()
    page = paginator.paginate_queryset(all_users, request)

    serializer = UserSerializer(page,many=True, context={"request":request})

    return paginator.get_paginated_response(serializer.data)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_personal_chat(request, conv_id):

    user = User.objects.get(id=conv_id)
    convo = (
        Conversation.objects
        .filter(participants__user=user)
        .filter(participants__user=request.user)
        .filter(is_group=False)
        .distinct()
    )

    if convo.exists():
        return Response({"error":"You already have a chat with this user!"},status=403)

    else:
        new_convo = Conversation.objects.create(
            is_group= False
        )
        ConversationParticipant.objects.create(
            conversation = new_convo,
            user=request.user
        )

        ConversationParticipant.objects.create(
            conversation = new_convo,
            user=user
        )


        serializer = ConversationSerializer(new_convo)
        return Response(serializer.data)