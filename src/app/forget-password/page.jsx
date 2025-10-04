"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { ArrowLeft, Laptop, Mail, Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTheme } from "@/context/ThemeProvider";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleForget = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Link reset password sudah dikirim ke email Anda.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-amber-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
      <motion.div
        className="bg-white/80 dark:bg-gray-900/80 p-10 rounded-2xl border shadow-xl w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between w-full">
          <Link href="/login" passHref>
            <Button
              variant="outline"
              className="mb-8 rounded-full border-2 border-gray-200 dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-all font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Login
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
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
        </div>
        <h1 className="text-xl font-bold mb-6 text-center">Lupa Password</h1>
        {message && (
          <p className="mb-4 text-center text-sm text-amber-600 dark:text-amber-400">
            {message}
          </p>
        )}
        <form onSubmit={handleForget} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-lg border focus:ring-2 focus:ring-amber-500 dark:bg-gray-800"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 disabled:opacity-50"
          >
            {loading ? "Mengirim..." : "Kirim Link Reset"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
