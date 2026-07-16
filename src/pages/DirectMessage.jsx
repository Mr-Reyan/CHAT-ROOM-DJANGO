import React, { useRef, useState, useEffect } from 'react'
import { useUserContext } from '../context/UserContext';
import { useNavigate, useParams } from 'react-router-dom';
import { openChat } from '../utils/openChat';
import TextMessages from '../components/TextMessages';
// import Button from '../components/Button';
import { getAccessToken, refreshAccessToken } from '../utils/auth';
import { toast } from 'react-toastify';
import { chatSocket } from '../utils/websocket';
import { useLocation } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    FileDown,
    Loader2,
    Paperclip,
    Send,
} from "lucide-react";

const DirectMessage = () => {
    const { user, NotifSocketRef, exportId, exportStatus, setExportStatus } = useUserContext()


    const bottomRef = useRef(null)
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedFiles, setSelectedFiles] = useState(null)
    const navigate = useNavigate()
    const lastMessageId = useRef(null)
    const [conv, setConv] = useState(null)

    const { conv_id } = useParams()

    const location = useLocation()

    const messageId = location.state?.messageId

    const getCurrentConv = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/conversations/get_current/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAccessToken()}`
                },
                body: JSON.stringify({
                    'conv_id': conv_id
                })
            })
            const data = await response.json()
            if (!response.ok) {
                toast.error("Error getting chat name!")
            }
            setConv(data)
            console.log(data)

        } catch (error) {
            console.error(error)
        }
    }

    const getChatName = (chat) => {
        if(!chat) return
        if (chat.name?.trim()) return chat.name;

        return chat.participants
            .map((user) => user.name)
            .join(", ");
    };

    const socketRef = useRef(null)

    useEffect(() => {

        if (!conv_id) return
        const initializeChat = async () => {

            await openChat(conv_id, setMessages)

            socketRef.current = chatSocket(conv_id)

            socketRef.current.onmessage = (event) => {
                const data = JSON.parse(event.data)
                setMessages(prev => [...prev, data])
            };
        };

        initializeChat()
        getCurrentConv()
        return () => {
            socketRef.current?.close()
            socketRef.current = null
        }
    }, [conv_id])

    // Auto scroll to Bottom of Page.
    useEffect(() => {
        if (messageId) return
        if (!messages.length) return;

        const currentLastId = messages[messages.length - 1].id;

        if (lastMessageId.current !== currentLastId) {
            bottomRef.current?.scrollIntoView({
                behavior: "smooth",
            });

            lastMessageId.current = currentLastId;
        }
    }, [messages]);




    useEffect(() => {
        if (!messageId) return;

        const element = document.getElementById(`message-${messageId}`);

        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    }, [messages, messageId])




    const generateChat = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/chat/${conv_id}/pdf/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getAccessToken()}`
                }
            }
            )

            if (!response.ok) {
                throw new Error("Failed to download PDF")
            }

            setExportStatus('generating')



        } catch (error) {
            console.error(error)
        }
    }

    const downloadChat = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/chat/export/${exportId}/pdf/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getAccessToken()}`
                }
            }
            )

            if (!response.ok) {
                throw new Error("Failed to download PDF")
            }
            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "chat.pdf";
            a.click();

            window.URL.revokeObjectURL(url);




        } catch (error) {
            console.error(error)
        }
    }


    const formMessage = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("text_message", newMessage)
        if (selectedFiles) {
            selectedFiles.forEach(file => {
                formData.append("files", file);
            })
        }

        if (selectedFiles || newMessage.trimEnd())
            await fetch(`http://127.0.0.1:8000/api/chat/${conv_id}/send/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`
                },
                body: formData
            })
        setNewMessage('')
        setSelectedFiles(null)

    }

    return (
        <div className="mx-auto flex h-[calc(100vh-5rem)] w-full max-w-5xl flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
            {/* Header */}
            <header className="flex items-center justify-between border-b bg-background px-6 py-4">
                <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarFallback>
                            {user?.username?.[0]?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <h2 className="text-lg font-semibold">
                            {getChatName(conv)}
                        </h2>

                        <p className="text-sm text-muted-foreground">
                            Logged in as {user?.username}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {exportStatus === "idle" && (
                        <Button
                            variant="outline"
                            onClick={generateChat}
                        >
                            <FileDown className="mr-2 h-4 w-4" />
                            Export PDF
                        </Button>
                    )}

                    {exportStatus === "generating" && (
                        <Badge
                            variant="secondary"
                            className="flex items-center gap-2 px-3 py-2"
                        >
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Generating PDF...
                        </Badge>
                    )}

                    {exportStatus === "ready" && (
                        <Button onClick={downloadChat}>
                            <FileDown className="mr-2 h-4 w-4" />
                            Download PDF
                        </Button>
                    )}
                </div>
            </header>

            {/* Messages */}
            <main className="flex-1 overflow-y-auto bg-muted/30 p-6">
                <TextMessages
                    messages={messages}
                    username={user?.username}
                />

                <div ref={bottomRef} />
            </main>

            {/* Footer */}
            <footer className="border-t bg-background p-4">
                {selectedFiles?.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                        {selectedFiles.map((file, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                            >
                                {file.name}
                            </Badge>
                        ))}
                    </div>
                )}

                <form
                    onSubmit={formMessage}
                    className="flex items-center gap-3"
                >
                    <input
                        hidden
                        multiple
                        id="filePicker"
                        type="file"

                        onChange={(e) =>
                            setSelectedFiles(Array.from(e.target.files))
                        }
                    />

                    <label
                        htmlFor="filePicker"
                        className="cursor-pointer"
                    >
                        <Paperclip className="h-7 w-7 hover:bg-gray-200 p-1  " />
                    </label>

                    <Input
                        maxLength={199}
                        value={newMessage}
                        onChange={(e) =>
                            setNewMessage(e.target.value)
                        }
                        placeholder="Type a message..."
                    />

                    <Button type="submit">
                        <Send className="mr-2 h-4 w-4" />
                        Send
                    </Button>
                </form>
            </footer>
        </div>
    );
}

export default DirectMessage