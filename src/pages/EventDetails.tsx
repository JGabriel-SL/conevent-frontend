import { useParams, useNavigate } from "react-router-dom";
import { useEvents } from "@/contexts/EventContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BudgetTab } from "@/components/event/BudgetTab";
import { GuestsTab } from "@/components/event/GuestsTab";
import { FeedbackTab } from "@/components/event/FeedbackTab";

const statusColors: Record<string, string> = {
  Planejamento: "bg-warning/10 text-warning border-warning/20",
  Confirmado: "bg-success/10 text-success border-success/20",
  Concluído: "bg-muted text-muted-foreground border-border",
  Cancelado: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { events } = useEvents();

  const event = events.find(e => e.id === id);
  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Evento não encontrado.</p>
        <Button variant="outline" onClick={() => navigate("/events")} className="mt-4">Voltar</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/events")} className="shrink-0 mt-1">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-foreground">{event.name}</h1>
            <Badge variant="outline" className={statusColors[event.status]}>{event.status}</Badge>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{format(new Date(event.iniDate + "T12:00:00"), "dd MMM yyyy", { locale: ptBR })} · {event.iniTime}</span>
            {
              event.iniDate !== event.endDate ?<span className="flex items-center gap-1">·<Calendar className="h-4 w-4" />{format(new Date(event.endDate + "T12:00:00"), "dd MMM yyyy", { locale: ptBR })} · {event.endTime}</span>
              : ""
            }
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{event.location}</span>
            <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" />R$ {event.budget.toLocaleString("pt-BR")}</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="budget" className="w-full">
        <TabsList>
          <TabsTrigger value="budget">Orçamentos</TabsTrigger>
          <TabsTrigger value="guests">Convidados</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        <TabsContent value="budget" className="mt-4">
          <BudgetTab eventId={event.id} eventBudget={event.budget} />
        </TabsContent>
        <TabsContent value="guests" className="mt-4">
          <GuestsTab eventId={event.id} eventName={event.name} />
        </TabsContent>
        <TabsContent value="feedback" className="mt-4">
          <FeedbackTab eventId={event.id} />
          <GuestsTab eventId={event.id} eventName={event.name} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
