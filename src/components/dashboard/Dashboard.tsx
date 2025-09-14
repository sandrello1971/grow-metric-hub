import { MetricCard } from "./MetricCard";
import { TrendChart } from "./TrendChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Calculator, Target, AlertTriangle } from "lucide-react";

// Mock data - in real app this would come from props or API
const mockData = [
  { month: "Gen", ricavi: 45000, margine: 27000, utileNetto: 15000 },
  { month: "Feb", ricavi: 52000, margine: 31200, utileNetto: 18000 },
  { month: "Mar", ricavi: 48000, margine: 28800, utileNetto: 16000 },
  { month: "Apr", ricavi: 55000, margine: 33000, utileNetto: 20000 },
  { month: "Mag", ricavi: 58000, margine: 34800, utileNetto: 22000 },
  { month: "Giu", ricavi: 62000, margine: 37200, utileNetto: 25000 },
];

interface DashboardProps {
  companyName: string;
}

export function Dashboard({ companyName }: DashboardProps) {
  const currentMonth = mockData[mockData.length - 1];
  const previousMonth = mockData[mockData.length - 2];
  
  // Targets (in real app these would be configurable)
  const targets = {
    ricavi: 50000,
    margine: 30000,
    utileNetto: 18000,
  };

  const alerts = [
    ...(currentMonth.margine < targets.margine ? [{
      type: "warning" as const,
      message: "Margine sotto target del mese"
    }] : []),
    ...(currentMonth.utileNetto < targets.utileNetto ? [{
      type: "warning" as const,
      message: "Utile netto sotto target del mese"
    }] : []),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Panoramica finanziaria per <span className="font-medium">{companyName}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Ultimo aggiornamento</p>
          <p className="font-medium">Giugno 2024</p>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="border-warning/50 bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-warning">
              <AlertTriangle className="w-5 h-5" />
              <span>Avvisi Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-warning"></div>
                  <span className="text-sm">{alert.message}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Ricavi"
          value={currentMonth.ricavi}
          previousValue={previousMonth.ricavi}
          target={targets.ricavi}
          icon={<BarChart3 className="w-4 h-4" />}
        />
        <MetricCard
          title="Margine"
          value={currentMonth.margine}
          previousValue={previousMonth.margine}
          target={targets.margine}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <MetricCard
          title="Utile Netto"
          value={currentMonth.utileNetto}
          previousValue={previousMonth.utileNetto}
          target={targets.utileNetto}
          icon={<Calculator className="w-4 h-4" />}
        />
        <MetricCard
          title="Margine %"
          value={(currentMonth.margine / currentMonth.ricavi) * 100}
          previousValue={(previousMonth.margine / previousMonth.ricavi) * 100}
          format="percentage"
          target={60}
          icon={<Target className="w-4 h-4" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart
          data={mockData}
          title="Trend Ricavi e Margini"
        />
        
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Crescita Ricavi (6 mesi)</span>
              <Badge variant="default" className="bg-success text-success-foreground">
                +37.8%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Efficienza Margini</span>
              <Badge variant="default" className="bg-primary text-primary-foreground">
                60.0%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">ROI Medio</span>
              <Badge variant="default" className="bg-warning text-warning-foreground">
                40.3%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Target Raggiunti</span>
              <Badge variant="outline">
                2/3 obiettivi
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle>Statistiche Rapide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">€{(mockData.reduce((sum, m) => sum + m.ricavi, 0) / 1000).toFixed(0)}K</p>
              <p className="text-sm text-muted-foreground">Ricavi Totali</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">€{(mockData.reduce((sum, m) => sum + m.margine, 0) / 1000).toFixed(0)}K</p>
              <p className="text-sm text-muted-foreground">Margine Totale</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">€{(mockData.reduce((sum, m) => sum + m.utileNetto, 0) / 1000).toFixed(0)}K</p>
              <p className="text-sm text-muted-foreground">Utile Totale</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{mockData.length}</p>
              <p className="text-sm text-muted-foreground">Mesi Registrati</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}