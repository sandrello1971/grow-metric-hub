import { useState } from "react";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { DataEntryForm } from "@/components/forms/DataEntryForm";
import { Sidebar } from "@/components/layout/Sidebar";
import { CompanySelector } from "@/components/CompanySelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Menu } from "lucide-react";
import { useBusinessData } from "@/hooks/useBusinessData";

export default function BusinessPlatform() {
  const [currentView, setCurrentView] = useState<"dashboard" | "data-entry" | "analytics" | "export">("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const {
    companies,
    selectedCompany,
    setSelectedCompany,
    monthlyData,
    targets,
    loading,
    createCompany,
    saveMonthlyData,
  } = useBusinessData();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-background">
        <Card>
          <CardContent className="py-12 px-8 text-center">
            <p className="text-muted-foreground">Caricamento...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-background">
      <Sidebar 
        currentView={currentView}
        onViewChange={setCurrentView}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="lg:hidden"
              >
                <Menu className="w-4 h-4" />
              </Button>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {currentView === "dashboard" ? "Dashboard" :
                   currentView === "data-entry" ? "Inserimento Dati" :
                   currentView === "analytics" ? "Analytics" : "Export"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {selectedCompany ? `Gestione finanziaria per ${selectedCompany.name}` : "Seleziona un'azienda"}
                </p>
              </div>
            </div>
            
            <CompanySelector
              companies={companies}
              selectedCompany={selectedCompany}
              onCompanyChange={setSelectedCompany}
              onCreateCompany={createCompany}
            />
          </div>
        </header>

        <main className="p-6">
          {!selectedCompany ? (
            <Card>
              <CardContent className="py-12 px-8 text-center">
                <p className="text-muted-foreground">
                  Crea o seleziona un'azienda per iniziare
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {currentView === "dashboard" && (
                <Dashboard 
                  companyName={selectedCompany.name}
                  monthlyData={monthlyData}
                  targets={targets}
                />
              )}
              
              {currentView === "data-entry" && (
                <DataEntryForm 
                  companyId={selectedCompany.id}
                  onSubmit={saveMonthlyData}
                />
              )}
              
              {currentView === "analytics" && (
                <div className="text-center py-12">
                  <h3 className="text-2xl font-bold text-foreground mb-4">Analytics Avanzate</h3>
                  <p className="text-muted-foreground">Sezione in sviluppo - Analytics dettagliate e reportistica</p>
                </div>
              )}
              
              {currentView === "export" && (
                <div className="text-center py-12">
                  <h3 className="text-2xl font-bold text-foreground mb-4">Export Dati</h3>
                  <p className="text-muted-foreground">Sezione in sviluppo - Export Excel/CSV</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}