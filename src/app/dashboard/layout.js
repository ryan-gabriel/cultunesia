import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/context/ThemeProvider";
import ToggleTheme from "@/components/theme/ToggleTheme";

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <main className="p-4 pt-16 relative w-full">
          <SidebarTrigger className={"absolute top-2 left-2"} />
          <ThemeProvider>
            <ToggleTheme className="absolute top-2 right-2" />
          </ThemeProvider>
          {children}
        </main>
        <Toaster />
      </SidebarProvider>
    </AuthProvider>
  );
}
