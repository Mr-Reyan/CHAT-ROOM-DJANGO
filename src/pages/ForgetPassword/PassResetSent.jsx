import React from "react";
import { MailCheck } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const PassResetSent = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <MailCheck className="h-7 w-7" />
          </div>

          <CardTitle>Password Reset Sent</CardTitle>

          <CardDescription>
            We've sent you an email with instructions to reset your password.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-center text-sm text-muted-foreground">
          <p>
            If an account exists with the email you entered, you should receive
            the reset link shortly.
          </p>

          <p className="font-medium text-foreground">
            Don't forget to check your spam folder.
          </p>

          <p>
            If you still don't receive an email, make sure you entered the
            correct email address.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PassResetSent;