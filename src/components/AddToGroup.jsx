import { useUserContext } from '@/context/UserContext'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { GrClose } from 'react-icons/gr'
import { getAccessToken } from '@/utils/auth'
import { Input } from './ui/input'

const AddToGroup = () => {
    const { users, setMakeGroup,getUsers } = useUserContext()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [chatName, setChatName] = useState('')

    const createGroup = async () => {
        try {

            const response = await fetch('http://127.0.0.1:8000/api/conversations/create_group_chat/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAccessToken()}`
                },
                body: JSON.stringify({
                    'user_ids': selectedUsers,
                    'group_name':chatName
                })
            })
            const data = await response.json()
            console.log(data)
            setMakeGroup(false)
        } catch (error) {
            console.error(error)
            setMakeGroup(false)
        }


    }


    return (
        <div className='absolute z-20 bg-muted w-[400px] h-[80%] overflow-y-auto flex flex-col justify-between rounded-3xl '>
            <div>

                <div className='flex items-center justify-between px-10 py-3'>
                    <p className='font-heading text-2xl'>Add To Group</p>
                    <GrClose className='p-2 w-8 h-8 hover:bg-black hover:text-white cursor-pointer' onClick={() => setMakeGroup(false)} />
                </div>
                <div className='w-full h-[2px] bg-gray-200'></div>

                {users.map((user) => {
                    return (
                        <div key={user.id}>
                            <div className='flex justify-between items-center p-5'>
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
                                    {user.username[0].toUpperCase()}
                                </div>
                                <div className='w-[50%] text-center overflow-hidden text-ellipsis whitespace-nowrap'>{user.username}</div>
                                {/* <button onClick={() => console.log(selectedUsers)}>BUTTON</button> */}
                                {selectedUsers.includes(user.id) ? (
                                    <Button variant="outline"
                                        onClick={() => setSelectedUsers(prev => prev.filter(id => id !== user.id))}
                                        className='hover:bg-gray-200'>Remove</Button>
                                ) : (
                                    <Button
                                        onClick={() => setSelectedUsers(prev => [...prev, user.id])}
                                    >Add</Button>
                                )}
                            </div>
                            <div className='w-full h-[2px] bg-gray-200'></div>
                        </div>
                    )
                })}
            </div>
            <div className=' sticky bottom-0  w-full'>

                <Input
                    type="text"
                    placeholder="Enter group name..."
                    value={chatName}
                    onChange={(e) => setChatName(e.target.value)}
                    className="h-11 rounded-t-xl w-full border border-border bg-background px-4 text-sm"
                />
                <Button className='w-full border-0' onClick={() => createGroup()}>Create</Button>
            </div>

        </div>
    )
}

export default AddToGroup