import React, { useEffect, useRef, useState } from 'react'
import Button from './Button'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../context/UserContext'
import { getAccessToken } from '../utils/auth'
import notif_1 from '../assets/notif_1.png'
import notif_2 from '../assets/notif_2.png'
import { notifSocket } from '../utils/websocket'
import { getNotif } from '../utils/openChat'
import NotificationCenter from './NotificationCenter'
import { toast } from 'react-toastify'
const Navbar = () => {
  const navigate = useNavigate()
  const { user, setUser, setNotification, notification, notifCount, NotifSocketRef,setExportId,setExportStatus } = useUserContext()
  const [showNotif, setShowNotif] = useState(false)





  useEffect(() => {
    if (!user) return

    const initializeNotif = async () => {
      await getNotif(user.id, setNotification)
      NotifSocketRef.current = notifSocket(user.id)
      NotifSocketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data)
        console.log(data);
        
        if (data.type === 'export_ready') {
          setExportId(data.export_id)
          setExportStatus('ready')
          toast.success(data.message)

        } else {

          toast.info(`${data.sender.username}: ${data.message.content}`)
          setNotification(prev => {
            const updated = [data, ...prev]
            return updated
          })
        }
      }
    }

    initializeNotif()
    return () => {
      NotifSocketRef.current?.close()
      NotifSocketRef.current = null
    }

  }, [user])


  function Logout() {
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
        {user ? (
          <div className='relative'>
            <div className='flex items-center gap-5 justify-center'>
              <div className='relative'>
                <p className='p-2.5  text-[12px] rounded-full left-5 top-1 cursor-pointer absolute bg-indigo-600 h-3 w-3 text-white flex items-center justify-center  '>{notifCount > 9 ? ('9+') : (notifCount) || '0'}</p>
                {showNotif ? (
                  <img
                    onClick={() => setShowNotif(false)}
                    src={notif_2}
                    className='w-10 hover:bg-gray-100 p-2 cursor-pointer rounded-full' />
                ) : (
                  <img
                    onClick={() => setShowNotif(true)}
                    src={notif_1}
                    className='w-10 hover:bg-gray-100 p-2 cursor-pointer rounded-full' />
                )}

              </div>
              <Button onclick={Logout} text="Logout" />
            </div>

            {showNotif && <NotificationCenter />}
          </div>
        ) : (
          <div>
            <Button onclick={() => navigate("/login")} text="Login" />
            <Button onclick={() => navigate("/signup")} text="Signup" />
          </div>
        )}

      </div>
    </nav>
  )
}

export default Navbar