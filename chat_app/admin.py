from django.contrib import admin
from .models import *

admin.site.register(Message)
admin.site.register(Conversation)
admin.site.register(ConversationParticipant)
admin.site.register(Notification)
