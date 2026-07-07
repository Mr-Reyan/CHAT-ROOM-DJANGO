from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ChatMessage

@api_view(["POST"])
def send_text(request):
    # Safely extract data from the DRF request object
    sender = request.data.get('sender_name', 'Anonymous')
    text = request.data.get('message', '')

    # Create the database record
    new_msg = ChatMessage.objects.create(
        sent_by=sender,
        text_message=text
    )
    
    # Return a structured API response (status 201 Created)
    return Response({
        "status": "text sent successfully",
        "id": new_msg.id
    }, status=201)

@api_view(["GET"])
def get_text(request):
    messages = ChatMessage.objects.all().order_by('timestamp')

    message_list = []
    for msg in messages:
        message_list.append({
            "id":msg.id,
            "sender_name":msg.sent_by,
            "message":msg.text_message,
            "timestamp":msg.timestamp.strftime("%Y-%m-%d %H:%M:%S")

        })
    print(message_list)
    return Response(message_list,status=200)
    