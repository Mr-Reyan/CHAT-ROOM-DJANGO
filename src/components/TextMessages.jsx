import React from 'react'

const TextMessages = ({messages, username}) => {

    return (
        <div>
            {messages.map((msg) => {
                const isMe = msg.sender.username == username
                
                return (
                    <div
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