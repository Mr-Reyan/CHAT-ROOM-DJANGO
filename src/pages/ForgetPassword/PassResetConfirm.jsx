import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Lock } from "lucide-react";
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

const PassResetConfirm = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");

  const changePassword = async (e) => {
    e.preventDefault();

    if (password !== passwordAgain) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/password_reset_confirm/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid,
            token,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Password changed successfully.");
        navigate("/password-reset-done");
      } else {
        toast.error(data.error || "Unable to reset password.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Lock className="h-7 w-7" />
          </div>

          <CardTitle>Create New Password</CardTitle>

          <CardDescription>
            Enter your new password below.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={changePassword} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password">
                New Password
              </Label>

              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">
                Confirm Password
              </Label>

              <Input
                id="confirm-password"
                type="password"
                placeholder="Re-enter new password"
                value={passwordAgain}
                onChange={(e) => setPasswordAgain(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PassResetConfirm;