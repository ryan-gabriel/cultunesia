"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, LogIn, UserPlus, Moon, Sun, Laptop } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import UserAvatar from "./UserAvatar";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeProvider";

const Navigation = () => {
  const navLinks = [
    { label: "Blog", href: "/blogs" },
    { label: "Quiz", href: "/quizzes" },
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "Provinces", href: "#" },
  ];

  const { session, profile, loading } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <motion.nav
      className="w-full flex items-center justify-between px-8 py-5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100/50 dark:border-gray-800/50 z-50 pb-8"
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
        {" "}
        <img src="/Logo Full.svg" alt="Cultunesia Logo" className="w-40" />
      </motion.a>
      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link, i) => (
          <motion.a
            key={i}
            href={link.href}
            className="relative text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-blue dark:hover:text-primary-blue transition-colors group"
            whileHover={{ y: -1 }}
            transition={{ duration: 0.2 }}
          >
            {link.label}
            <motion.span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-blue group-hover:w-full transition-all duration-300" />
          </motion.a>
        ))}
      </div>
      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === "light" && (
                <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
              )}
              {theme === "dark" && (
                <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
              )}
              {theme === "system" && (
                <Laptop className="h-[1.2rem] w-[1.2rem] transition-all" />
              )}

              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Laptop />
              <span>System</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {!loading && (
          <>
            {!session ? (
              <div className="hidden md:flex gap-3">
                <Button
                  asChild
                  variant="ghost"
                  className="flex items-center gap-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <a href="/login">
                    <LogIn className="w-4 h-4" /> Login
                  </a>
                </Button>
                <Button
                  asChild
                  variant="default"
                  className="flex items-center gap-2 text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
                >
                  <a href="/register">
                    <UserPlus className="w-4 h-4" /> Register
                  </a>
                </Button>
              </div>
            ) : (
              <UserAvatar />
            )}
          </>
        )}

        {/* Mobile Sidebar Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 sm:w-80">
              <SheetHeader>
                <SheetTitle>
                  <img
                    src="/Logo Full.svg"
                    alt="Cultunesia Logo"
                    className="w-32"
                  />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col mt-6 gap-4">
                {navLinks.map((link, i) => (
                  <SheetClose asChild key={i}>
                    <a
                      href={link.href}
                      className="text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-blue transition-colors"
                    >
                      {link.label}
                    </a>
                  </SheetClose>
                ))}

                {/* Mobile Auth Section */}
                {!loading && !session && (
                  <div className="flex flex-col gap-3 mt-6">
                    <SheetClose asChild>
                      <a
                        href="/login"
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-blue"
                      >
                        <LogIn className="w-4 h-4" /> Login
                      </a>
                    </SheetClose>
                    <SheetClose asChild>
                      <a
                        href="/register"
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-blue"
                      >
                        <UserPlus className="w-4 h-4" /> Register
                      </a>
                    </SheetClose>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
