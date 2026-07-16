import { useUserContext } from '@/context/UserContext'
import { getAccessToken } from '@/utils/auth'
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AddToGroup from '@/components/AddToGroup';

const Groups = () => {

    const [searchParams, setSearchParams] = useSearchParams()
    const [next, setNext] = useState(null)
    const [prev, setPrev] = useState(null)
    const [count, setCount] = useState(0)
    const totalPages = Math.ceil(count / 5);
    const navigate = useNavigate()
    const {  user, groups, setGroups } = useUserContext()

    let page = Number(searchParams.get("page")) || 1;

    const getGroups = async () => {


        const response = await fetch('http://127.0.0.1:8000/api/conversations/get_groups/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getAccessToken()}`

            }

        })
        const data = await response.json()
        console.log(data)
        if (!response.ok) {
            toast.error("Error getting groups")
            console.log(data)
            return
        }

        setGroups(data)
    }
    useEffect(()=>{
        getGroups()
        console.log(groups);
        
    },[])
    


    return (
        <div>
            {/* <div className={`w-full absolute z-10 backdrop-blur-xs h-screen`}></div> */}
            <div className="mx-auto flex  min-h-screen w-full max-w-5xl flex-col px-6 py-8">
                {/* {makeGroup && (
                    <div className='flex justify-center'>
                        <AddToGroup />
                    </div>
                )} */}
                <div className="mb-8 flex justify-between items-center">
                    <div>

                        <h1 className="text-3xl font-bold">Make Groups Lively</h1>
                        <p className="text-muted-foreground">
                            Connect with your friends and loved one's.
                        </p>
                    </div>
                    <div>
                        {/* <Button
                            onClick={() => {
                                setMakeGroup(true)
                            }}
                        >Create Group Chat</Button> */}
                    </div>
                </div>


                <div className="space-y-4">
                    {groups.length>0?(

                        groups.map((conv) => (
                            <div
                            key={conv.id}
                            className="flex items-center justify-between rounded-xl border bg-card p-5 transition-all hover:shadow-md"
                            >
                            <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
                            {conv.name[0].toUpperCase()}
                            </div>
                            
                            <div>
                            <h3 className="font-semibold">
                            {conv.name}
                            </h3>
                            
                            <p className="text-sm text-muted-foreground">
                            {/* {conv.name} */}
                            </p>
                            </div>
                            </div>
                            
                            <Button
                            onClick={() =>
                                navigate(`/chat/${conv.id}`)
                            }
                            >
                            Open Group
                            </Button>
                            
                            </div>
                        ))
                    ):(
                        <div>NO GROUPS HERE</div>
                    )}
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

export default Groups