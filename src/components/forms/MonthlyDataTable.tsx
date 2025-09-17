import { useState } from 'react';
import { MonthlyBusinessData } from '@/hooks/useBusinessData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MonthlyDataTableProps {
  data: MonthlyBusinessData[];
  onUpdate: (id: string, updatedData: Partial<MonthlyBusinessData>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

interface EditingData {
  ricavi: string;
  costiDiretti: string;
  costiTotali: string;
  compensoImprenditore: string;
}

const monthNames = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function MonthlyDataTable({ data, onUpdate, onDelete }: MonthlyDataTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<EditingData>({
    ricavi: '',
    costiDiretti: '',
    costiTotali: '',
    compensoImprenditore: ''
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleEdit = (row: MonthlyBusinessData) => {
    setEditingId(row.id);
    setEditingData({
      ricavi: row.ricavi.toString(),
      costiDiretti: row.costi_diretti.toString(),
      costiTotali: row.costi_totali.toString(),
      compensoImprenditore: row.compenso_imprenditore.toString()
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingData({
      ricavi: '',
      costiDiretti: '',
      costiTotali: '',
      compensoImprenditore: ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      const ricavi = parseFloat(editingData.ricavi) || 0;
      const costiDiretti = parseFloat(editingData.costiDiretti) || 0;
      const costiTotali = parseFloat(editingData.costiTotali) || 0;
      const compensoImprenditore = parseFloat(editingData.compensoImprenditore) || 0;
      
      const margine = ricavi - costiDiretti;
      const utileNetto = margine - compensoImprenditore;

      await onUpdate(editingId, {
        ricavi,
        costi_diretti: costiDiretti,
        costi_totali: costiTotali,
        compenso_imprenditore: compensoImprenditore,
        margine,
        utile_netto: utileNetto
      });

      setEditingId(null);
      toast({
        title: "Successo",
        description: "Dati aggiornati con successo",
      });
    } catch (error) {
      console.error('Error updating data:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare i dati",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
      setDeleteConfirmId(null);
      toast({
        title: "Successo",
        description: "Dati eliminati con successo",
      });
    } catch (error) {
      console.error('Error deleting data:', error);
      toast({
        title: "Errore",
        description: "Impossibile eliminare i dati",
        variant: "destructive",
      });
    }
  };

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            Nessun dato inserito. Aggiungi i primi dati mensili utilizzando il form sopra.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dati Mensili Inseriti</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Periodo</TableHead>
                <TableHead className="text-right">Ricavi</TableHead>
                <TableHead className="text-right">Costi Diretti</TableHead>
                <TableHead className="text-right">Costi Totali</TableHead>
                <TableHead className="text-right">Compenso</TableHead>
                <TableHead className="text-right">Margine</TableHead>
                <TableHead className="text-right">Utile Netto</TableHead>
                <TableHead className="text-center">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">
                    {monthNames[row.month - 1]} {row.year}
                  </TableCell>
                  
                  {editingId === row.id ? (
                    <>
                      <TableCell>
                        <Input
                          type="number"
                          value={editingData.ricavi}
                          onChange={(e) => setEditingData(prev => ({ ...prev, ricavi: e.target.value }))}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={editingData.costiDiretti}
                          onChange={(e) => setEditingData(prev => ({ ...prev, costiDiretti: e.target.value }))}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={editingData.costiTotali}
                          onChange={(e) => setEditingData(prev => ({ ...prev, costiTotali: e.target.value }))}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={editingData.compensoImprenditore}
                          onChange={(e) => setEditingData(prev => ({ ...prev, compensoImprenditore: e.target.value }))}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        Calcolato
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        Calcolato
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="text-right">{formatCurrency(row.ricavi)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(row.costi_diretti)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(row.costi_totali)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(row.compenso_imprenditore)}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={row.margine >= 0 ? "default" : "destructive"}>
                          {formatCurrency(row.margine)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={row.utile_netto >= 0 ? "default" : "destructive"}>
                          {formatCurrency(row.utile_netto)}
                        </Badge>
                      </TableCell>
                    </>
                  )}
                  
                  <TableCell className="text-center">
                    {editingId === row.id ? (
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={handleSaveEdit}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(row)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Dialog open={deleteConfirmId === row.id} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeleteConfirmId(row.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Conferma Eliminazione</DialogTitle>
                              <DialogDescription>
                                Sei sicuro di voler eliminare i dati di {monthNames[row.month - 1]} {row.year}? 
                                Questa azione non può essere annullata.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-2 mt-4">
                              <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
                                Annulla
                              </Button>
                              <Button variant="destructive" onClick={() => handleDelete(row.id)}>
                                Elimina
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}