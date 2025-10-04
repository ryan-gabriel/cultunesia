"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, LogIn, Moon, Sun, Laptop, Sparkles } from "lucide-react";
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
    { label: "Cultunesia", href: "/cultunesia" },
    { label: "Blog", href: "/blogs" },
    { label: "Quiz", href: "/quizzes" },
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "Provinces", href: "/provinces" },
    { label: "About Us", href: "/about" },
    { label: "Chatbot", href: "/chatbot" },
  ];

  const { session, profile, loading } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <motion.nav
      className="w-full flex items-center justify-between px-8 lg:px-12 py-6 bg-gradient-to-b from-white/95 via-white/90 to-white/85 dark:from-gray-950/95 dark:via-gray-950/90 dark:to-gray-900/85 backdrop-blur-2xl border-b border-gray-200/30 dark:border-gray-700/30 shadow-lg shadow-gray-200/20 dark:shadow-black/40 z-50 relative"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Decorative gradient line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary-blue/40 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
      />

      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-blue/5 via-transparent to-primary-blue/5 opacity-50 pointer-events-none" />

      {/* Logo */}
      <motion.a
        href="/"
        className="flex items-center gap-3 relative z-10 group"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <motion.div className="absolute -inset-2 bg-gradient-to-r from-primary-blue/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
        <img
          src="/Logo Full.svg"
          alt="Cultunesia Logo"
          className="w-44 relative z-10 drop-shadow-md"
        />
      </motion.a>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center gap-10 relative z-10">
        {navLinks.map((link, i) => (
          <motion.a
            key={i}
            href={link.href}
            className="relative text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary-blue dark:hover:text-primary-blue transition-all duration-300 group tracking-wide"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -2 }}
          >
            <span className="relative">
              {link.label}
              <motion.span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-gradient-to-r from-amber-400 to-yellow-600 group-hover:w-full transition-all duration-500 rounded-full shadow-lg shadow-amber-500/50" />
              <motion.span className="absolute -inset-x-3 -inset-y-2 bg-amber-400/5 dark:bg-amber-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </span>
          </motion.a>
        ))}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 relative z-10">
        {/* Dark Mode Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-xl hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-900 transition-all duration-300 shadow-sm hover:shadow-md border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50"
            >
              {theme === "light" && (
                <Sun className="h-5 w-5 transition-all text-amber-500" />
              )}
              {theme === "dark" && (
                <Moon className="h-5 w-5 transition-all text-indigo-400" />
              )}
              {theme === "system" && (
                <Laptop className="h-5 w-5 transition-all text-gray-600 dark:text-gray-400" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-44 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50 shadow-xl"
          >
            <DropdownMenuItem
              onClick={() => setTheme("light")}
              className="cursor-pointer hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-gray-800 dark:hover:to-gray-800"
            >
              <Sun className="mr-3 h-4 w-4 text-amber-500" />
              <span className="font-medium">Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("dark")}
              className="cursor-pointer hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-gray-800 dark:hover:to-gray-800"
            >
              <Moon className="mr-3 h-4 w-4 text-indigo-400" />
              <span className="font-medium">Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("system")}
              className="cursor-pointer hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 dark:hover:from-gray-800 dark:hover:to-gray-800"
            >
              <Laptop className="mr-3 h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="font-medium">System</span>
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
                  className="flex items-center gap-2 text-sm font-semibold hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-900 border border-gray-200/50 dark:border-gray-700/50 rounded-xl px-5 py-2 transition-all duration-300 hover:shadow-md hover:scale-105"
                >
                  <a href="/login">
                    <LogIn className="w-4 h-4" /> Login
                  </a>
                </Button>
                <Button
                  asChild
                  variant="default"
                  className="flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-white rounded-xl px-6 py-2 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 transition-all duration-300 hover:scale-105 border border-amber-400/20"
                >
                  <a href="/register">
                    <Sparkles className="w-4 h-4" /> Register
                  </a>
                </Button>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <UserAvatar />
              </motion.div>
            )}
          </>
        )}

        {/* Mobile Sidebar Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-xl hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-900 transition-all duration-300 shadow-sm hover:shadow-md border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 sm:w-80 bg-gradient-to-b from-white/98 to-gray-50/98 dark:from-gray-950/98 dark:to-gray-900/98 backdrop-blur-2xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-2xl"
            >
              <SheetHeader className="border-b border-gray-200/50 dark:border-gray-700/50 pb-4">
                <SheetTitle>
                  <img
                    src="/Logo Full.svg"
                    alt="Cultunesia Logo"
                    className="w-36 drop-shadow-md"
                  />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col mt-8 gap-2">
                {navLinks.map((link, i) => (
                  <SheetClose asChild key={i}>
                    <motion.a
                      href={link.href}
                      className="text-base font-semibold text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-300 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-amber-400/10 hover:to-yellow-500/10 border border-transparent hover:border-amber-400/20 hover:shadow-md"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      whileHover={{ x: 4 }}
                    >
                      {link.label}
                    </motion.a>
                  </SheetClose>
                ))}

                {/* Mobile Auth Section */}
                {!loading && !session && (
                  <div className="flex flex-col gap-3 mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                    <SheetClose asChild>
                      <a
                        href="/login"
                        className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary-blue px-5 py-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-900 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-md"
                      >
                        <LogIn className="w-4 h-4" /> Login
                      </a>
                    </SheetClose>
                    <SheetClose asChild>
                      <a
                        href="/register"
                        className="flex items-center justify-center gap-2 text-sm font-semibold bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white px-5 py-3 rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 transition-all duration-300 border border-amber-400/20"
                      >
                        <Sparkles className="w-4 h-4" /> Register
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
