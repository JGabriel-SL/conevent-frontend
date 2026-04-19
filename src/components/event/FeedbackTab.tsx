import { useState } from "react";
import { useEvents } from "@/contexts/EventContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Star, Send, MessageSquare, BarChart3 } from "lucide-react";
import { toast } from "sonner";

export interface FeedbackEntry {
  id: string;
  guestName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

function StarRating({ value, onChange, size = 5 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: size }, (_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 transition-colors ${i < value ? "fill-warning text-warning" : "text-border"} ${onChange ? "cursor-pointer hover:text-warning" : ""}`}
          onClick={() => onChange?.(i + 1)}
        />
      ))}
    </div>
  );
}

function AverageStars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.min(1, Math.max(0, value - i));
        return (
          <div key={i} className="relative h-7 w-7">
            <Star className="absolute inset-0 h-7 w-7 text-border" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="h-7 w-7 fill-warning text-warning" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function FeedbackTab({ eventId }: { eventId: string }) {
  const { guests } = useEvents();
  const confirmedGuests = guests.filter(g => g.eventId === eventId && g.status === "Confirmado");

  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([]);
  const [surveyDialog, setSurveyDialog] = useState(false);
  const [surveySent, setSurveySent] = useState(false);

  // Simulate a guest submitting feedback
  const [addDialog, setAddDialog] = useState(false);
  const [fbForm, setFbForm] = useState({ guestName: "", rating: 0, comment: "" });

  const avgRating = feedbacks.length > 0 ? feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length : 0;

  const handleSendSurvey = () => {
    setSurveySent(true);
    toast.success(`Pesquisa de satisfação simulada enviada para ${confirmedGuests.length} convidado(s)!`);
    setSurveyDialog(false);
  };

  const handleAddFeedback = () => {
    if (!fbForm.guestName || fbForm.rating === 0) return;
    setFeedbacks(prev => [...prev, { ...fbForm, id: Math.random().toString(36).slice(2), createdAt: new Date().toISOString() }]);
    setFbForm({ guestName: "", rating: 0, comment: "" });
    setAddDialog(false);
  };

  return (
    <div className="space-y-4">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Send className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pesquisas Enviadas</p>
              <p className="text-xl font-bold text-foreground">{surveySent ? confirmedGuests.length : 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Respostas</p>
              <p className="text-xl font-bold text-foreground">{feedbacks.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Média de Avaliação</p>
              <div className="flex items-center gap-2">
                <p className="text-xl font-bold text-foreground">{avgRating ? avgRating.toFixed(1) : "—"}</p>
                {avgRating > 0 && <AverageStars value={avgRating} />}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-lg font-semibold text-foreground">Feedback Pós-Evento</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setSurveyDialog(true)} disabled={confirmedGuests.length === 0}>
            <Send className="h-4 w-4 mr-1" />Disparar Pesquisa
          </Button>
          <Button size="sm" onClick={() => setAddDialog(true)} disabled={!surveySent}>
            <MessageSquare className="h-4 w-4 mr-1" />Simular Resposta
          </Button>
        </div>
      </div>

      {!surveySent && (
        <Card className="glass-card">
          <CardContent className="p-8 text-center text-muted-foreground">
            Envie a pesquisa de satisfação para começar a coletar feedbacks.
          </CardContent>
        </Card>
      )}

      {surveySent && feedbacks.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-8 text-center text-muted-foreground">
            Pesquisa enviada! Use "Simular Resposta" para adicionar feedbacks de teste.
          </CardContent>
        </Card>
      )}

      {feedbacks.length > 0 && (
        <div className="space-y-3">
          {feedbacks.map((fb) => (
            <Card key={fb.id} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{fb.guestName}</p>
                    {fb.comment && <p className="text-sm text-muted-foreground mt-1">{fb.comment}</p>}
                  </div>
                  <StarRating value={fb.rating} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Survey dialog */}
      <Dialog open={surveyDialog} onOpenChange={setSurveyDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Disparar Pesquisa de Satisfação</DialogTitle></DialogHeader>
          <div className="py-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              A pesquisa será enviada para <strong>{confirmedGuests.length}</strong> convidado(s) confirmado(s):
            </p>
            <div className="rounded-lg bg-secondary p-3 space-y-1 max-h-40 overflow-auto">
              {confirmedGuests.map(g => (
                <p key={g.id} className="text-sm text-foreground">{g.name} — <span className="text-muted-foreground">{g.email}</span></p>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSurveyDialog(false)}>Cancelar</Button>
            <Button onClick={handleSendSurvey}><Send className="h-4 w-4 mr-2" />Enviar Pesquisa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Simulate feedback dialog */}
      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Simular Resposta de Feedback</DialogTitle></DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Convidado</Label>
              <Input value={fbForm.guestName} onChange={e => setFbForm({ ...fbForm, guestName: e.target.value })} placeholder="Nome do convidado" />
            </div>
            <div className="space-y-2">
              <Label>Avaliação</Label>
              <StarRating value={fbForm.rating} onChange={r => setFbForm({ ...fbForm, rating: r })} />
            </div>
            <div className="space-y-2">
              <Label>Comentário (opcional)</Label>
              <Textarea value={fbForm.comment} onChange={e => setFbForm({ ...fbForm, comment: e.target.value })} rows={3} placeholder="O que achou do evento?" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialog(false)}>Cancelar</Button>
            <Button onClick={handleAddFeedback}>Adicionar Feedback</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
