import * as React from "react";
import { AdminTeam } from "../../../types/admin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AgentsToolbarProps {
  search: string;
  setSearch: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  teamFilter: string;
  setTeamFilter: (v: string) => void;
  teams: AdminTeam[];
  count: number;
}

export function AgentsToolbar({
  search, setSearch,
  statusFilter, setStatusFilter,
  teamFilter, setTeamFilter,
  teams,
  count
}: AgentsToolbarProps) {
  
  const handleClear = () => {
    setSearch("");
    setStatusFilter("all");
    setTeamFilter("all");
  };

  const hasFilters = search !== "" || statusFilter !== "all" || teamFilter !== "all";

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative w-64">
           <i className="ri-search-line absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground mr-1"></i>
           <Input 
             placeholder="Buscar agentes..." 
             className="pl-8 h-9" 
             value={search}
             onChange={e => setSearch(e.target.value)}
           />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[150px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Activo</SelectItem>
            <SelectItem value="inactive">Inactivo</SelectItem>
            <SelectItem value="break">Break</SelectItem>
          </SelectContent>
        </Select>
        <Select value={teamFilter} onValueChange={setTeamFilter}>
          <SelectTrigger className="h-9 w-[180px]">
            <SelectValue placeholder="Equipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {teams.map(team => (
              <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={handleClear} className="text-muted-foreground h-9 px-3">
            Limpiar filtros
          </Button>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        {count} {count === 1 ? 'agente' : 'agentes'}
      </div>
    </div>
  );
}
