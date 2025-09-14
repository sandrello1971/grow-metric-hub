import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { DataEntryForm } from "@/components/forms/DataEntryForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Building2, Download, FileSpreadsheet, Plus } from "lucide-react";

// Mock companies data
const initialCompanies = [
  { id: "1", name: "Azienda Demo SRL" },
  { id: "2", name: "StartUp Innovativa" },
];

export default function BusinessPlatform() {
  const [companies, setCompanies] = useState(initialCompanies);
  const [activeCompany, setActiveCompany] = useState("1");
  const [activeView, setActiveView] = useState("dashboard");
  const [newCompanyName, setNewCompanyName] = useState("");
  const { toast } = useToast();

  const handleAddCompany = () => {
    if (newCompanyName.trim()) {
      const newCompany = {
        id: Date.now().toString(),
        name: newCompanyName.trim(),
      };
      setCompanies([...companies, newCompany]);
      setActiveCompany(newCompany.id);
      setNewCompanyName("");
      setActiveView("dashboard");
      toast({
        title: "Azienda aggiunta",
        description: `${newCompany.name} è stata aggiunta con successo.`,
      });
    }
  };

  const handleDataSubmit = (data: any) => {
    console.log("Data submitted:", data);
    // In real app, this would save to database
    toast({
      title: "Dati salvati",
      description: "I dati mensili sono stati salvati correttamente.",
    });
  };

  const handleExport = (format: "excel" | "csv") => {
    // Mock export functionality
    toast({
      title: "Export avviato",
      description: `Download del file ${format.toUpperCase()} in corso...`,
    });
  };

  const currentCompany = companies.find(c => c.id === activeCompany);

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard companyName={currentCompany?.name || ""} />;
      
      case "data-entry":
        return <DataEntryForm companyId={activeCompany} onSubmit={handleDataSubmit} />;
      
      case "analytics":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Analytics Avanzate</h1>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  Funzionalità analytics avanzate saranno implementate qui.
                  Include analisi predittive, benchmarking e report personalizzati.
                </p>
              </CardContent>
            </Card>
          </div>
        );
      
      case "export":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Export Dati</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileSpreadsheet className="w-5 h-5" />
                    <span>Export Excel</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Esporta tutti i dati in formato Excel con grafici inclusi.
                  </p>
                  <Button onClick={() => handleExport("excel")} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Scarica Excel
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileSpreadsheet className="w-5 h-5" />
                    <span>Export CSV</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Esporta i dati grezzi in formato CSV per elaborazioni personalizzate.
                  </p>
                  <Button onClick={() => handleExport("csv")} variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Scarica CSV
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      case "add-company":
        return (
          <div className="max-w-md mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-center">Aggiungi Nuova Azienda</h1>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5" />
                  <span>Nuova Azienda</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="company-name">Nome Azienda</Label>
                  <Input
                    id="company-name"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    placeholder="Inserisci il nome dell'azienda"
                  />
                </div>
                <Button onClick={handleAddCompany} className="w-full" disabled={!newCompanyName.trim()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Aggiungi Azienda
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      
      case "settings":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Impostazioni</h1>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  Configurazioni target, notifiche e personalizzazioni saranno disponibili qui.
                </p>
              </CardContent>
            </Card>
          </div>
        );
      
      default:
        return <Dashboard companyName={currentCompany?.name || ""} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        companies={companies}
        activeCompany={activeCompany}
        onCompanyChange={setActiveCompany}
      />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}