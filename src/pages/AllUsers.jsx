import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { startChat, openChat } from '../utils/openChat'
import { getAccessToken } from '../utils/auth'
import { useUserContext } from '../context/UserContext'
import { Button } from "@/components/ui/button";
import AddToGroup from '@/components/AddToGroup'

const AllUsers = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [next, setNext] = useState(null)
    const [prev, setPrev] = useState(null)
    const [count, setCount] = useState(0)
    const totalPages = Math.ceil(count / 5);
    const navigate = useNavigate()
    const { users, setUsers,makeGroup,setMakeGroup } = useUserContext()

    let page = Number(searchParams.get("page")) || 1;

    const getUsers = async (url = 'http://127.0.0.1:8000/api/all_users/') => {
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

    if (!users || users.length === 0) return <div className='flex justify-center items-center font-md text-xl mt-5'>No Users Yet!</div>

    return (
        <div>
            <div className={`w-full absolute z-10 backdrop-blur-xs h-screen ${makeGroup?'':'hidden'}`}></div>
            <div className="mx-auto flex  min-h-screen w-full max-w-5xl flex-col px-6 py-8">
                {makeGroup && (
                    <div className='flex justify-center'>
                        <AddToGroup  />
                    </div>
                )}
                <div className="mb-8 flex justify-between items-center">
                    <div>

                        <h1 className="text-3xl font-bold">Start a Conversation</h1>
                        <p className="text-muted-foreground">
                            Find people and start chatting instantly.
                        </p>
                    </div>
                    <div>
                        <Button
                            onClick={() => {
                                setMakeGroup(true)
                            }}
                        >Create Group Chat</Button>
                    </div>
                </div>


                <div className="space-y-4">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center justify-between rounded-xl border bg-card p-5 transition-all hover:shadow-md"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
                                    {user.username[0].toUpperCase()}
                                </div>

                                <div>
                                    <h3 className="font-semibold">
                                        {user.username}
                                    </h3>

                                    <p className="text-sm text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            {user.has_conversation ? (
                                <Button
                                    onClick={() =>
                                        navigate(`/chat/${user.conversation_id}`)
                                    }
                                >
                                    Open Chat
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        startChat(user.id, setUsers)
                                    }
                                >
                                    Start Chat
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </p>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            disabled={!prev}
                            onClick={() => {
                                getUsers(prev);
                                setSearchParams({ page: page - 1 });
                            }}
                        >
                            Previous
                        </Button>

                        <Button
                            variant="outline"
                            disabled={!next}
                            onClick={() => {
                                getUsers(next);
                                setSearchParams({ page: page + 1 });
                            }}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AllUsers