"use client";

import { Brain, MapPinned, Newspaper } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items
const items = [
  { title: "Provinsi", url: "/dashboard/provinces", icon: MapPinned },
  { title: "Blogs", url: "/dashboard/blogs", icon: Newspaper },
  { title: "Quiz", url: "/dashboard/quizzes", icon: Brain },
];

export function AppSidebar() {
  const pathname = usePathname(); // ambil URL saat ini

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Cultunesia</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url; // true kalau sedang di halaman ini

                return (
                  <SidebarMenuItem
                    key={item.title}
                    className={
                      isActive ? "bg-primary/5  rounded-md" : ""
                    }
                  >
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="flex items-center gap-2">
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
