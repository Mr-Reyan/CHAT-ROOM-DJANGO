import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const technologies = [
  "React",
  "Django REST Framework",
  "WebSockets (Django Channels)",
  "Redis",
  "Celery",
  "JWT Authentication",
  "Shadcn UI",
  "Tailwind CSS",
];

const About = () => {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">About ChatSphere</h1>
        <p className="mt-3 text-muted-foreground">
          ChatSphere is a modern real-time messaging application built to
          provide fast, reliable, and secure communication. It supports
          real-time messaging, file sharing, notifications, and chat export
          while maintaining a clean and responsive user interface.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Technologies Used</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {technologies.map((tech) => (
              <div
                key={tech}
                className="rounded-lg border bg-muted p-3 text-center flex justify-center items-center text-sm font-medium"
              >
                {tech}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-10">
        <h2 className="mb-3 text-2xl font-semibold">Features</h2>

        <ul className="space-y-2 text-muted-foreground">
          <li>• Real-time one-to-one messaging</li>
          <li>• File and image sharing</li>
          <li>• Live notifications</li>
          <li>• JWT-based authentication</li>
          <li>• Password reset via email</li>
          <li>• Export chat history as PDF</li>
          <li>• Responsive and modern interface</li>
        </ul>
      </div>
    </div>
  );
};

export default About;