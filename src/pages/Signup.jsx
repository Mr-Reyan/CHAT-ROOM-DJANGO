import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageCircleMore } from "lucide-react";
import { toast } from "react-toastify";

import { useUserContext } from "../context/UserContext";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const [form, setForm] = useState({
    username: "",
    email:"",
    password: "",

  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/signup/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = Object.values(data).flat()[0];
        toast.error(errorMsg);
        return;
      }

      toast.success("Signed Up successfully!");

      navigate("/login");
    } catch {
      toast.error("Network Error");
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
            Welcome
          </CardTitle>

          <CardDescription>
            Sign up to start chatting with your friends.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="username">
                Username
              </Label>

              <Input
                id="username"
                name="username"
                type='text'
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email
              </Label>

              <Input
                id="email"
                name="email"
                placeholder="Enter your Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password
              </Label>

              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>


            <Button
              type="submit"
              className="w-full"
            >
              Signup
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;