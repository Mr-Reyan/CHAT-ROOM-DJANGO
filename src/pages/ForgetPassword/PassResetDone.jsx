import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PassResetDone = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <CardTitle>Password Reset Complete</CardTitle>

          <CardDescription>
            Your password has been updated successfully.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 text-center">
          <p className="text-sm text-muted-foreground">
            Your password has been set. You can now log in using your new
            password.
          </p>

          <Button asChild className="w-full">
            <Link to="/login">Go to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PassResetDone