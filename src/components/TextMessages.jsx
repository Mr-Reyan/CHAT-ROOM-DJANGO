import React, { useEffect, useRef } from 'react';
import { getAccessToken } from '../utils/auth'

const TextMessages = ({ messages, username }) => {
    const observer = useRef(null);



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
            console.log(data);

        } catch (error) {
            console.error(error);

        }
    }


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
        );

        return () => observer.current.disconnect();
    }, [])

    return (
        <div>
            {messages.map((msg) => {
                const isMe = msg.sender.username == username

                return (
                    <div
                        data-message-id={msg.id}
                        ref={(element) => {
                            if (element && observer.current && !isMe && !msg.is_read) {
                                observer.current.observe(element);
                            }
                        }}
                        id={`message-${msg.id}`}
                        key={msg.id}

                        className={`flex flex-col max-w-[75%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                    >

                        {!isMe && (
                            <span className="text-xs text-gray-500 font-semibold mb-0.5 ml-1">
                                {msg.sender.username}
                            </span>
                        )}

                        <div
                            className={`px-4 py-2.5 rounded-2xl text-sm break-all shadow-sm ${isMe
                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                                }`}
                        >
                            {msg.content}
                        </div>

                        <span className="text-[10px] text-gray-400 mt-1 px-1">
                            {msg.created_at.split(' ')[1]}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}

export default TextMessages