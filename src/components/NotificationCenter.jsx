import React from "react";
import { useUserContext } from "../context/UserContext";

const NotificationCenter = () => {
  const { notification } = useUserContext()
  console.log(notification);
  
  return (
    <div className="absolute right-4 top-14 w-80 max-h-96 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">
      <div className="border-b border-gray-200 px-4 py-3 font-semibold">
        Notifications
      </div>
      {notification[0].id ? (

        notification.map((notif) => (

          <div
            key={notif.id}
            className="flex items-start gap-3 border-b border-gray-100 p-4 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
              {notif.sender.username[0]}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-gray-900">
                {notif.sender.username}
              </p>

              <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                {notif.message}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                {notif.created_at.split(' ')[1]}
              </p>
            </div>
          </div>

        ))
      ) : (
        <p>No Notificaitons Yet</p>
      )
      }
      
    </div>
  );
};

export default NotificationCenter;