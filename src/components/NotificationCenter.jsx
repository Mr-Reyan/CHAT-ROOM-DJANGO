import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck } from "lucide-react";

import { useUserContext } from "../context/UserContext";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const NotificationCenter = () => {
  const navigate = useNavigate();

  const { notification, markRead, notifCount } = useUserContext();

  const handleNotificationClick = (notif) => {
    navigate(`/chat/${notif.conv_id}?message=${notif.message.id}`, {
      state: {
        messageId: notif.message.id,
      },
    });
  };

  return (
    <Card className="w-[380px] shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>

        <Badge variant="secondary">
          {notification.length}
        </Badge>
      </CardHeader>

      <Separator />
      <CardContent className="p-0">
        <ScrollArea className="h-[420px]">
          {notifCount > 0 ? (
            notification.filter((notif)=>!notif.is_read).map((notif) => {

              return (
                <div
                  key={notif.id}
                  className="flex cursor-pointer items-start gap-3 p-4 transition hover:bg-muted"
                >
                  <Avatar>
                    <AvatarFallback>
                      {notif.sender.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div
                    onClick={() => handleNotificationClick(notif)}
                    className="flex-1"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        {notif.sender.username}
                      </p>

                      <span className="text-xs text-muted-foreground">
                        {notif.created_at.split(" ")[1]}
                      </span>
                    </div>

                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {notif.message.content}
                    </p>
                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      markRead(notif.id);
                    }}
                  >
                    <CheckCheck className="h-4 w-4" />
                  </Button>
                </div>
              )
            }
            )

          ) : (

            <div className="flex h-56 flex-col items-center justify-center gap-3" >
              <Bell className="h-12 w-12 text-muted-foreground" />

              <p className="text-sm text-muted-foreground">
                No notifications yet
              </p>
            </div>

          )


          }

        </ScrollArea>
      </CardContent>
    </Card >
  );
};

export default NotificationCenter;