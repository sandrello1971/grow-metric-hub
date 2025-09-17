import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Company {
  id: string;
  name: string;
  description?: string;
  capitale_sociale: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface MonthlyBusinessData {
  id: string;
  company_id: string;
  month: number;
  year: number;
  ricavi: number;
  costi_diretti: number;
  costi_totali: number;
  compenso_imprenditore: number;
  margine: number;
  utile_netto: number;
  created_at: string;
  updated_at: string;
}

export interface BusinessTarget {
  id: string;
  company_id: string;
  target_ricavi?: number;
  target_margine?: number;
  target_utile_netto?: number;
  year: number;
  created_at: string;
  updated_at: string;
}

export function useBusinessData() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyBusinessData[]>([]);
  const [targets, setTargets] = useState<BusinessTarget[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load companies
  const loadCompanies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
      
      if (data && data.length > 0 && !selectedCompany) {
        setSelectedCompany(data[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading companies:', error);
      setLoading(false);
      toast({
        title: "Errore",
        description: "Impossibile caricare le aziende",
        variant: "destructive",
      });
    }
  };

  // Load monthly data for selected company
  const loadMonthlyData = async (companyId: string) => {
    try {
      const { data, error } = await supabase
        .from('monthly_business_data')
        .select('*')
        .eq('company_id', companyId)
        .order('year', { ascending: true })
        .order('month', { ascending: true });

      if (error) throw error;
      setMonthlyData(data || []);
    } catch (error) {
      console.error('Error loading monthly data:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i dati mensili",
        variant: "destructive",
      });
    }
  };

  // Load targets for selected company
  const loadTargets = async (companyId: string) => {
    try {
      const { data, error } = await supabase
        .from('business_targets')
        .select('*')
        .eq('company_id', companyId)
        .order('year', { ascending: false });

      if (error) throw error;
      setTargets(data || []);
    } catch (error) {
      console.error('Error loading targets:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare gli obiettivi",
        variant: "destructive",
      });
    }
  };

  // Update company
  const updateCompany = async (id: string, name: string, description?: string, capitaleSociale: number = 0) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .update({ name, description, capitale_sociale: capitaleSociale })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await loadCompanies();
      setSelectedCompany(data);
      
      toast({
        title: "Successo",
        description: "Azienda aggiornata con successo",
      });
      
      return data;
    } catch (error) {
      console.error('Error updating company:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare l'azienda",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Create company
  const createCompany = async (name: string, description?: string, capitaleSociale: number = 0) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([{ name, description, capitale_sociale: capitaleSociale, user_id: (await supabase.auth.getUser()).data.user!.id }])
        .select()
        .single();

      if (error) throw error;
      
      await loadCompanies();
      setSelectedCompany(data);
      
      toast({
        title: "Successo",
        description: "Azienda creata con successo",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating company:', error);
      toast({
        title: "Errore",
        description: "Impossibile creare l'azienda",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Save monthly data
  const saveMonthlyData = async (data: {
    month: string;
    year: string;
    ricavi: number;
    costiDiretti: number;
    costiTotali: number;
    compensoImprenditore: number;
  }) => {
    if (!selectedCompany) {
      toast({
        title: "Errore",
        description: "Seleziona un'azienda prima di salvare i dati",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('monthly_business_data')
        .upsert([{
          company_id: selectedCompany.id,
          month: parseInt(data.month),
          year: parseInt(data.year),
          ricavi: data.ricavi,
          costi_diretti: data.costiDiretti,
          costi_totali: data.costiTotali,
          compenso_imprenditore: data.compensoImprenditore,
        }]);

      if (error) throw error;
      
      await loadMonthlyData(selectedCompany.id);
      
      toast({
        title: "Successo",
        description: "Dati salvati con successo",
      });
    } catch (error) {
      console.error('Error saving monthly data:', error);
      toast({
        title: "Errore",
        description: "Impossibile salvare i dati",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Save targets
  const saveTargets = async (targets: {
    target_ricavi?: number;
    target_margine?: number;
    target_utile_netto?: number;
    year: number;
  }) => {
    if (!selectedCompany) return;

    try {
      const { error } = await supabase
        .from('business_targets')
        .upsert([{
          company_id: selectedCompany.id,
          ...targets,
        }]);

      if (error) throw error;
      
      await loadTargets(selectedCompany.id);
      
      toast({
        title: "Successo",
        description: "Obiettivi salvati con successo",
      });
    } catch (error) {
      console.error('Error saving targets:', error);
      toast({
        title: "Errore",
        description: "Impossibile salvare gli obiettivi",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Update monthly data
  const updateMonthlyData = async (id: string, updatedData: Partial<MonthlyBusinessData>) => {
    try {
      const { error } = await supabase
        .from('monthly_business_data')
        .update(updatedData)
        .eq('id', id);

      if (error) throw error;
      
      // Ricarica i dati dopo l'aggiornamento
      if (selectedCompany) {
        await loadMonthlyData(selectedCompany.id);
      }
    } catch (error) {
      console.error('Error updating monthly data:', error);
      throw error;
    }
  };

  // Delete monthly data
  const deleteMonthlyData = async (id: string) => {
    try {
      const { error } = await supabase
        .from('monthly_business_data')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Ricarica i dati dopo l'eliminazione
      if (selectedCompany) {
        await loadMonthlyData(selectedCompany.id);
      }
    } catch (error) {
      console.error('Error deleting monthly data:', error);
      throw error;
    }
  };

  // Initial load
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await loadCompanies();
      setLoading(false);
    };

    initializeData();
  }, []);

  // Load data when company changes
  useEffect(() => {
    if (selectedCompany) {
      loadMonthlyData(selectedCompany.id);
      loadTargets(selectedCompany.id);
    }
  }, [selectedCompany]);

  return {
    companies,
    selectedCompany,
    setSelectedCompany,
    monthlyData,
    targets,
    loading,
    createCompany,
    updateCompany,
    saveMonthlyData: (data: any) => saveMonthlyData(data),
    updateMonthlyData,
    deleteMonthlyData,
    saveTargets,
  };
}