import React, { useState, useEffect, useRef } from 'react';

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [senderName, setSenderName] = useState('Alice'); 
  

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/get_messages/');
      if (response.ok) {
        const data = await response.json();

        setMessages(data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };


  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      const response = await fetch("http://127.0.0.1:8000/api/send_text/",
        {
          method : "POST",
          headers: {
          'Content-Type': 'application/json',
        },
          body :JSON.stringify({
            "sender_name":senderName,
            "message":newMessage
          })
        }
      ) 
      if (response.ok){
        setNewMessage("")
        fetchMessages()
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  

  useEffect(() => {
    fetchMessages();

    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="flex flex-col h-screen max-w-2xl  mx-auto bg-gray-50 border-x border-gray-200">




      <header className="p-4 bg-indigo-600 text-white flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold tracking-wide">CHAT ROOM</h1>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-indigo-200">As:</span>
          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            className="px-2 py-1 text-sm bg-indigo-700 text-white rounded border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-white w-24 sm:w-32"
            placeholder="Your Name"
          />
        </div>

      </header>


      <main className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.sender_name === senderName;
          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[75%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
            >
              
              {!isMe && (
                <span className="text-xs text-gray-500 font-semibold mb-0.5 ml-1">
                  {msg.sender_name}
                </span>
              )}
              
              <div
                className={`px-4 py-2.5 rounded-2xl text-sm break-words shadow-sm ${isMe
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                  }`}
              >
                {msg.message}
              </div>
              
              <span className="text-[10px] text-gray-400 mt-1 px-1">
                {msg.timestamp.split(' ')[1]} 
              </span>
            </div>
          )
        })}
        <div  />
      </main>



      <footer className="p-4 bg-white border-t border-gray-200 shadow-lg">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full transition-colors duration-200 text-sm shadow-md"
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  )
}

export default ChatBox