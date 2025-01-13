import { ReactNode } from "react";
import { NavigationMenu } from "./NavigationMenu";
import { Sidebar } from "./Sidebar";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

interface RootLayoutProps {
  children: ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Navigation */}
      {isMobile && (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <Sidebar />
          </div>
        </header>
      )}

      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        {!isMobile && <Sidebar />}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Desktop Navigation */}
          {!isMobile && (
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <NavigationMenu />
            </header>
          )}

          {/* Main Content */}
          <main className={cn(
            "flex-1 container mx-auto px-4",
            isMobile ? "py-4" : "py-6"
          )}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 