import { Home, Users, Search, Shield, TrendingUp, Settings, Menu } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import logoImage from "/lovable-uploads/372289b9-f24a-4330-b95c-b5cfb3c7c5af.png";

const menuItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Community", url: "/community", icon: Users },
  { title: "Scanner", url: "/", icon: Search },
  { title: "Security Reports", url: "/reports", icon: Shield },
  { title: "Analytics", url: "/analytics", icon: TrendingUp },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = (path: string) =>
    isActive(path) 
      ? "bg-primary/10 text-primary border-primary/20" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar className={state === "collapsed" ? "w-14" : "w-60"} collapsible="offcanvas">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <img 
            src={logoImage} 
            alt="Unwana Logo" 
            className="w-8 h-8 flex-shrink-0"
          />
          {state === "expanded" && (
            <div>
              <h2 className="font-bold text-lg text-primary">Unwana</h2>
              <p className="text-xs text-muted-foreground">Security Scanner</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${getNavCls(item.url)}`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {state === "expanded" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}