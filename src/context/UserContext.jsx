
import React, { useRef } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAccessToken, refreshAccessToken } from "../utils/auth";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([])
    const [notification, setNotification] = useState([])
    const [notifCount, setNotifCount] = useState(0)
    const [exportId,setExportId] = useState(null)
    const [exportStatus, setExportStatus] = useState('idle')

    const NotifSocketRef = useRef(null)
    const getUser = async ()=>{
        try{

            let response = await fetch("http://127.0.0.1:8000/api/current_user/", {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                },
            })
            if(response.status == 401){
                await refreshAccessToken()
                localStorage.setItem('access_token',newToken)
                
                let response = await fetch("http://127.0.0.1:8000/api/current_user/", {
                    headers: {
                        Authorization: `Bearer ${getAccessToken()}`,
                    },
                })

            }
            const data = await response.json()
            
            if(!response.ok){
                toast.error("Error occured while getting user: ",data);

                return
            }
            setUser(data)
            
            
        } catch (error){
            toast.error("Error occured while getting user: ",error);
            
        }

    }
    const firstRender = useRef(true);

    useEffect(() => {
        
        setNotifCount(notification.filter(notif=>!notif.is_read).length);

    }, [notification]);

    useEffect(() => {

        if(!getAccessToken()){return}
        getUser()

    }, [getAccessToken()])


    const startGroup = async()=>{
        console.log("Group made");
        
    }


    return (
        <AppContext.Provider
            value={{
                user,
                setUser,
                users,
                setUsers,
                notification,
                setNotification,
                NotifSocketRef,
                notifCount,
                setNotifCount,
                exportId,
                setExportId,
                exportStatus,
                setExportStatus,
                getUser
            }}
        >
            {children}
        </AppContext.Provider>
    );
};


export const useUserContext = () => useContext(AppContext)