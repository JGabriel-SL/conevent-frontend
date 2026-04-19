import { useState } from "react";
import { useEvents } from "@/contexts/EventContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Mail, Users } from "lucide-react";
import { toast } from "sonner";
import type { GuestStatus } from "@/types/event";

const guestStatusColors: Record<GuestStatus, string> = {
  Pendente: "bg-warning/10 text-warning",
  Confirmado: "bg-success/10 text-success",
  Recusado: "bg-destructive/10 text-destructive",
};

export function GuestsTab({ eventId, eventName }: { eventId: string; eventName: string }) {
  const { guests, addGuest, updateGuest, deleteGuest } = useEvents();
  const eventGuests = guests.filter(g => g.eventId === eventId);

  const [addDialog, setAddDialog] = useState(false);
  const [inviteDialog, setInviteDialog] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [inviteMessage, setInviteMessage] = useState(
    `Prezado(a) convidado(a),\n\nÉ com grande prazer que convidamos você para o evento "${eventName}".\n\nAguardamos sua confirmação.\n\nAtenciosamente,\nEquipe de Eventos`
  );

  const confirmed = eventGuests.filter(g => g.status === "Confirmado").length;
  const pending = eventGuests.filter(g => g.status === "Pendente").length;

  const handleAdd = () => {
    if (!form.name || !form.email) return;
    addGuest({ eventId, ...form, status: "Pendente" });
    setForm({ name: "", email: "", phone: "" });
    setAddDialog(false);
  };

  const handleSendInvites = () => {
    toast.success(`Convites simulados enviados para ${eventGuests.filter(g => g.status === "Pendente").length} convidado(s)!`);
    setInviteDialog(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-xl font-bold text-foreground">{eventGuests.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Confirmados</p>
              <p className="text-xl font-bold text-foreground">{confirmed}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pendentes</p>
              <p className="text-xl font-bold text-foreground">{pending}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-lg font-semibold text-foreground">Lista de Convidados</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setInviteDialog(true)} disabled={pending === 0}>
            <Mail className="h-4 w-4 mr-1" />Disparar Convites
          </Button>
          <Button size="sm" onClick={() => setAddDialog(true)}>
            <Plus className="h-4 w-4 mr-1" />Adicionar
          </Button>
        </div>
      </div>

      {eventGuests.length === 0 ? (
        <Card className="glass-card"><CardContent className="p-8 text-center text-muted-foreground">Nenhum convidado cadastrado.</CardContent></Card>
      ) : (
        <Card className="glass-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventGuests.map((g) => (
                <TableRow key={g.id}>
                  <TableCell className="font-medium">{g.name}</TableCell>
                  <TableCell className="text-muted-foreground">{g.email}</TableCell>
                  <TableCell className="text-muted-foreground">{g.phone}</TableCell>
                  <TableCell>
                    <Select value={g.status} onValueChange={(v) => updateGuest(g.id, { status: v as GuestStatus })}>
                      <SelectTrigger className="h-8 w-[130px]">
                        <Badge variant="secondary" className={guestStatusColors[g.status]}>{g.status}</Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                        <SelectItem value="Confirmado">Confirmado</SelectItem>
                        <SelectItem value="Recusado">Recusado</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => deleteGuest(g.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Adicionar Convidado</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="(00) 00000-0000" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialog(false)}>Cancelar</Button>
            <Button onClick={handleAdd}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={inviteDialog} onOpenChange={setInviteDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Disparar Convites</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              O convite será enviado para {pending} convidado(s) com status "Pendente".
            </p>
            <div className="space-y-2">
              <Label>Mensagem do Convite</Label>
              <Textarea rows={8} value={inviteMessage} onChange={e => setInviteMessage(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialog(false)}>Cancelar</Button>
            <Button onClick={handleSendInvites}><Mail className="h-4 w-4 mr-2" />Enviar Convites</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
