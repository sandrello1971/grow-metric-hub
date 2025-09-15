import { MetricCard } from "./MetricCard";
import { TrendChart } from "./TrendChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Calculator, Target, AlertTriangle } from "lucide-react";
import { MonthlyBusinessData, BusinessTarget } from "@/hooks/useBusinessData";

interface DashboardProps {
  companyName: string;
  monthlyData: MonthlyBusinessData[];
  targets: BusinessTarget[];
}

const monthNames = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

export function Dashboard({ companyName, monthlyData = [], targets = [] }: DashboardProps) {
  // Transform data for charts - add safety check
  const chartData = (monthlyData || []).map(data => ({
    month: monthNames[data.month - 1],
    ricavi: data.ricavi,
    margine: data.margine,
    utileNetto: data.utile_netto,
  }));

  const currentMonth = chartData[chartData.length - 1];
  const previousMonth = chartData[chartData.length - 2];
  
  // Get current year targets - add safety check
  const currentYear = new Date().getFullYear();
  const currentTargets = (targets || []).find(t => t.year === currentYear) || {
    target_ricavi: 50000,
    target_margine: 30000,
    target_utile_netto: 18000,
  };

  // Show alerts only if we have data
  const alerts = currentMonth ? [
    ...(currentMonth.margine < (currentTargets.target_margine || 0) ? [{
      type: "warning" as const,
      message: "Margine sotto target del mese"
    }] : []),
    ...(currentMonth.utileNetto < (currentTargets.target_utile_netto || 0) ? [{
      type: "warning" as const,
      message: "Utile netto sotto target del mese"
    }] : []),
  ] : [];

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
          <p className="font-medium">
            {currentMonth ? `${currentMonth.month} ${currentYear}` : "Nessun dato"}
          </p>
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
      {currentMonth ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Ricavi"
            value={currentMonth.ricavi}
            previousValue={previousMonth?.ricavi}
            target={currentTargets.target_ricavi}
            icon={<BarChart3 className="w-4 h-4" />}
          />
          <MetricCard
            title="Margine"
            value={currentMonth.margine}
            previousValue={previousMonth?.margine}
            target={currentTargets.target_margine}
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <MetricCard
            title="Utile Netto"
            value={currentMonth.utileNetto}
            previousValue={previousMonth?.utileNetto}
            target={currentTargets.target_utile_netto}
            icon={<Calculator className="w-4 h-4" />}
          />
          <MetricCard
            title="Margine %"
            value={(currentMonth.margine / currentMonth.ricavi) * 100}
            previousValue={previousMonth ? (previousMonth.margine / previousMonth.ricavi) * 100 : undefined}
            format="percentage"
            target={60}
            icon={<Target className="w-4 h-4" />}
          />
        </div>
      ) : (
        <Card className="bg-muted/50">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Nessun dato disponibile. Inizia inserendo i primi dati mensili.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      {chartData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrendChart
            data={chartData}
            title="Trend Ricavi e Margini"
          />
          
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {chartData.length >= 2 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Crescita Ricavi</span>
                  <Badge variant="default" className="bg-success text-success-foreground">
                    {((currentMonth.ricavi - chartData[0].ricavi) / chartData[0].ricavi * 100).toFixed(1)}%
                  </Badge>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Efficienza Margini</span>
                <Badge variant="default" className="bg-primary text-primary-foreground">
                  {((currentMonth.margine / currentMonth.ricavi) * 100).toFixed(1)}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Utile su Ricavi</span>
                <Badge variant="default" className="bg-warning text-warning-foreground">
                  {((currentMonth.utileNetto / currentMonth.ricavi) * 100).toFixed(1)}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Mesi Registrati</span>
                <Badge variant="outline">
                  {chartData.length} mesi
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Quick Stats */}
      {chartData.length > 0 && (
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle>Statistiche Rapide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">€{(chartData.reduce((sum, m) => sum + m.ricavi, 0) / 1000).toFixed(0)}K</p>
                <p className="text-sm text-muted-foreground">Ricavi Totali</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success">€{(chartData.reduce((sum, m) => sum + m.margine, 0) / 1000).toFixed(0)}K</p>
                <p className="text-sm text-muted-foreground">Margine Totale</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-warning">€{(chartData.reduce((sum, m) => sum + m.utileNetto, 0) / 1000).toFixed(0)}K</p>
                <p className="text-sm text-muted-foreground">Utile Totale</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{chartData.length}</p>
                <p className="text-sm text-muted-foreground">Mesi Registrati</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}