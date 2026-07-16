
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
    const [makeGroup, setMakeGroup] = useState(false)
    const NotifSocketRef = useRef(null)
    const [groups,setGroups]=useState([])
 
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
    
    
    


    useEffect(() => {
        if(notification){
            setNotifCount(notification.length);
        }

    }, [notification]);

    useEffect(() => {

        if(!getAccessToken()){return}
        getUser()

    }, [getAccessToken()])




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
                getUser,
                makeGroup,
                setMakeGroup,
                groups,
                setGroups,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};


export const useUserContext = () => useContext(AppContext)