from io import BytesIO

from celery import shared_task
from django.core.files.base import ContentFile
from django.contrib.auth.models import User

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    HRFlowable,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib import colors

from .models import (
    Message,
    ChatExport,
    ConversationParticipant,
)


@shared_task
def generate_chat_pdf(export_id):
    export = None
    buffer = None

    try:
        buffer = BytesIO()

        export = ChatExport.objects.get(id=export_id)
        conversation = export.conversation
        channel_layer = get_channel_layer()

        doc = SimpleDocTemplate(
            buffer,
            leftMargin=40,
            rightMargin=40,
            topMargin=40,
            bottomMargin=40,
        )

        styles = getSampleStyleSheet()

        title_style = ParagraphStyle(
            "Title",
            parent=styles["Heading1"],
            alignment=TA_CENTER,
            textColor=colors.darkblue,
            spaceAfter=20,
        )

        heading_style = ParagraphStyle(
            "Heading",
            parent=styles["Heading2"],
            textColor=colors.darkblue,
            spaceAfter=10,
        )

        sender_style = ParagraphStyle(
            "Sender",
            parent=styles["Heading4"],
            textColor=colors.darkblue,
            spaceAfter=2,
        )

        timestamp_style = ParagraphStyle(
            "Timestamp",
            parent=styles["BodyText"],
            fontSize=8,
            textColor=colors.grey,
            spaceAfter=6,
        )

        message_style = ParagraphStyle(
            "Message",
            parent=styles["BodyText"],
            leading=18,
            spaceAfter=12,
        )

        elements = []


        elements.append(
            Paragraph("CHAT EXPORT", title_style)
        )

        participants = (
            ConversationParticipant.objects
            .filter(conversation=conversation)
            .select_related("user")
        )

        participant_names = ", ".join(
            participant.user.username
            for participant in participants
        )

        elements.append(
            Paragraph(
                f"<b>Conversation ID:</b> {conversation.id}",
                styles["BodyText"],
            )
        )

        elements.append(
            Paragraph(
                f"<b>Participants:</b> {participant_names}",
                styles["BodyText"],
            )
        )

        elements.append(
            Paragraph(
                f"<b>Exported By:</b> {export.user.username}",
                styles["BodyText"],
            )
        )

        elements.append(
            Paragraph(
                f"<b>Export Date:</b> {export.created_at.strftime('%d %B %Y %I:%M %p')}",
                styles["BodyText"],
            )
        )

        elements.append(Spacer(1, 20))
        elements.append(HRFlowable())
        elements.append(Spacer(1, 20))

        elements.append(
            Paragraph(
                "Conversation Messages",
                heading_style,
            )
        )

        # =====================
        # Messages
        # =====================

        messages = (
            Message.objects
            .filter(conversation=conversation)
            .select_related("sender")
            .order_by("created_at")
        )

        for message in messages:

            elements.append(
                Paragraph(
                    message.created_at.strftime("%d %b %Y • %I:%M %p"),
                    timestamp_style,
                )
            )

            elements.append(
                Paragraph(
                    f"<b>{message.sender.username}</b>",
                    sender_style,
                )
            )

            elements.append(
                Paragraph(
                    message.content.replace("\n", "<br/>"),
                    message_style,
                )
            )

            elements.append(HRFlowable())
            elements.append(Spacer(1, 12))

        elements.append(Spacer(1, 20))

        elements.append(
            Paragraph(
                "<i>End of Conversation</i>",
                styles["Italic"],
            )
        )

        doc.build(elements)

        buffer.seek(0)

        filename = f"chat_{conversation.id}_{export.id}.pdf"

        export.pdf.save(
            filename,
            ContentFile(buffer.getvalue()),
            save=False,
        )

        export.status = "COMPLETED"
        export.save()

        async_to_sync(channel_layer.group_send)(
            f"notification_{export.user.id}",
            {
                "type": "chat_export_ready",
                "export_id": export.id,
                "message": "Your PDF is ready!",
            },
        )

    except Exception as e:
        if export:
            export.status = "FAILED"
            export.save()

        print(e)

    finally:
        if buffer:
            buffer.close()