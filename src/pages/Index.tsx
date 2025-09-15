import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { BarChart3, TrendingUp, Calculator, Building2, ArrowRight } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Redirect authenticated users to business platform
  useEffect(() => {
    if (!loading && user) {
      navigate('/business');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-background">
        <p className="text-muted-foreground">Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Building2 className="w-10 h-10 text-primary-foreground" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Business <span className="bg-gradient-primary bg-clip-text text-transparent">Platform</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              La piattaforma completa per gestire ricavi, costi e performance della tua piccola impresa. 
              Monitora i trend, calcola i margini e prendi decisioni informate.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => navigate('/auth')}
              >
                Inizia Ora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => navigate('/auth')}
              >
                Accedi
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tutto quello che serve per la tua business intelligence
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Strumenti professionali per monitorare e ottimizzare le performance della tua azienda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-card shadow-card hover:shadow-card-hover transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle>Dashboard Intuitiva</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Visualizza KPI, trend e metriche chiave con grafici chiari e immediati. 
                  Monitora ricavi, margini e utile netto in tempo reale.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card hover:shadow-card-hover transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <Calculator className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle>Calcoli Automatici</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Inserisci i dati mensili e ottieni automaticamente margini, utile netto e 
                  percentuali. Con validazioni e alert per valori critici.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card hover:shadow-card-hover transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle>Analisi Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Confronta performance mensili, identifica tendenze e 
                  ricevi notifiche quando i valori sono sotto target.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pronto a gestire meglio la tua azienda?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Inizia oggi stesso e porta la tua business intelligence al livello successivo
          </p>
          
          <Button 
            size="lg" 
            className="text-lg px-8 py-6"
            onClick={() => navigate('/auth')}
          >
            Inizia Gratis
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}