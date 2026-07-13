import { getAccessToken } from "./auth";

export function chatSocket(conv_id) {
    const socket = new WebSocket(
        `ws://127.0.0.1:8000/ws/chat/${conv_id}/?token=${getAccessToken()}`
    );

    socket.onopen = () => {
        console.log("Connected");
    };

    
    socket.onclose = () => {
        console.log("Disconnected");
    };
    
    socket.onerror = (error)=>{
        console.log(error);
    }

    return socket;
}

export function notifSocket(user_id){
    const socket = new WebSocket(
        `ws://127.0.0.1:8000/ws/notifications/${user_id}/?token=${getAccessToken()}`
    )

    socket.onopen=()=>{
        console.log("Connected");
    }
    socket.onclose=()=>{
        console.log("Disconnected");
    }
    socket.onerror=(error)=>{
        console.log(error)
    }

    return socket
}