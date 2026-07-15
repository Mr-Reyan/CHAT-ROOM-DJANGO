import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircleMore, Mail } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ForgetPass = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/password_reset/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        toast.info(data.message);
        setEmail("");
        navigate("/password-reset-sent");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-6">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <MessageCircleMore className="h-7 w-7" />
          </div>

          <CardTitle className="text-3xl">
            Reset Password
          </CardTitle>

          <CardDescription>
            Enter your email address and we'll send you a password reset link.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address
              </Label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
            >
              Send Reset Link
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgetPass;