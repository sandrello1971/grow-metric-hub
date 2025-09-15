import { useState } from 'react';
import { Plus, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Company } from '@/hooks/useBusinessData';

interface CompanySelectorProps {
  companies: Company[];
  selectedCompany: Company | null;
  onCompanyChange: (company: Company) => void;
  onCreateCompany: (name: string, description?: string) => Promise<any>;
}

export function CompanySelector({ 
  companies, 
  selectedCompany, 
  onCompanyChange, 
  onCreateCompany 
}: CompanySelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyDescription, setNewCompanyDescription] = useState('');

  const handleCreateCompany = async () => {
    if (!newCompanyName.trim()) return;
    
    try {
      await onCreateCompany(newCompanyName.trim(), newCompanyDescription.trim() || undefined);
      setNewCompanyName('');
      setNewCompanyDescription('');
      setIsDialogOpen(false);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <Building2 className="w-5 h-5 text-primary" />
        <Label className="text-sm font-medium">Azienda:</Label>
      </div>
      
      <Select
        value={selectedCompany?.id || ''}
        onValueChange={(value) => {
          const company = companies.find(c => c.id === value);
          if (company) onCompanyChange(company);
        }}
      >
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Seleziona azienda" />
        </SelectTrigger>
        <SelectContent>
          {companies.map((company) => (
            <SelectItem key={company.id} value={company.id}>
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nuova Azienda
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crea Nuova Azienda</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="company-name">Nome Azienda *</Label>
              <Input
                id="company-name"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                placeholder="Es. La Mia Azienda SRL"
              />
            </div>
            <div>
              <Label htmlFor="company-description">Descrizione (opzionale)</Label>
              <Textarea
                id="company-description"
                value={newCompanyDescription}
                onChange={(e) => setNewCompanyDescription(e.target.value)}
                placeholder="Breve descrizione dell'azienda..."
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annulla
              </Button>
              <Button onClick={handleCreateCompany} disabled={!newCompanyName.trim()}>
                Crea Azienda
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}