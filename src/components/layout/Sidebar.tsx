import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LayoutDashboard, PiggyBank, Bell, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarState } from "@/hooks/useSidebarState";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { UserMenu } from "./UserMenu";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Budget",
    href: "/create-budget",
    icon: PiggyBank,
  },
  {
    title: "Reminders",
    href: "/bill-reminders",
    icon: Bell,
  },
  {
    title: "Import",
    href: "/revolut-import",
    icon: Upload,
  },
];

interface SidebarContentProps {
  onNavigate?: () => void;
  showLabels?: boolean;
}

function SidebarContent({ onNavigate, showLabels = true }: SidebarContentProps) {
  const location = useLocation();
  
  return (
    <div className="flex flex-col flex-1">
      <nav className="flex-1 p-2">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onNavigate}
              title={!showLabels ? item.title : undefined}
            >
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start space-x-2 mb-1",
                  isActive && "bg-primary text-primary-foreground",
                  !showLabels && "justify-center px-2"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {showLabels && <span>{item.title}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>
      {showLabels && (
        <div className="p-2 mt-auto border-t">
          <UserMenu />
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const { isOpen, isExpanded, setOpen, toggleExpanded } = useSidebarState();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Mobile drawer
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <div className="font-semibold">MyBudget</div>
            </div>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop sidebar
  return (
    <div 
      className={cn(
        "hidden md:flex flex-col border-r bg-background transition-all duration-300",
        isExpanded ? "w-64" : "w-16"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {isExpanded && <div className="font-semibold">MyBudget</div>}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleExpanded}
          className={cn("ml-auto", !isExpanded && "mx-auto")}
        >
          {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
      <SidebarContent showLabels={isExpanded} />
    </div>
  );
} 