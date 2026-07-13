import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Button from '../components/Button'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { startChat, openChat } from '../utils/openChat'
import { getAccessToken } from '../utils/auth'
import { useUserContext } from '../context/UserContext'

const AllUsers = () => {
    const [searchParams,setSearchParams] = useSearchParams()
    const [next, setNext] = useState(null)
    const [prev, setPrev] = useState(null)
    const [count, setCount] = useState(0)
    const totalPages = Math.ceil(count / 10);
    const navigate = useNavigate()
    const {users, setUsers, convId, setConvId} = useUserContext()

    let page = Number(searchParams.get("page")) || 1;



    const getUsers = async (url = 'http://127.0.0.1:8000/api/all_users/' ,PageNumber = 1) => {
        try {
            let response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${getAccessToken()}`
                }
            })

            const data = await response.json()
            
            if (response.ok) {
                setUsers(data.results)
                setNext(data.next)
                setPrev(data.previous)
                setCount(data.count)
                
                
            }
        } catch (error) {
            console.error(error)
            toast.error("Error Getting Users...")
        }
    }
    

    useEffect(() => {
        getUsers()

    }, [])

    if(!users) return <div className='flex justify-center items-center font-md text-xl mt-5'>No Users Yet!</div>
    return (
        <div className='h-screen flex flex-col justify-between pb-10 overflow-y-auto  m-auto'>

            <div className="w-120 border-r border-gray-200 overflow-y-auto">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="flex relative items-center gap-3 p-4 hover:bg-gray-100 cursor-pointer transition-colors border-b border-gray-100"
                    >
                        <div className='absolute right-1/10 text-white bg-indigo-600 p-4 rounded-full text-sm w-6 h-6 flex justify-center items-center'>0</div>
                        <div className="h-12 w-12 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
                            {user.username[0].toUpperCase()}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">
                                {user.username}
                            </h3>
                            <p className="text-sm text-gray-500 truncate">
                                {user.email}
                            </p>
                        </div>
                        <div>
                            {user.has_conversation?(
                                <button className='cursor-pointer bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-600 transition-all' onClick={() => {
                                    navigate(`/chat/${user.conversation_id}`)

                                }}>Open Chat</button>
                            ):(
                            <button className='cursor-pointer bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-600 transition-all' onClick={() => {
                                startChat(user.id , setUsers)
                            }}>Start Chat</button> 
                        )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-between px-14 gap-3 mt-4">
                <div className="text-sm ">Showing {page} of {totalPages} Pages</div>
                <div className="h-8 w-px bg-gray-300"></div>
                <div>

                    <button
                        disabled={!prev}
                        onClick={() => {
                            getUsers(prev)
                            setSearchParams({ page: page - 1 });
                        }}
                        className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                    >
                        Prev
                    </button>

                    <span className="px-3 py-1 text-sm font-medium">
                        {page}
                    </span>

                    <button
                        disabled={!next}
                        onClick={() => {
                            getUsers(next)
                            setSearchParams({ page: page + 1 });
                        }}
                        className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AllUsers