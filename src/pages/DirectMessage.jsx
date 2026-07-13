import React, { useRef, useState, useEffect } from 'react'
import { useUserContext } from '../context/UserContext';
import { useNavigate, useParams } from 'react-router-dom';
import { openChat } from '../utils/openChat';
import TextMessages from '../components/TextMessages';
import Button from '../components/Button';
import { getAccessToken, refreshAccessToken } from '../utils/auth';
import { toast } from 'react-toastify';
import { chatSocket } from '../utils/websocket';
const DirectMessage = () => {
    const bottomRef = useRef(null)
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const { user, NotifSocketRef } = useUserContext()

    const navigate = useNavigate()
    const lastMessageId = useRef(null)

    const { conv_id } = useParams()

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
        e.preventDefault()
        socketRef.current?.send(
            JSON.stringify({
                message: newMessage,
            })
        )
        if (NotifSocketRef.current?.readyState === WebSocket.OPEN) {
            NotifSocketRef.current.send(
                JSON.stringify({
                    sender_id: user.id,
                    conv_id:conv_id,
                    message: newMessage
                })
            )
        setNewMessage('')
        } else {
            console.log("NOT OPEN!");
            
        }
    }

    return (

        <div className="flex flex-col h-[80%] my-auto  max-w-2xl rounded-b-lg mx-auto bg-gray-50 border-x border-gray-200">




            <header className="p-4 bg-indigo-600 text-white rounded-t-lg flex justify-between items-center shadow-md">
                <h1 className="text-xl font-bold tracking-wide">CHAT ROOM</h1>

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