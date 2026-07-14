from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import  Conversation, ConversationParticipant, Message, Notification, ChatExport
from .serializers import  SignUpSerializer, UserSerializer, ConversationSerializer,SimpleUserSerializer, ParticipantSerializer, MessageSerializer, NotificationSerializer
from django.contrib.auth.models import User
from .pagination import UserPagination
from django.shortcuts import get_object_or_404


from django.http import FileResponse
import io
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.lib.pagesizes import letter

from .tasks import generate_chat_pdf

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def generate_chat(request,conv_id):
    conversation = get_object_or_404(Conversation,id=conv_id,participants__user=request.user)
    export = ChatExport.objects.create(
    conversation=conversation,
    user=request.user
    )

    generate_chat_pdf.delay(export.id)
    print("Generatingaafae")
    return Response({
    "export_id": export.id,
    "status": "PENDING"
}, status=202)  


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def download_chat(request, export_id):

    export = get_object_or_404(
        ChatExport,
        id=export_id,
        user=request.user
    )

    if export.status != "COMPLETED":
        return Response(
            {"message": "PDF is still being generated."},
            status=400
        )

    return FileResponse(
        export.pdf.open("rb"),
        as_attachment=True,
        filename=export.pdf.name.split("/")[-1]
    )



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
def create_personal_chat(request, user_id):

    user = User.objects.get(id=user_id)

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
    

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_notifications(request,user_id):
    all_notif = Notification.objects.filter(receiver=request.user).order_by('-created_at')
    if all_notif:
        serializer = NotificationSerializer(all_notif,many=True)
        return Response(serializer.data,status=200)
    
    return Response({"message":"No Notifications Yet!"},status=200)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def mark_as_read(request, message_id):
    notif = get_object_or_404(
        Notification,
        message_id=message_id,
        receiver=request.user
    )

    message = notif.message

    if not message.is_read:
        message.is_read = True
        message.save(update_fields=["is_read"])

    if not notif.is_read:
        notif.is_read = True
        notif.save(update_fields=["is_read"])

    return Response(
        {"message": "Notification has been marked as read!"},
        status=200
    )


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def mark_as_unread(request,notif_id):
    notif = get_object_or_404(Notification,id=notif_id,receiver=request.user)
    if notif:
        notif.is_read = False
        notif.save()
        return Response({"message":"Notification has been urread!"},status=200)
    return Response({"error":"no notification with this ID!"},status=404)