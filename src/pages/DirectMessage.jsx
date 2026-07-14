import React, { useRef, useState, useEffect } from 'react'
import { useUserContext } from '../context/UserContext';
import { useNavigate, useParams } from 'react-router-dom';
import { openChat } from '../utils/openChat';
import TextMessages from '../components/TextMessages';
import Button from '../components/Button';
import { getAccessToken, refreshAccessToken } from '../utils/auth';
import { toast } from 'react-toastify';
import { chatSocket } from '../utils/websocket';
import { useLocation } from "react-router-dom";

const DirectMessage = () => {
    const { user, NotifSocketRef, exportId,exportStatus,setExportStatus } = useUserContext()


    const bottomRef = useRef(null)
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [downloading, setDownloading] = useState(false)

    const navigate = useNavigate()
    const lastMessageId = useRef(null)

    const { conv_id } = useParams()

    const location = useLocation()

    const messageId = location.state?.messageId



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

        initializeChat();

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


    const handleSendMessage = (e) => {
        e.preventDefault();

        socketRef.current?.send(
            JSON.stringify({
                message: newMessage,
            })
        )

        setNewMessage("")
    };


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

            setDownloading(true)
            setExportStatus('generating')

            console.log(response)


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

            setDownloading(true)

            console.log(response)


        } catch (error) {
            console.error(error)
        }
    }




    return (

        <div className="flex flex-col h-[80%] my-auto  min-w-2xl rounded-b-lg mx-auto bg-gray-50 border-x border-gray-200">




            <header className="p-4 bg-indigo-600 text-white rounded-t-lg flex justify-between items-center shadow-md">
                <h1 className="text-xl font-bold tracking-wide">CHAT ROOM</h1>
                {exportStatus === "idle" && (
                    <img onClick = { generateChat }
                        width = "25"
                        height = "25"
                        className = ' hover:bg-green-600 bg-green-500 p-1  rounded-full cursor-pointer'
                        src = "https://img.icons8.com/material-sharp/96/download--v1.png" alt = "download--v1" />
                )}

                {exportStatus === "generating" && (
                    <p className='text-white text-sm'>Generating PDF...</p>
                )}

                {exportStatus === "ready" && (
                    <button
                    onClick={downloadChat}
                    className='bg-green-600 text-sm cursor-pointer hover:bg-green-700 transition-all p-2 text-white rounded-lg '>
                        Download Chat
                    </button>
                )}
                
                <div className="flex items-center space-x-2">
                    <span className="text-s font-medium text-indigo-100 ">username: {user?.username}</span>
                </div>

            </header>


            <main className="flex-1  overflow-y-auto p-4 space-y-3">
                <TextMessages messages={messages} username={user?.username} />
                <div ref={bottomRef} />
                <div />
            </main>



            <footer className="p-4 bg-white rounded-b-lg border-t border-gray-200 shadow-lg">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                        maxLength="199"
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                    <Button text="Send" />

                </form>
            </footer>
        </div>

    )
}

export default DirectMessage