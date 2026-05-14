import * as React from "react";
import { AdminTeam, AdminAgent } from "../../../types/admin";
import { TeamsToolbar } from "./TeamsToolbar";
import { TeamsTable } from "./TeamsTable";
import { CreateTeamDialog } from "./CreateTeamDialog";
import { EditTeamDialog } from "./EditTeamDialog";
import { DeleteTeamDialog } from "./DeleteTeamDialog";

interface TeamsPageProps {
  teams: AdminTeam[];
  setTeams: React.Dispatch<React.SetStateAction<AdminTeam[]>>;
  agents: AdminAgent[];
  setAgents: React.Dispatch<React.SetStateAction<AdminAgent[]>>;
}

export function TeamsPage({ teams, setTeams, agents, setAgents }: TeamsPageProps) {
  const [search, setSearch] = React.useState("");
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editingTeam, setEditingTeam] = React.useState<AdminTeam | null>(null);
  const [deletingTeam, setDeletingTeam] = React.useState<AdminTeam | null>(null);

  const filteredTeams = React.useMemo(() => {
    return teams.filter(team => {
      if (search) {
        const q = search.toLowerCase();
        if (!team.name.toLowerCase().includes(q) && !team.description.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [teams, search]);

  const handleCreate = (newTeam: AdminTeam) => {
    setTeams(prev => [newTeam, ...prev]);
  };

  const handleEdit = (updatedTeam: AdminTeam) => {
    setTeams(prev => prev.map(t => t.id === updatedTeam.id ? updatedTeam : t));
    // Reflejar cambios en agentes si fuere necesario (por ejemplo si cambia el nombre del team)
    setAgents(prev => prev.map(a => a.teamId === updatedTeam.id ? { ...a, teamName: updatedTeam.name } : a));
  };

  const handleDelete = (teamId: string, reassignToId: string) => {
    setTeams(prev => prev.filter(t => t.id !== teamId));
    
    // Reasignar agentes
    let newTeamName: string | undefined = undefined;
    if (reassignToId !== "none") {
      newTeamName = teams.find(t => t.id === reassignToId)?.name;
    }

    setAgents(prev => prev.map(a => {
      if (a.teamId === teamId) {
        return {
          ...a,
          teamId: reassignToId === "none" ? undefined : reassignToId,
          teamName: newTeamName
        };
      }
      return a;
    }));
  };

  return (
    <div className="flex flex-col h-full bg-neutral-50 relative">
      <div className="flex-none p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Equipos</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Organiza agentes por áreas de atención, ventas y operación.
            </p>
          </div>
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2"
          >
            <i className="ri-add-line mr-2"></i>
            Crear equipo
          </button>
        </div>

        <TeamsToolbar 
          search={search}
          setSearch={setSearch}
          count={filteredTeams.length}
        />
      </div>

      <div className="flex-1 overflow-auto p-6">
        <TeamsTable 
          teams={filteredTeams} 
          onEdit={setEditingTeam}
          onDelete={setDeletingTeam}
        />
      </div>

      <CreateTeamDialog 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
        onCreate={handleCreate} 
        agents={agents}
      />

      {editingTeam && (
        <EditTeamDialog 
          team={editingTeam} 
          open={!!editingTeam} 
          onOpenChange={(v) => !v && setEditingTeam(null)} 
          onSave={handleEdit} 
          agents={agents}
        />
      )}

      {deletingTeam && (
        <DeleteTeamDialog 
          team={deletingTeam} 
          open={!!deletingTeam} 
          onOpenChange={(v) => !v && setDeletingTeam(null)} 
          teams={teams}
          onConfirm={(reassignTo) => {
            handleDelete(deletingTeam.id, reassignTo);
            setDeletingTeam(null);
          }} 
        />
      )}
    </div>
  );
}
