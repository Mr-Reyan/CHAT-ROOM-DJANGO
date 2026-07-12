import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("access_token") || "");
    const [users, setUsers] = useState([])

    const getUser = async ()=>{
        try{

            const response = await fetch("http://127.0.0.1:8000/api/current_user/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
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

        if(!token){return}
        getUser()

    }, [token])



    return (
        <AppContext.Provider
            value={{
                user,
                setUser,
                token,
                setToken,
                users,
                setUsers
            }}
        >
            {children}
        </AppContext.Provider>
    );
};


export const useUserContext = () => useContext(AppContext)