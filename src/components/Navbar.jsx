import React, { useState } from 'react'
import Button from './Button'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../context/UserContext'
import { getAccessToken } from '../utils/auth'
import notif_1 from '../assets/notif_1.png'
const Navbar = () => {
  const navigate = useNavigate()
  const {user,setUser} = useUserContext()
  const [showNotif, setShowNotif] = useState(false)
  const [notifCount, setNotifCount] = useState(0)
  
  function Logout(){
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    setUser(null)
    navigate("/login")
  }


  return (
    <nav className="bg-white shadow-md">
      <div className="sticky top-0 w-screen z-10  mx-auto justify-between px-6 py-4 flex items-center ">
        <a href='/all-users' className="text-2xl font-bold text-blue-600">
          Chat Room
        </a>
        {user?(
          <div className='flex items-center gap-5 justify-center'>
            <div className='relative'>
              <p className='p-2 text-sm rounded-full left-5 top-1 cursor-pointer absolute bg-indigo-600 h-3 w-3 text-white flex items-center justify-center  '>0</p>
              <img src={notif_1} className='w-10 hover:bg-gray-100 p-2 cursor-pointer rounded-full' />
            </div>
            <Button onclick={Logout} text = "Logout"  />
          </div>
        ):(
        <div>
          <Button onclick={()=>navigate("/login")} text = "Login" />
          <Button onclick={()=>navigate("/signup")} text = "Signup" />
        </div>
        )}

      </div>
    </nav>
  )
}

export default Navbar