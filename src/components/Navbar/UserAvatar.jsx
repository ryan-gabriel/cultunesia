"use client";

import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, User } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function UserAvatar() {
  const { profile, session, loading } = useAuth();

  if (loading) return null;

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    session && (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
            <Avatar className="h-8 w-8">
              {profile?.avatar_url && (
                <AvatarImage
                  src={profile.avatar_url}
                  alt={profile?.full_name || session?.user?.email}
                />
              )}
              <AvatarFallback className="flex items-center justify-center">
                {profile?.full_name?.charAt(0) ??
                session?.user?.email?.charAt(0) ? (
                  profile?.full_name?.charAt(0) ??
                  session?.user?.email?.charAt(0)
                ) : (
                  <User className="h-4 w-4 text-muted-foreground" />
                )}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="font-medium">{profile?.username}</span>
              <span className="text-xs text-muted-foreground">
                {session?.user?.email}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href={"/settings"}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
}
