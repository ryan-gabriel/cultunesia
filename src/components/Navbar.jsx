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

const Navbar = () => {
  const navLinks = [
    { label: "Blog", href: "#" },
    { label: "Quiz", href: "#" },
    { label: "Leaderboard", href: "#" },
    { label: "Provinces", href: "#" },
  ];

  return (
    <motion.nav
      className="w-full flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-lg shadow-sm sticky top-0 z-50"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Logo */}
      <motion.a
        href="/"
        className="flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <img src="/Logo Full.svg" alt="Cultunesia Logo" className="w-36" />
      </motion.a>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center gap-6">
        {navLinks.map((link, i) => (
          <motion.a
            key={i}
            href={link.href}
            className="flex items-center gap-2 text-gray-700 hover:text-primary-blue transition-colors"
            whileHover={{ y: -2 }}
          >
            {link.label}
          </motion.a>
        ))}
      </div>

      {/* Right Section: Auth + Profile */}
      <div className="flex items-center gap-4">
        {/* Login / Register */}
        <div className="hidden md:flex gap-3">
          <Button variant="ghost" className="flex items-center gap-1">
            <LogIn className="w-4 h-4" /> Login
          </Button>
          <Button variant="default" className="flex items-center gap-1">
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
