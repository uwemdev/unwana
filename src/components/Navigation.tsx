import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  BarChart3, 
  FileText, 
  Settings, 
  Info,
  Scale,
  FileWarning,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import WalletConnection from "@/components/WalletConnection";
import { useICPWallet } from "@/hooks/useICPWallet";
import logoImage from "/lovable-uploads/372289b9-f24a-4330-b95c-b5cfb3c7c5af.png";

const menuItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Community", url: "/community", icon: Users },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Results", url: "/results", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
];

const legalItems = [
  { title: "About Us", url: "/about", icon: Info },
  { title: "Terms of Use", url: "/terms", icon: FileWarning },
  { title: "Copyright", url: "/copyright", icon: Scale },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isConnected } = useICPWallet();

  const isActive = (path: string) => location.pathname === path;

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {menuItems.map((item) => (
        <NavLink
          key={item.title}
          to={item.url}
          onClick={() => mobile && setIsOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`
          }
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </NavLink>
      ))}
      {legalItems.map((item) => (
        <NavLink
          key={item.title}
          to={item.url}
          onClick={() => mobile && setIsOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`
          }
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </NavLink>
      ))}
    </>
  );

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src={logoImage} 
              alt="Unwana Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavItems />
            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-border">
              {isConnected && user?.display_name && (
                <span className="text-sm text-muted-foreground">
                  Hi, {user.display_name}
                </span>
              )}
              <WalletConnection />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="flex flex-col space-y-4 pt-6">
                  <div className="flex items-center justify-between">
                    <img 
                      src={logoImage} 
                      alt="Unwana Logo" 
                      className="w-8 h-8"
                    />
                    <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {isConnected && user?.display_name && (
                    <div className="text-sm text-muted-foreground mb-4">
                      Hi, {user.display_name}
                    </div>
                  )}
                  <div className="flex flex-col space-y-2 mb-4">
                    <NavItems mobile />
                  </div>
                  <div className="mt-auto">
                    <WalletConnection />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}