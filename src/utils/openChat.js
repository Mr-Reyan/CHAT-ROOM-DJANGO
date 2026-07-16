import { toast } from "react-toastify";
import { getAccessToken } from "./auth";

export async function startChat(user_id, setUsers) {
    if (setUsers) {

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/conversations/create-personal/${user_id}/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAccessToken()}`
                }
            })

            const data = await response.json()

            if (response.ok) {
                setUsers(users =>
                    users.map(user =>
                        user.id === user_id
                            ? {
                                ...user,
                                has_conversation: true,
                                conversation_id: data.id,
                            }
                            : user
                    )
                )
                toast.success("Chat Started.");

            } else {
                const errorMsg = Object.values(data).flat()[0]
                toast.error(errorMsg)
            }


        } catch (error) {
            toast.error("Error starting chat", error)
        }
    }
    else {

    }
}

export async function openChat(conv_id, oldestMessage) {
    try {
        let url
        console.log(oldestMessage);
        
        if(oldestMessage){
             url = `http://127.0.0.1:8000/api/conversations/get_direct_message/${conv_id}/?before=${oldestMessage.id}`
        } else{
             url = `http://127.0.0.1:8000/api/conversations/get_direct_message/${conv_id}/`
        }
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`
            }
        })
        
        return await response.json()

    } catch (error) {
        toast.error("Error opening Chat!", error)
    }
}


export async function getNotif(user_id,setNotification) {
    try{
        const response = await fetch(`http://127.0.0.1:8000/api/notifications/${user_id}/`,{
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${getAccessToken()}`
            }
        })
        const data = await response.json()  
        console.log(data);
        if(!data.info){
            setNotification(data)
        }
    } catch(error){
        toast.error("Error getting Notifications",error)
    }

}