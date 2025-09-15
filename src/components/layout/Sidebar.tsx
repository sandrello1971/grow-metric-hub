import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Plus, 
  TrendingUp, 
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Menu
} from "lucide-react";

interface SidebarProps {
  currentView: "dashboard" | "data-entry" | "analytics" | "export";
  onViewChange: (view: "dashboard" | "data-entry" | "analytics" | "export") => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ 
  currentView, 
  onViewChange, 
  collapsed,
  onToggleCollapse
}: SidebarProps) {
  const navigationItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: BarChart3 },
    { id: "data-entry" as const, label: "Inserisci Dati", icon: Plus },
    { id: "analytics" as const, label: "Analytics", icon: TrendingUp },
    { id: "export" as const, label: "Export", icon: FileSpreadsheet },
  ];

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-gradient-card border-r border-border shadow-card transition-all duration-300 z-40",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Business Platform</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-2"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="p-2">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  collapsed && "justify-center",
                  isActive && "bg-primary text-primary-foreground"
                )}
                onClick={() => onViewChange(item.id)}
              >
                <Icon className={cn(
                  "w-4 h-4",
                  !collapsed && "mr-2"
                )} />
                {!collapsed && (
                  <span className="text-sm">{item.label}</span>
                )}
              </Button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}