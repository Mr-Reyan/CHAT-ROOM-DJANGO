import React from "react";
import { Link } from "react-router-dom";
import { MessageCircleMore } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
    
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-8 md:flex-row">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <MessageCircleMore className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">
            ChatSphere
          </span>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/" className="transition hover:text-foreground">
            Home
          </Link>

          <Link to="/about" className="transition hover:text-foreground">
            About
          </Link>

          <Link to="/all-users" className="transition hover:text-foreground">
            Users
          </Link>
        </div>

        {/* Socials */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Mr-Reyan"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 transition hover:bg-muted"
          >
            <FaGithub className="w-5 h-5"/>
          </a>

          <a
            href="https://linkedin.com/in/reyan-chaudhary/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 transition hover:bg-muted"
          >
            <FaLinkedin className="h-5 w-5" />
          </a>
        </div>
      </div>

      <div className="border-t py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ChatSphere. Built with React, Django &
        Shadcn UI.
      </div>
    </footer>
  );
};

export default Footer;