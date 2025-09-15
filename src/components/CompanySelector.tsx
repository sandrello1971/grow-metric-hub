import { useState } from 'react';
import { Plus, Building2, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Company } from '@/hooks/useBusinessData';

interface CompanySelectorProps {
  companies: Company[];
  selectedCompany: Company | null;
  onCompanyChange: (company: Company) => void;
  onCreateCompany: (name: string, description?: string, capitaleSociale?: number) => Promise<any>;
  onUpdateCompany?: (id: string, name: string, description?: string, capitaleSociale?: number) => Promise<any>;
}

export function CompanySelector({ 
  companies, 
  selectedCompany, 
  onCompanyChange, 
  onCreateCompany,
  onUpdateCompany
}: CompanySelectorProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyDescription, setNewCompanyDescription] = useState('');
  const [newCapitaleSociale, setNewCapitaleSociale] = useState<number>(0);
  const [editCompanyName, setEditCompanyName] = useState('');
  const [editCompanyDescription, setEditCompanyDescription] = useState('');
  const [editCapitaleSociale, setEditCapitaleSociale] = useState<number>(0);

  const handleCreateCompany = async () => {
    if (!newCompanyName.trim()) return;
    
    try {
      await onCreateCompany(newCompanyName.trim(), newCompanyDescription.trim() || undefined, newCapitaleSociale);
      setNewCompanyName('');
      setNewCompanyDescription('');
      setNewCapitaleSociale(0);
      setIsCreateDialogOpen(false);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleEditCompany = async () => {
    if (!selectedCompany || !editCompanyName.trim() || !onUpdateCompany) return;
    
    try {
      await onUpdateCompany(selectedCompany.id, editCompanyName.trim(), editCompanyDescription.trim() || undefined, editCapitaleSociale);
      setIsEditDialogOpen(false);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const openEditDialog = () => {
    if (selectedCompany) {
      setEditCompanyName(selectedCompany.name);
      setEditCompanyDescription(selectedCompany.description || '');
      setEditCapitaleSociale(selectedCompany.capitale_sociale || 0);
      setIsEditDialogOpen(true);
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
              <div className="flex flex-col">
                <span>{company.name}</span>
                {company.capitale_sociale > 0 && (
                  <span className="text-xs text-muted-foreground">
                    Capitale: €{company.capitale_sociale.toLocaleString()}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center space-x-2">
        {selectedCompany && onUpdateCompany && (
          <Button variant="outline" size="sm" onClick={openEditDialog}>
            <Edit className="w-4 h-4 mr-2" />
            Modifica
          </Button>
        )}

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
              <div>
                <Label htmlFor="capitale-sociale">Capitale Sociale (€)</Label>
                <Input
                  id="capitale-sociale"
                  type="number"
                  value={newCapitaleSociale}
                  onChange={(e) => setNewCapitaleSociale(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifica Azienda</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-company-name">Nome Azienda *</Label>
              <Input
                id="edit-company-name"
                value={editCompanyName}
                onChange={(e) => setEditCompanyName(e.target.value)}
                placeholder="Es. La Mia Azienda SRL"
              />
            </div>
            <div>
              <Label htmlFor="edit-company-description">Descrizione (opzionale)</Label>
              <Textarea
                id="edit-company-description"
                value={editCompanyDescription}
                onChange={(e) => setEditCompanyDescription(e.target.value)}
                placeholder="Breve descrizione dell'azienda..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-capitale-sociale">Capitale Sociale (€)</Label>
              <Input
                id="edit-capitale-sociale"
                type="number"
                value={editCapitaleSociale}
                onChange={(e) => setEditCapitaleSociale(parseFloat(e.target.value) || 0)}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Annulla
              </Button>
              <Button onClick={handleEditCompany} disabled={!editCompanyName.trim()}>
                Salva Modifiche
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}