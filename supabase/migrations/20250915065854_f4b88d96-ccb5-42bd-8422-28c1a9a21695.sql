-- Add capitale_sociale field to companies table
ALTER TABLE public.companies 
ADD COLUMN capitale_sociale NUMERIC(15,2) DEFAULT 0;