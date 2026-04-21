import { useState } from "react";
import { useEvents } from "@/contexts/EventContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, DollarSign, AlertTriangle, CheckCircle, BadgeCheck } from "lucide-react";
import type { NegotiationStatus } from "@/types/event";

const negotiationColors: Record<NegotiationStatus, string> = {
  "Buscando contato": "bg-muted text-muted-foreground",
  "Em negociação": "bg-warning/10 text-warning",
  "Contrato Fechado": "bg-success/10 text-success",
  "Descartado": "bg-destructive/10 text-destructive",
};


export function BudgetTab({ eventId, eventBudget }: { eventId: string; eventBudget: number }) {
  const { budgetItems, addBudgetItem, deleteBudgetItem, addSupplier, updateSupplier, deleteSupplier, setAWinnerSupplier} = useEvents();
  const items = budgetItems.filter(b => b.eventId === eventId);

  const [itemDialog, setItemDialog] = useState(false);
  const [itemName, setItemName] = useState("");
  const [supplierDialog, setSupplierDialog] = useState<string | null>(null);
  const [supplierForm, setSupplierForm] = useState({ company: "", price: "", contact: "", status: "Buscando contato" as NegotiationStatus, winner: false });

  const totalContracted = items.reduce((acc, item) =>
    acc + item.suppliers.filter(s => s.status === "Contrato Fechado").reduce((sum, s) => sum + s.price, 0), 0
  );

  const overBudget = totalContracted > eventBudget;

  const handleAddItem = () => {
    if (!itemName) return;
    addBudgetItem({ eventId, name: itemName, suppliers: [], hasAWinner: false });
    setItemName("");
    setItemDialog(false);
  };

  const handleAddSupplier = () => {
    if (!supplierDialog || !supplierForm.company) return;
    addSupplier(supplierDialog, { ...supplierForm, price: Number(supplierForm.price) || 0 });
    setSupplierForm({ company: "", price: "", contact: "", status: "Buscando contato", winner: false });
    setSupplierDialog(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Contratado</p>
              <p className="text-xl font-bold text-foreground">R$ {totalContracted.toLocaleString("pt-BR")}</p>
            </div>
          </CardContent>
        </Card>
        <Card className={`glass-card ${overBudget ? "border-destructive/50" : ""}`}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${overBudget ? "bg-destructive/10" : "bg-primary/10"}`}>
              {overBudget ? <AlertTriangle className="h-5 w-5 text-destructive" /> : <DollarSign className="h-5 w-5 text-primary" />}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Orçamento Previsto</p>
              <p className="text-xl font-bold text-foreground">R$ {eventBudget.toLocaleString("pt-BR")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Necessidades do Evento</h3>
        <Button size="sm" onClick={() => setItemDialog(true)}><Plus className="h-4 w-4 mr-1" />Adicionar Item</Button>
      </div>

      {items.length === 0 ? (
        <Card className="glass-card"><CardContent className="p-8 text-center text-muted-foreground">Nenhuma necessidade cadastrada.</CardContent></Card>
      ) : (
        items.map((item) => (
          <Card key={item.id} className="glass-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{item.name}</CardTitle>
                <div className="flex items-center gap-2">
                    {item.hasAWinner ?
                      "" 
                      : <Button size="sm" variant="outline" onClick={() => setSupplierDialog(item.id)}><Plus className="h-3 w-3 mr-1" />Fornecedor </Button>
                    }
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => deleteBudgetItem(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {item.suppliers.length > 0 && (
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-10"></TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {item.suppliers.map((s) => (
                      <TableRow key={s.id} className={s.winner ? "bg-[#a7ddaa33]" : ""}>
                        <TableCell className="font-medium">
                          { s.winner ?  
                            <div className="flex items-center">
                              <BadgeCheck className="m-1" color="green" /> {s.company}
                            </div>
                           : s.company }
                        </TableCell>
                        <TableCell>R$ {s.price.toLocaleString("pt-BR")}</TableCell>
                        <TableCell className="text-muted-foreground">{s.contact}</TableCell>
                        <TableCell>
                          {item.hasAWinner ? 
                            <span className={negotiationColors[s.status] + " p-2 rounded-md"}>
                              {s.status}
                            </span>
                             :
                            <>
                              <Select value={s.status} onValueChange={(v) => updateSupplier(item.id, s.id, { status: v as NegotiationStatus })}>
                              <SelectTrigger className="h-8 w-[160px]">
                                <Badge variant="secondary" className={negotiationColors[s.status]}>{s.status}</Badge>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Buscando contato">Buscando contato</SelectItem>
                                <SelectItem value="Em negociação">Em negociação</SelectItem>
                                <SelectItem value="Contrato Fechado">Contrato Fechado</SelectItem>
                                <SelectItem value="Descartado">Descartado</SelectItem>
                              </SelectContent>
                            </Select>
                            </>
                          }
                        </TableCell>
                         <TableCell>
                          {
                            item.hasAWinner ?
                             ""
                            :
                            <Button variant="ghost" className="h-7 text-destructive" onClick={() => setAWinnerSupplier(item.id, s.id, { winner: true, status: "Contrato Fechado" })}>
                              Selecionar vencedor
                            </Button>
                          }
                         
                        </TableCell>
                        <TableCell>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => deleteSupplier(item.id, s.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            )}
          </Card>
        ))
      )}

      <Dialog open={itemDialog} onOpenChange={setItemDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nova Necessidade</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={itemName} onChange={e => setItemName(e.target.value)} placeholder="Ex: Buffet, Som, Iluminação" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setItemDialog(false)}>Cancelar</Button>
            <Button onClick={handleAddItem}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!supplierDialog} onOpenChange={() => setSupplierDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Novo Fornecedor</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome da Empresa</Label>
              <Input value={supplierForm.company} onChange={e => setSupplierForm({ ...supplierForm, company: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Valor (R$)</Label>
              <Input type="number" value={supplierForm.price} onChange={e => setSupplierForm({ ...supplierForm, price: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Contato</Label>
              <Input value={supplierForm.contact} onChange={e => setSupplierForm({ ...supplierForm, contact: e.target.value })} placeholder="(00) 00000-0000" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={supplierForm.status} onValueChange={v => setSupplierForm({ ...supplierForm, status: v as NegotiationStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Buscando contato">Buscando contato</SelectItem>
                  <SelectItem value="Em negociação">Em negociação</SelectItem>
                  <SelectItem value="Contrato Fechado">Contrato Fechado</SelectItem>
                  <SelectItem value="Descartado">Descartado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSupplierDialog(null)}>Cancelar</Button>
            <Button onClick={handleAddSupplier}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
