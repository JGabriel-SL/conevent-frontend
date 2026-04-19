import { useEvents } from "@/contexts/EventContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Mail, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusColors: Record<string, string> = {
  Planejamento: "bg-warning/10 text-warning border-warning/20",
  Confirmado: "bg-success/10 text-success border-success/20",
  Concluído: "bg-muted text-muted-foreground border-border",
  Cancelado: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function Dashboard() {
  const { events, budgetItems, guests } = useEvents();
  const navigate = useNavigate();

  const activeEvents = events.filter(e => e.status !== "Concluído" && e.status !== "Cancelado").length;
  const negotiatingBudgets = budgetItems.reduce(
    (acc, b) => acc + b.suppliers.filter(s => s.status === "Em negociação" || s.status === "Buscando contato").length, 0
  );
  const sentInvites = guests.length;

  const upcomingEvents = events
    .filter(e => e.status !== "Cancelado" && e.status !== "Concluído")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  const metrics = [
    { label: "Eventos Ativos", value: activeEvents, icon: Calendar, color: "text-primary" },
    { label: "Orçamentos em Negociação", value: negotiatingBudgets, icon: DollarSign, color: "text-warning" },
    { label: "Convites Enviados", value: sentInvites, icon: Mail, color: "text-info" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Visão geral dos seus eventos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} className="glass-card hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`h-12 w-12 rounded-xl bg-accent flex items-center justify-center ${m.color}`}>
                <m.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{m.label}</p>
                <p className="text-3xl font-bold text-foreground">{m.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Próximos Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhum evento próximo.</p>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => navigate(`/events/${event.id}`)}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{event.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(event.date + "T12:00:00"), "dd MMM yyyy", { locale: ptBR })} · {event.time} · {event.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className={statusColors[event.status]}>
                      {event.status}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
