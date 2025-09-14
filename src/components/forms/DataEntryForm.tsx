import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Calculator, Save, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const monthlyDataSchema = z.object({
  month: z.string().min(1, "Seleziona un mese"),
  year: z.string().min(1, "Seleziona un anno"),
  ricavi: z.coerce.number().min(0, "I ricavi devono essere positivi"),
  costiDiretti: z.coerce.number().min(0, "I costi diretti devono essere positivi"),
  costiTotali: z.coerce.number().min(0, "I costi totali devono essere positivi"),
  compensoImprenditore: z.coerce.number().min(0, "Il compenso deve essere positivo"),
});

type MonthlyData = z.infer<typeof monthlyDataSchema>;

interface DataEntryFormProps {
  companyId: string;
  onSubmit: (data: MonthlyData & { margine: number; utileNetto: number }) => void;
}

export function DataEntryForm({ companyId, onSubmit }: DataEntryFormProps) {
  const { toast } = useToast();
  const [calculatedValues, setCalculatedValues] = useState<{
    margine: number;
    utileNetto: number;
  } | null>(null);

  const form = useForm<MonthlyData>({
    resolver: zodResolver(monthlyDataSchema),
    defaultValues: {
      month: "",
      year: new Date().getFullYear().toString(),
      ricavi: 0,
      costiDiretti: 0,
      costiTotali: 0,
      compensoImprenditore: 0,
    },
  });

  const watchedValues = form.watch();

  // Calculate margins in real time
  const calculateMargins = (data: Partial<MonthlyData>) => {
    const ricavi = data.ricavi || 0;
    const costiDiretti = data.costiDiretti || 0;
    const costiTotali = data.costiTotali || 0;

    const margine = ricavi - costiDiretti;
    const utileNetto = ricavi - costiTotali;

    setCalculatedValues({ margine, utileNetto });
    return { margine, utileNetto };
  };

  // Recalculate when values change
  useEffect(() => {
    calculateMargins(watchedValues);
  }, [watchedValues.ricavi, watchedValues.costiDiretti, watchedValues.costiTotali]);

  const handleSubmit = (data: MonthlyData) => {
    const { margine, utileNetto } = calculateMargins(data);
    
    // Validation warnings
    if (margine < 0) {
      toast({
        title: "Attenzione",
        description: "Il margine è negativo. Verifica i dati inseriti.",
        variant: "destructive",
      });
    }

    if (utileNetto < 0) {
      toast({
        title: "Attenzione", 
        description: "L'utile netto è negativo. Verifica i costi totali.",
        variant: "destructive",
      });
    }

    onSubmit({ ...data, margine, utileNetto });
    
    toast({
      title: "Dati salvati",
      description: `Dati per ${data.month} ${data.year} salvati con successo.`,
    });

    form.reset();
    setCalculatedValues(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const months = [
    { value: "1", label: "Gennaio" },
    { value: "2", label: "Febbraio" },
    { value: "3", label: "Marzo" },
    { value: "4", label: "Aprile" },
    { value: "5", label: "Maggio" },
    { value: "6", label: "Giugno" },
    { value: "7", label: "Luglio" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Settembre" },
    { value: "10", label: "Ottobre" },
    { value: "11", label: "Novembre" },
    { value: "12", label: "Dicembre" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-primary" />
            <span>Inserimento Dati Mensili</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Period Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="month"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mese</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona mese" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month.value} value={month.value}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Anno</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona anno" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Financial Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="ricavi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ricavi (€)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="costiDiretti"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Costi Diretti (€)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="costiTotali"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Costi Totali (€)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="compensoImprenditore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Compenso Imprenditore (€)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Calculated Values */}
              {calculatedValues && (
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center space-x-2">
                      <Calculator className="w-4 h-4" />
                      <span>Valori Calcolati</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between items-center">
                        <Label>Margine:</Label>
                        <Badge 
                          variant={calculatedValues.margine >= 0 ? "default" : "destructive"}
                          className="font-mono"
                        >
                          {formatCurrency(calculatedValues.margine)}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label>Utile Netto:</Label>
                        <Badge 
                          variant={calculatedValues.utileNetto >= 0 ? "default" : "destructive"}
                          className="font-mono"
                        >
                          {formatCurrency(calculatedValues.utileNetto)}
                        </Badge>
                      </div>
                    </div>
                    
                    {(calculatedValues.margine < 0 || calculatedValues.utileNetto < 0) && (
                      <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-md">
                        <div className="flex items-center space-x-2 text-warning">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Attenzione: Valori negativi rilevati
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <Button type="submit" className="w-full" size="lg">
                <Save className="w-4 h-4 mr-2" />
                Salva Dati Mensili
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}