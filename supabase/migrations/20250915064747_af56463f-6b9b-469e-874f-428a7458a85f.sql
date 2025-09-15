-- Create companies/business units table
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create policies for companies
CREATE POLICY "Users can view their companies" 
ON public.companies 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their companies" 
ON public.companies 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their companies" 
ON public.companies 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their companies" 
ON public.companies 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create monthly business data table
CREATE TABLE public.monthly_business_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2000),
  ricavi NUMERIC(15,2) NOT NULL DEFAULT 0,
  costi_diretti NUMERIC(15,2) NOT NULL DEFAULT 0,
  costi_totali NUMERIC(15,2) NOT NULL DEFAULT 0,
  compenso_imprenditore NUMERIC(15,2) NOT NULL DEFAULT 0,
  margine NUMERIC(15,2) GENERATED ALWAYS AS (ricavi - costi_diretti) STORED,
  utile_netto NUMERIC(15,2) GENERATED ALWAYS AS (ricavi - costi_totali) STORED,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, month, year)
);

-- Enable RLS on monthly business data
ALTER TABLE public.monthly_business_data ENABLE ROW LEVEL SECURITY;

-- Create policies for monthly business data
CREATE POLICY "Users can view their company data" 
ON public.monthly_business_data 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.companies 
    WHERE companies.id = monthly_business_data.company_id 
    AND companies.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create data for their companies" 
ON public.monthly_business_data 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.companies 
    WHERE companies.id = monthly_business_data.company_id 
    AND companies.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update data for their companies" 
ON public.monthly_business_data 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.companies 
    WHERE companies.id = monthly_business_data.company_id 
    AND companies.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete data for their companies" 
ON public.monthly_business_data 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.companies 
    WHERE companies.id = monthly_business_data.company_id 
    AND companies.user_id = auth.uid()
  )
);

-- Create business targets table
CREATE TABLE public.business_targets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  target_ricavi NUMERIC(15,2),
  target_margine NUMERIC(15,2),
  target_utile_netto NUMERIC(15,2),
  year INTEGER NOT NULL CHECK (year >= 2000),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, year)
);

-- Enable RLS on business targets
ALTER TABLE public.business_targets ENABLE ROW LEVEL SECURITY;

-- Create policies for business targets
CREATE POLICY "Users can view their company targets" 
ON public.business_targets 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.companies 
    WHERE companies.id = business_targets.company_id 
    AND companies.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create targets for their companies" 
ON public.business_targets 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.companies 
    WHERE companies.id = business_targets.company_id 
    AND companies.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update targets for their companies" 
ON public.business_targets 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.companies 
    WHERE companies.id = business_targets.company_id 
    AND companies.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete targets for their companies" 
ON public.business_targets 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.companies 
    WHERE companies.id = business_targets.company_id 
    AND companies.user_id = auth.uid()
  )
);

-- Add foreign key constraints
ALTER TABLE public.monthly_business_data 
ADD CONSTRAINT fk_company 
FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;

ALTER TABLE public.business_targets 
ADD CONSTRAINT fk_company_targets 
FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_monthly_business_data_updated_at
BEFORE UPDATE ON public.monthly_business_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_business_targets_updated_at
BEFORE UPDATE ON public.business_targets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();