import { ReactNode } from "react";
import { NavigationMenu } from "./NavigationMenu";
import { Sidebar } from "./Sidebar";

interface RootLayoutProps {
  children: ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation for desktop */}
      <div className="hidden md:block">
        <NavigationMenu />
      </div>
      
      <div className="flex">
        {/* Sidebar for mobile */}
        <div className="md:hidden">
          <Sidebar />
        </div>
        
        {/* Main content */}
        <main className="flex-1 container mx-auto py-6 px-4">
          {children}
        </main>
      </div>
    </div>
  );
} 