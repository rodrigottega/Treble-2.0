import * as React from "react";
import { SubAgent, KnowledgeBase, AiAsset } from "@/types/aiCenter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SubAgentsPageProps {
  subAgents: SubAgent[];
  onOpenConfig: (agent: SubAgent) => void;
  onActivate: (agentId: string) => void;
  onPause: (agentId: string) => void;
}

export function SubAgentsPage({
  subAgents,
  onOpenConfig,
  onActivate,
  onPause
}: SubAgentsPageProps) {
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | "active" | "available" | "paused">("all");

  const filtered = subAgents.filter(a => {
    if (filter !== "all" && a.status !== filter) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.category.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="h-full flex flex-col w-full relative bg-background">
      <div className="flex flex-col py-8 px-8 border-b sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Sub-agentes</h1>
        <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
          Suma agentes especializados al equipo del orquestador para manejar diferentes tipos de conversaciones.
        </p>

        <div className="flex items-center gap-4 mt-6">
          <div className="relative w-72">
            <i className="ri-search-line absolute left-3 top-2.5 text-muted-foreground"></i>
            <Input 
              placeholder="Buscar agente..." 
              className="pl-9"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant={filter === "all" ? "default" : "outline"} 
              className="cursor-pointer" onClick={() => setFilter("all")}
            >Todos</Badge>
            <Badge 
              variant={filter === "active" ? "default" : "outline"} 
              className="cursor-pointer" onClick={() => setFilter("active")}
            >Activos</Badge>
            <Badge 
              variant={filter === "available" ? "default" : "outline"} 
              className="cursor-pointer" onClick={() => setFilter("available")}
            >Disponibles</Badge>
            <Badge 
              variant={filter === "paused" ? "default" : "outline"} 
              className="cursor-pointer" onClick={() => setFilter("paused")}
            >Pausados</Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(agent => (
            <div key={agent.id} className="border rounded-xl p-5 bg-card hover:shadow-md transition-shadow flex flex-col h-full relative group">
              {agent.status === 'active' && (
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-xl">
                  <div className="bg-green-500/10 text-green-700 text-[10px] font-bold uppercase tracking-wider text-center py-1 absolute top-[20px] -right-[20px] w-[80px] rotate-45 shadow-sm border border-green-500/20">
                    Activo
                  </div>
                </div>
              )}
              {agent.status === 'paused' && (
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-xl">
                  <div className="bg-amber-500/10 text-amber-700 text-[10px] font-bold uppercase tracking-wider text-center py-1 absolute top-[20px] -right-[20px] w-[80px] rotate-45 border border-amber-500/20">
                    Pausado
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-3">
                 <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${agent.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                   <i className="ri-robot-2-line text-xl"></i>
                 </div>
                 <div>
                   <h3 className="font-semibold text-base leading-tight pr-8">{agent.name}</h3>
                   <span className="text-[11px] text-muted-foreground uppercase tracking-wider block mt-0.5">{agent.category}</span>
                 </div>
              </div>

              <div className="text-sm text-muted-foreground mb-4 flex-1">
                {agent.description}
              </div>

              <div className="space-y-2 mb-5">
                <div className="text-xs font-medium">Habilidades:</div>
                <div className="flex flex-wrap gap-1">
                   {agent.skills.slice(0, 3).map((skill, i) => (
                     <span key={i} className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground truncate max-w-full">
                       {skill}
                     </span>
                   ))}
                   {agent.skills.length > 3 && (
                     <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">+{agent.skills.length - 3} más</span>
                   )}
                </div>
              </div>

              <div className="mt-auto border-t pt-4 flex gap-2 w-full">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => onOpenConfig(agent)}
                >
                  {agent.status === 'available' ? 'Ver detalles' : 'Configurar'}
                </Button>
                
                {agent.status === 'available' && (
                  <Button className="flex-1" onClick={() => onActivate(agent.id)}>Activar</Button>
                )}
                {agent.status === 'active' && (
                  <Button variant="secondary" className="flex-1" onClick={() => onPause(agent.id)}>Pausar</Button>
                )}
                {agent.status === 'paused' && (
                  <Button className="flex-1" onClick={() => onActivate(agent.id)}>Reanudar</Button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
               No se encontraron sub-agentes con esos filtros.
            </div>
          )}
        </div>
        <div className="h-12 w-full"></div> {/* Spacer */}
      </div>
    </div>
  );
}
