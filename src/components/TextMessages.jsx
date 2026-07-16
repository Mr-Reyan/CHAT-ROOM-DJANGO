import React, { createElement, useEffect, useRef } from 'react';
import { getAccessToken } from '../utils/auth'
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { useUserContext } from '@/context/UserContext';
import { openChat } from '@/utils/openChat';



const TextMessages = ({ messages, username, oldestMessage }) => {
    const observer = useRef(null);

    const { setNotifCount } = useUserContext()
    const downloadFile = async (url, filename) => {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error("Failed to Download File")
        }
        const blob = await response.blob()
        const downloadUrl = window.URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = downloadUrl
        a.download = filename
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(downloadUrl)
    }

    console.log(oldestMessage);



    const markRead = async (message_id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/notifications/mark_as_read/${message_id}/`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAccessToken()}`
                }
            })
            const data = await response.json()
            setNotifCount(prev => prev - 1)
        } catch (error) {
            console.error(error);

        }
    }
    useEffect(() => {
        if (messages.length > 0) {
            console.log(messages[messages.length - 1]);

        }
    }, [messages])

    useEffect(() => {
        observer.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const messageId = entry.target.dataset.messageId;

                        markRead(messageId);

                        observer.current.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.8,
            }
        )

        return () => observer.current.disconnect();
    }, [])

    return (
        <div
            
            className=" space-y-5"

        >
            {messages.map((msg) => {
                const isMe = msg.sender.username === username;

                return (
                    <div
                        key={msg.id}
                        id={`message-${msg.id}`}
                        data-message-id={msg.id}
                        ref={(element) => {
                            if (element && observer.current && !isMe && !msg.is_read) {
                                observer.current.observe(element);
                            }
                        }}
                        className={`flex ${isMe ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`flex max-w-[75%] gap-3 ${isMe ? "flex-row-reverse" : ""
                                }`}
                        >
                            {!isMe && (
                                <Avatar className="h-9 w-9">
                                    <AvatarFallback>
                                        {msg.sender.username[0].toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            )}

                            <div>
                                {!isMe && (
                                    <p className="mb-1 text-xs font-semibold text-muted-foreground">
                                        {msg.sender.username}
                                    </p>
                                )}

                                {msg.content && (
                                    <div
                                        className={`rounded-2xl px-4 py-3 shadow-sm break-all ${isMe
                                            ? "rounded-br-md bg-primary text-primary-foreground"
                                            : "rounded-bl-md border bg-background"
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                )}

                                {msg.files &&
                                    msg.files.map((file) => {
                                        const isImage = /\.(png|jpg|jpeg|gif|webp)$/i.test(file.file);

                                        return (
                                            <div key={file.id} className="mt-2">
                                                {isImage ? (
                                                    <div className="relative w-fit">
                                                        <img
                                                            src={`http://127.0.0.1:8000${file.file}`}
                                                            alt=""
                                                            className="h-28 w-28 rounded-xl border object-cover shadow-sm"
                                                        />

                                                        <Button
                                                            size="icon"
                                                            variant="secondary"
                                                            className="absolute cursor-pointer bottom-2 right-2 h-8 w-8 rounded-full"
                                                            onClick={() =>
                                                                downloadFile(
                                                                    `http://127.0.0.1:8000${file.file}`,
                                                                    file.file.split("/").pop()
                                                                )
                                                            }
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex w-72 items-center justify-between rounded-xl border bg-muted p-3 shadow-sm">
                                                        <div className="flex items-center gap-3 overflow-hidden">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                                <FileText className="h-5 w-5 text-primary" />
                                                            </div>

                                                            <span className="truncate text-sm font-medium">
                                                                {file.file.split("/").pop()}
                                                            </span>
                                                        </div>

                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="cursor-pointer hover:bg-gray-200 rounded-full"
                                                            onClick={() =>
                                                                downloadFile(
                                                                    `http://127.0.0.1:8000${file.file}`,
                                                                    file.file.split("/").pop()
                                                                )
                                                            }
                                                        >
                                                            <Download className="cursor-pointer h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                <p
                                    className={`mt-1 text-xs text-muted-foreground ${isMe ? "text-right" : ""
                                        }`}
                                >
                                    {msg.created_at.split(" ")[1]}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default TextMessages