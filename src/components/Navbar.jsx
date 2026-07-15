import React, { useEffect, useRef, useState } from 'react'
// import Button from './Button'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../context/UserContext'
import { getAccessToken } from '../utils/auth'
import notif_1 from '../assets/notif_1.png'
import notif_2 from '../assets/notif_2.png'
import { notifSocket } from '../utils/websocket'
import { getNotif } from '../utils/openChat'
import NotificationCenter from './NotificationCenter'
import { toast } from 'react-toastify'
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, MessageCircleMore } from "lucide-react";
import { Bell, BellDot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const Navbar = () => {
  const navigate = useNavigate()
  const { user, setUser, setNotification, notification, notifCount, NotifSocketRef, setExportId, setExportStatus } = useUserContext()
  const [showNotif, setShowNotif] = useState(false)
  const [open, setOpen] = useState(false)



  

  useEffect(() => {
    
    if (!user) return

    const initializeNotif = async () => {
      await getNotif(user.id, setNotification)
      NotifSocketRef.current = notifSocket(user.id)
      NotifSocketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data)

        if (data.type === 'export_ready') {
          setExportId(data.export_id)
          setExportStatus('ready')
          toast.success(data.message)

        } else {
          
          let currentConvId = window.location.href.split("?")[0].split("/")[4]
          
          if(data.conv_id != currentConvId){
            toast.info(`${data.sender.username}: ${data.message.content}`)
          }
          

          setNotification(prev => [data, ...(prev || [])])

        }
      }

      
      return () => {
        NotifSocketRef.current?.close()
        NotifSocketRef.current = null
      }
      
    }
    initializeNotif()
  }, [user])


  function Logout() {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    setUser(null)
    navigate("/login")
  }



  return (

    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <a onClick={() => navigate('/')} className="cursor-pointer flex items-center gap-2">
          <MessageCircleMore className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold">ChatSphere</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a onClick={() => navigate('/all-users')} className="cursor-pointer hover:underline">
            All Users
          </a>

          <a onClick={() => navigate('/about')} className="cursor-pointer hover:underline">
            About
          </a>

          {/* <a href="#contact" className="hover:text-primary">
            Contact
          </a> */}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden gap-3 md:flex">
          {user ? (
            <div className="relative flex items-center gap-4">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotif(!showNotif)}
                  className="relative cursor-pointer rounded-full p-2 transition hover:bg-accent"
                >
                  {showNotif ? (
                    <BellDot className="h-6 w-6" />
                  ) : (
                    <Bell className="h-6 w-6" />
                  )}

                  {notifCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                      {notifCount > 9 ? "9+" : notifCount}
                    </span>
                  )}
                </button>

                {showNotif && (
                  <div className="absolute right-0 top-14 z-50">
                    <NotificationCenter />
                  </div>
                )}
              </div>

              {/* User Avatar */}
              <Avatar className="h-10 w-10 cursor-pointer">
                {/* <AvatarImage src={user.profile_picture} /> */}
                <AvatarFallback>
                  {user.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <Button variant="outline" onClick={Logout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                className='cursor-pointer'
                variant="ghost"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>

              <Button
                className='cursor-pointer'
                onClick={() => navigate("/signup")}>
                Sign Up
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <SheetContent side="right" className="w-full">
            <div className="mt-10 flex flex-col px-5 gap-6">
              <a
              onClick={()=>navigate('/all-users')}
              className="text-lg font-medium hover:underline"
              >
                Users
              </a>

              <a
                onClick={()=>navigate('/about')}
                className="text-lg font-medium hover:underline"
              >
                About
              </a>

              <a
                href="#contact"
                className="text-lg font-medium hover:underline"
              >
                Contact
              </a>

              <hr />

              <Button variant="outline" onClick={() => navigate("/login")} className=" w-full">
                Login
              </Button>

              <Button onClick={() => navigate("/signup")} className="w-full">
                Get Started
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>

  )
}

export default Navbar