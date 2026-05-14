import * as React from "react";
import { AdminAgent, AdminTeam } from "../../../types/admin";
import { AgentStatusBadge } from "./AgentStatusBadge";
import { Avatar } from "@/components/ui/shared";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AgentsTableProps {
  agents: AdminAgent[];
  teams: AdminTeam[];
  onEdit: (agent: AdminAgent) => void;
  onDelete: (agent: AdminAgent) => void;
  onChangeStatus: (id: string, status: "active" | "inactive" | "break") => void;
}

export function AgentsTable({ agents, teams, onEdit, onDelete, onChangeStatus }: AgentsTableProps) {
  
  const getTeamBadge = (teamId?: string) => {
    if (!teamId) return <span className="text-muted-foreground text-xs italic">Sin equipo</span>;
    const team = teams.find(t => t.id === teamId);
    if (!team) return <Badge variant="outline" className="text-xs font-normal">Desconocido</Badge>;
    return (
      <Badge variant="outline" className={`text-xs font-normal border-transparent ${team.color || 'bg-muted text-muted-foreground'}`}>
        {team.name}
      </Badge>
    );
  };

  if (agents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center border overflow-hidden rounded-xl bg-background border-dashed shadow-sm">
        <i className="ri-team-line text-5xl text-muted-foreground mb-4"></i>
        <h3 className="text-lg font-medium">No encontramos agentes</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">No hay agentes que coincidan con los filtros actuales o no existen en la plataforma.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden w-full shadow-sm">
      <div className="grid grid-cols-12 gap-3 px-4 py-3 border-b border-neutral-200 text-[11px] font-semibold text-muted-foreground bg-white uppercase tracking-wider">
        <div className="col-span-2">Agente</div>
        <div className="col-span-2">Email</div>
        <div className="col-span-1">Estado</div>
        <div className="col-span-1">Equipo</div>
        <div className="col-span-2">Conversación actual</div>
        <div className="col-span-1 text-center">Abiertas</div>
        <div className="col-span-1 text-center whitespace-nowrap" title="Requieren respuesta">Requieren respuesta</div>
        <div className="col-span-1">Última actividad</div>
        <div className="col-span-1 text-right">Acciones</div>
      </div>
      <div className="divide-y relative">
        <div className="absolute left-[16.666%] top-0 bottom-0 w-px bg-neutral-100 -z-10"></div>
        {agents.map(agent => (
          <div key={agent.id} className="grid grid-cols-12 gap-3 px-4 py-3 border-b border-neutral-100 items-center hover:bg-neutral-50/70 transition-colors text-sm bg-white">
            <div className="col-span-2 flex items-center gap-3 min-w-0 pr-2">
               <Avatar fallback={agent.initials} className="h-9 w-9 bg-primary/5 text-primary border border-primary/10" />
               <div className="truncate">
                 <div className="font-medium text-foreground truncate">{agent.name}</div>
                 <div className="text-xs text-muted-foreground truncate">{agent.role}</div>
               </div>
            </div>
            
            <div className="col-span-2 truncate text-muted-foreground text-xs pr-2" title={agent.email}>
              {agent.email}
            </div>

            <div className="col-span-1">
              <AgentStatusBadge status={agent.status} />
            </div>
            
            <div className="col-span-1 pr-2">
              {getTeamBadge(agent.teamId)}
            </div>
            
            <div className="col-span-2 truncate text-xs pr-2">
              {agent.currentConversation ? (
                <div>
                  <button 
                    onClick={() => toast("Funcionalidad simulada", { description: "Abrir conversación en Inbox estará disponible próximamente."})}
                    className="flex items-center gap-1.5 font-medium text-foreground hover:underline hover:text-primary transition-colors w-fit max-w-full truncate"
                  >
                     <i className="ri-chat-3-line shrink-0 text-muted-foreground"></i>
                     <span className="truncate">{agent.currentConversation.contactName}</span>
                  </button>
                  <div className="text-[11px] text-muted-foreground mt-0.5 truncate capitalize">
                     {agent.currentConversation.channel}
                  </div>
                </div>
              ) : (
                <span className="text-muted-foreground italic truncate">Sin conversación activa</span>
              )}
            </div>

            <div className="col-span-1 text-center text-xs">
               <div className="font-medium">{agent.assignedOpenConversations}</div>
            </div>

            <div className="col-span-1 text-center text-xs">
               <div className="font-medium text-amber-600">{agent.pendingConversations > 0 ? agent.pendingConversations : 0}</div>
            </div>

            <div className="col-span-1 text-xs text-muted-foreground">
               {agent.lastActivityAt}
            </div>

            <div className="col-span-1 flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menú</span>
                    <i className="ri-more-2-fill"></i>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                  <DropdownMenuItem onClick={() => toast("Ver detalles", { description: "Pronto disponible"})}>
                     <i className="ri-eye-line mr-2"></i> Ver detalles
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(agent)}>
                     <i className="ri-pencil-line mr-2"></i> Editar agente
                  </DropdownMenuItem>
                  
                  <div className="h-px bg-border my-1"></div>
                  
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Cambiar estado</div>
                  {agent.status !== 'active' && (
                    <DropdownMenuItem onClick={() => { onChangeStatus(agent.id, 'active'); toast.success("Estado actualizado a Activo"); }}>
                      <i className="ri-checkbox-circle-line mr-2 text-green-600"></i> Activo
                    </DropdownMenuItem>
                  )}
                  {agent.status !== 'break' && (
                    <DropdownMenuItem onClick={() => { onChangeStatus(agent.id, 'break'); toast.success("Estado actualizado a Break"); }}>
                      <i className="ri-cup-line mr-2 text-amber-600"></i> Break
                    </DropdownMenuItem>
                  )}
                  {agent.status !== 'inactive' && (
                    <DropdownMenuItem onClick={() => { onChangeStatus(agent.id, 'inactive'); toast.success("Estado actualizado a Inactivo"); }}>
                      <i className="ri-close-circle-line mr-2 text-muted-foreground"></i> Inactivo
                    </DropdownMenuItem>
                  )}
                  
                  <div className="h-px bg-border my-1"></div>
                  
                  <DropdownMenuItem className="focus:text-foreground" onClick={() => toast("Desactivar", { description: "Simulado"})}>
                     <i className="ri-user-unfollow-line mr-2"></i> Desactivar
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(agent)}>
                     <i className="ri-delete-bin-line mr-2"></i> Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
