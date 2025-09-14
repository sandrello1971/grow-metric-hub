import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart3, 
  Building2, 
  Plus, 
  TrendingUp, 
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  companies: Array<{ id: string; name: string; }>;
  activeCompany: string;
  onCompanyChange: (companyId: string) => void;
}

export function Sidebar({ 
  activeView, 
  onViewChange, 
  companies, 
  activeCompany, 
  onCompanyChange 
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "data-entry", label: "Inserisci Dati", icon: Plus },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "export", label: "Export", icon: FileSpreadsheet },
  ];

  return (
    <div className={cn(
      "flex flex-col h-full bg-gradient-card border-r border-border shadow-card transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="font-bold text-lg text-foreground">BusinessBI</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        {/* Company Selector */}
        {!isCollapsed && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Aziende</h3>
            <div className="space-y-1">
              {companies.map((company) => (
                <Button
                  key={company.id}
                  variant={activeCompany === company.id ? "default" : "ghost"}
                  className="w-full justify-start h-auto p-3"
                  onClick={() => onCompanyChange(company.id)}
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  <span className="truncate">{company.name}</span>
                </Button>
              ))}
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-3 border-dashed"
                onClick={() => onViewChange("add-company")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Aggiungi Azienda
              </Button>
            </div>
          </div>
        )}

        <Separator className="my-4" />

        {/* Navigation */}
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeView === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-auto p-3",
                  isCollapsed && "px-2"
                )}
                onClick={() => onViewChange(item.id)}
              >
                <Icon className={cn("w-4 h-4", !isCollapsed && "mr-2")} />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start h-auto p-3",
            isCollapsed && "px-2"
          )}
          onClick={() => onViewChange("settings")}
        >
          <Settings className={cn("w-4 h-4", !isCollapsed && "mr-2")} />
          {!isCollapsed && <span>Impostazioni</span>}
        </Button>
      </div>
    </div>
  );
}