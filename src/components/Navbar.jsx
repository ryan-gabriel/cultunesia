"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Menu,
  LogIn,
  UserPlus,
  LogOut,
  User,
  BookOpen,
  ListChecks,
  Map,
  Trophy,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const navLinks = [
    { label: "Blog", href: "#" },
    { label: "Quiz", href: "#" },
    { label: "Leaderboard", href: "#" },
    { label: "Provinces", href: "#" },
  ];

  const user = useAuth()

  return (
    <motion.nav
      className="w-full flex items-center justify-between px-8 py-5 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 sticky top-0 z-50"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Logo */}
      <motion.a
        href="/"
        className="flex items-center gap-2"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <img src="/Logo Full.svg" alt="Cultunesia Logo" className="w-40" />
      </motion.a>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link, i) => (
          <motion.a
            key={i}
            href={link.href}
            className="relative text-sm font-medium text-gray-600 hover:text-primary-blue transition-colors group"
            whileHover={{ y: -1 }}
            transition={{ duration: 0.2 }}
          >
            {link.label}
            <motion.span
              className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-blue group-hover:w-full transition-all duration-300"
            />
          </motion.a>
        ))}
      </div>

      {/* Right Section: Auth + Profile */}
      <div className="flex items-center gap-4">
        {/* Login / Register */}
        <div className="hidden md:flex gap-3">
          <Button variant="ghost" className="flex items-center gap-2 text-sm font-medium hover:bg-gray-50">
            <LogIn className="w-4 h-4" /> Login
          </Button>
          <Button variant="default" className="flex items-center gap-2 text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
            <UserPlus className="w-4 h-4" /> Register
          </Button>
        </div>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="cursor-pointer">
              <AvatarImage src="https://via.placeholder.com/150" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="flex items-center gap-2">
              <User className="w-4 h-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 text-red-600">
              <LogOut className="w-4 h-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {navLinks.map((link, i) => (
                <DropdownMenuItem key={i} asChild>
                  <a href={link.href} className="flex items-center gap-2">
                    {link.icon}
                    {link.label}
                  </a>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem>
                <LogIn className="w-4 h-4 mr-2" /> Login
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserPlus className="w-4 h-4 mr-2" /> Register
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;