import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, PiggyBank, Bell, Upload } from "lucide-react";
import { UserMenu } from "./UserMenu";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Create Budget",
    href: "/create-budget",
    icon: PiggyBank,
  },
  {
    title: "Bill Reminders",
    href: "/bill-reminders",
    icon: Bell,
  },
  {
    title: "Revolut Import",
    href: "/revolut-import",
    icon: Upload,
  },
];

export function NavigationMenu() {
  const location = useLocation();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center space-x-4">
          <Link to="/" className="mr-4 font-semibold hover:text-primary">
            MyBudget
          </Link>
          
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "flex items-center space-x-2",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Button>
              </Link>
            );
          })}
          
          <div className="ml-auto">
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
} 