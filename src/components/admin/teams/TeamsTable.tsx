import * as React from "react";
import { AdminTeam } from "../../../types/admin";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface TeamsTableProps {
  teams: AdminTeam[];
  onEdit: (team: AdminTeam) => void;
  onDelete: (team: AdminTeam) => void;
}

export function TeamsTable({ teams, onEdit, onDelete }: TeamsTableProps) {
  if (teams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center border overflow-hidden rounded-xl bg-background border-dashed shadow-sm">
        <i className="ri-building-2-line text-5xl text-muted-foreground mb-4"></i>
        <h3 className="text-lg font-medium">No encontramos equipos</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">Crea tu primer equipo para agrupar a tus agentes.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden w-full shadow-sm">
      <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-neutral-200 text-[11px] font-semibold text-muted-foreground bg-white uppercase tracking-wider">
        <div className="col-span-3">Equipo</div>
        <div className="col-span-2 text-center">Agentes</div>
        <div className="col-span-2 text-center">Activos</div>
        <div className="col-span-2 text-center">Conv. Abiertas</div>
        <div className="col-span-1 text-center">Reglas</div>
        <div className="col-span-1">Actividad</div>
        <div className="col-span-1 text-right">Acciones</div>
      </div>
      <div className="divide-y relative">
        <div className="absolute left-[25%] top-0 bottom-0 w-px bg-neutral-100 -z-10"></div>
        {teams.map(team => (
          <div key={team.id} className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-neutral-100 items-center hover:bg-neutral-50/70 transition-colors text-sm bg-white">
            <div className="col-span-3 min-w-0 pr-4">
               <div className="flex items-center gap-2 mb-1">
                 <div className={`w-3 h-3 rounded-full ${team.color?.split(' ')[0] || 'bg-slate-200'} border border-black/10`}></div>
                 <div className="font-medium text-foreground truncate">{team.name}</div>
               </div>
               <div className="text-xs text-muted-foreground line-clamp-2" title={team.description}>{team.description}</div>
            </div>
            
            <div className="col-span-2 text-center font-medium">
              {team.memberIds.length}
            </div>
            
            <div className="col-span-2 text-center">
               <div className="inline-flex py-0.5 px-2 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                  {team.activeAgents} / {team.memberIds.length}
               </div>
            </div>

            <div className="col-span-2 text-center">
               <div className="font-medium">{team.openConversations}</div>
            </div>

            <div className="col-span-1 text-center">
               <div className="text-muted-foreground">{team.associatedRules}</div>
            </div>

            <div className="col-span-1 text-xs text-muted-foreground">
               {team.lastActivityAt}
            </div>

            <div className="col-span-1 flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menú</span>
                    <i className="ri-more-2-fill"></i>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  <DropdownMenuItem onClick={() => toast("Ver detalles", { description: "Pronto disponible"})}>
                     <i className="ri-eye-line mr-2"></i> Ver detalles
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(team)}>
                     <i className="ri-pencil-line mr-2"></i> Editar equipo
                  </DropdownMenuItem>
                  <div className="h-px bg-border my-1"></div>
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(team)}>
                     <i className="ri-delete-bin-line mr-2"></i> Eliminar equipo
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
