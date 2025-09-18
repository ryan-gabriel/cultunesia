import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <main className="p-4 pt-9 relative w-full">
          <SidebarTrigger className={'absolute top-1 left-1'} />
            {children}
        </main>
      </SidebarProvider>
    </AuthProvider>
  );
}
