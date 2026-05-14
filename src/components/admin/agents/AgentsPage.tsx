import * as React from "react";
import { AdminAgent, AdminTeam } from "../../../types/admin";
import { AgentsToolbar } from "./AgentsToolbar";
import { AgentsTable } from "./AgentsTable";
import { CreateAgentDialog } from "./CreateAgentDialog";
import { EditAgentDialog } from "./EditAgentDialog";
import { DeleteAgentDialog } from "./DeleteAgentDialog";

interface AgentsPageProps {
  agents: AdminAgent[];
  setAgents: React.Dispatch<React.SetStateAction<AdminAgent[]>>;
  teams: AdminTeam[];
}

export function AgentsPage({ agents, setAgents, teams }: AgentsPageProps) {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [teamFilter, setTeamFilter] = React.useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editingAgent, setEditingAgent] = React.useState<AdminAgent | null>(null);
  const [deletingAgent, setDeletingAgent] = React.useState<AdminAgent | null>(null);

  const filteredAgents = React.useMemo(() => {
    return agents.filter(agent => {
      if (statusFilter !== "all" && agent.status !== statusFilter) return false;
      if (teamFilter !== "all" && agent.teamId !== teamFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!agent.name.toLowerCase().includes(q) && !agent.email.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [agents, search, statusFilter, teamFilter]);

  const handleCreate = (newAgent: AdminAgent) => {
    setAgents(prev => [newAgent, ...prev]);
  };

  const handleEdit = (updatedAgent: AdminAgent) => {
    setAgents(prev => prev.map(a => a.id === updatedAgent.id ? updatedAgent : a));
  };

  const handleDelete = (id: string) => {
    setAgents(prev => prev.filter(a => a.id !== id));
  };

  const handleChangeStatus = (id: string, status: "active" | "inactive" | "break") => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      <div className="flex-none p-6 pb-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Agentes</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Gestiona los agentes humanos, su estado operativo, equipo y conversación actual.
            </p>
          </div>
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2"
          >
            <i className="ri-add-line mr-2"></i>
            Crear agente
          </button>
        </div>

        <AgentsToolbar 
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          teamFilter={teamFilter}
          setTeamFilter={setTeamFilter}
          teams={teams}
          count={filteredAgents.length}
        />
      </div>

      <div className="flex-1 overflow-auto p-6">
        <AgentsTable 
          agents={filteredAgents} 
          teams={teams}
          onEdit={setEditingAgent}
          onDelete={setDeletingAgent}
          onChangeStatus={handleChangeStatus}
        />
      </div>

      <CreateAgentDialog 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
        teams={teams} 
        onCreate={handleCreate} 
      />

      {editingAgent && (
        <EditAgentDialog 
          agent={editingAgent} 
          open={!!editingAgent} 
          onOpenChange={(v) => !v && setEditingAgent(null)} 
          teams={teams} 
          onSave={handleEdit} 
        />
      )}

      {deletingAgent && (
        <DeleteAgentDialog 
          agent={deletingAgent} 
          open={!!deletingAgent} 
          onOpenChange={(v) => !v && setDeletingAgent(null)} 
          agents={agents}
          onConfirm={() => {
            handleDelete(deletingAgent.id);
            setDeletingAgent(null);
          }} 
        />
      )}
    </div>
  );
}
