import React, { createElement, useEffect, useRef } from 'react';
import { getAccessToken } from '../utils/auth'

const TextMessages = ({ messages, username }) => {
    const observer = useRef(null);

    const downloadFile = async (url,filename)=>{
        const response = await fetch(url)
        if(!response.ok){
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
        )

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
                            className={`${isMe?
                                 msg.content? 'px-4 py-2.5 rounded-2xl text-sm break-all shadow-sm bg-indigo-600 text-white rounded-tr-none' : ''
                                : msg.content? 'px-4 py-2.5 rounded-2xl text-sm break-all shadow-sm bg-white text-gray-800 border border-gray-200 rounded-tl-none':''
                                }`}
                        >
                            {msg.content}
                        </div>
                        {msg.files && (
                            msg.files.map((file) => {
                                console.log(file)
                                return (
                                    <div key={file.id} className='flex items-center justify-center '>
                                        {file.file.endsWith('.png') || file.file.endsWith('.jpg') || file.file.endsWith('.jpeg')?(

                                            <img src={`http://127.0.0.1:8000${file.file}`} className='w-30 h-30 object-cover shadow-md rounded-md' alt=""  />
                                        ):(
                                            <div>DOWNLOAD THIS FILE HERE!</div>
                                        )}
                                    <button
                                    onClick={()=>{
                                        downloadFile(
                                        msg.files.file,
                                        msg.files[0].file.split('/').pop() 
                                    )}}
                                    >
                                        <img src="https://img.icons8.com/material-sharp/96/download--v1.png" className='w-6 ml-2 rounded-full hover:bg-green-600 bg-green-400 p-1' alt="" />
                                    </button>
                                    </div>
                                )
                            }
                            )
                        )}
                        
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