import * as React from "react";
import { Toaster, toast } from 'sonner';
import { InboxLayout } from "./components/layout/InboxLayout";
import { ConversationList } from "./components/inbox/ConversationList";
import { ChatPanel } from "./components/inbox/ChatPanel";
import { ContactDetailsPanel } from "./components/inbox/ContactDetailsPanel";
import { TagManagerDialog } from "./components/inbox/TagManagerDialog";
import { TransferDialog } from "./components/inbox/TransferDialog";
import { AdvancedFiltersSheet } from "./components/inbox/AdvancedFiltersSheet";
import { ChannelsLayout } from "./components/channels/ChannelsLayout";
import { ChannelsSidebar } from "./components/channels/ChannelsSidebar";
import { WhatsAppChannelPage } from "./components/channels/WhatsAppChannelPage";
import { InstagramChannelPage } from "./components/channels/InstagramChannelPage";
import { MetricsLayout } from "./components/metrics/MetricsLayout";
import { MetricsSidebar } from "./components/metrics/MetricsSidebar";
import { GeneralMetricsPage } from "./components/metrics/GeneralMetricsPage";
import { ChannelMetricsPage } from "./components/metrics/ChannelMetricsPage";
import { ExportMetricsPage } from "./components/metrics/ExportMetricsPage";
import { MetricsSection } from "./types/metrics";
import { dummyConversations } from "./data/conversations";
import { dummyTemplates } from "./data/templates";
import { Conversation, Message } from "./types/inbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./components/ui/dialog";
import { Button } from "./components/ui/button";

import { ContactsLayout } from "./components/contacts/ContactsLayout";

import { AiCenterLayout } from "./components/ai-center/AiCenterLayout";
import { AiCenterSidebar } from "./components/ai-center/AiCenterSidebar";
import { OrchestratorPage } from "./components/ai-center/orchestrator/OrchestratorPage";
import { SubAgentsPage } from "./components/ai-center/sub-agents/SubAgentsPage";
import { SubAgentConfigSheet } from "./components/ai-center/sub-agents/SubAgentConfigSheet";
import { KnowledgeBasePage } from "./components/ai-center/knowledge-base/KnowledgeBasePage";
import { AiCenterSection, OrchestratorConfig, AiAsset, SubAgent, RoutingRule, HumanHandoffRule, KnowledgeBase, KnowledgeSource } from "./types/aiCenter";
import { 
  initialOrchestratorConfig, 
  initialAiAssets, 
  initialSubAgents, 
  initialRoutingRules, 
  initialKnowledgeBases, 
  initialKnowledgeSources,
  initialHumanHandoffRules
} from "./data/aiCenter";

import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminSidebar } from "./components/admin/AdminSidebar";
import { AgentsPage } from "./components/admin/agents/AgentsPage";
import { TeamsPage } from "./components/admin/teams/TeamsPage";
import { AssignmentRulesPage } from "./components/admin/assignment-rules/AssignmentRulesPage";

import { AdminSection, AdminAgent, AdminTeam, AssignmentRule } from "./types/admin";
import { initialAdminAgents, initialAdminTeams, initialAssignmentRules } from "./data/admin";

import { SettingsLayout } from "./components/settings/SettingsLayout";
import { SettingsSidebar } from "./components/settings/SettingsSidebar";
import { PricingPlansPage } from "./components/settings/PricingPlansPage";
import { SettingsSection } from "./types/settings";

export default function App() {
  const [activeMainSection, setActiveMainSection] = React.useState<"inbox" | "channels" | "metrics" | "contacts" | "ai_center" | "admin" | "settings">("inbox");
  const [activeChannelConfig, setActiveChannelConfig] = React.useState<"whatsapp" | "instagram">("whatsapp");
  const [activeMetricsSection, setActiveMetricsSection] = React.useState<MetricsSection>("general");
  const [activeAiCenterSection, setActiveAiCenterSection] = React.useState<AiCenterSection>("orchestrator");
  const [activeAdminSection, setActiveAdminSection] = React.useState<AdminSection>("agents");
  const [activeSettingsSection, setActiveSettingsSection] = React.useState<SettingsSection>("pricing_plans");

  // AI Center Data
  const [orchConfig, setOrchConfig] = React.useState<OrchestratorConfig>(initialOrchestratorConfig);
  const [aiAssets, setAiAssets] = React.useState<AiAsset[]>(initialAiAssets);
  const [subAgents, setSubAgents] = React.useState<SubAgent[]>(initialSubAgents);
  const [routingRules, setRoutingRules] = React.useState<RoutingRule[]>(initialRoutingRules);
  const [handoffRules, setHandoffRules] = React.useState<HumanHandoffRule[]>(initialHumanHandoffRules);
  const [kbs, setKbs] = React.useState<KnowledgeBase[]>(initialKnowledgeBases);
  const [kbSources, setKbSources] = React.useState<KnowledgeSource[]>(initialKnowledgeSources);

  // Focus and Selection for sub-agents
  const [selectedSubAgent, setSelectedSubAgent] = React.useState<SubAgent | null>(null);

  const [adminAgents, setAdminAgents] = React.useState<AdminAgent[]>(initialAdminAgents);
  const [adminTeams, setAdminTeams] = React.useState<AdminTeam[]>(initialAdminTeams);
  const [adminAssignmentRules, setAdminAssignmentRules] = React.useState<AssignmentRule[]>(initialAssignmentRules);

  const [conversations, setConversations] = React.useState<Conversation[]>(dummyConversations);
  const [selectedId, setSelectedId] = React.useState<string | null>(dummyConversations[0].id);
  
  // Filters
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterChannel, setFilterChannel] = React.useState<'all' | 'whatsapp' | 'instagram'>('all');
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'open' | 'resolved' | 'closed' | 'expired'>('all');
  const [filterView, setFilterView] = React.useState<string>("all");

  const [isTemplateModalOpen, setIsTemplateModalOpen] = React.useState(false);
  const [isTagManagerOpen, setIsTagManagerOpen] = React.useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = React.useState(false);
  const [isFiltersSheetOpen, setIsFiltersSheetOpen] = React.useState(false);
  
  // History tab management
  const [activeChatTab, setActiveChatTab] = React.useState<string>('current');
  const [openHistoryTabs, setOpenHistoryTabs] = React.useState<string[]>([]);
  
  // Reset tabs when conversation changes
  React.useEffect(() => {
    setActiveChatTab('current');
    setOpenHistoryTabs([]);
  }, [selectedId]);

  const selectedConversation = React.useMemo(() => 
    conversations.find(c => c.id === selectedId) || null
  , [conversations, selectedId]);

  const filteredConversations = React.useMemo(() => {
    return conversations.filter(c => {
      // Base filters
      if (filterChannel !== 'all' && c.activeChannel !== filterChannel && c.channel !== filterChannel) return false;
      
      const currentStatus = c.channelStatus?.[c.activeChannel] || c.status;
      if (filterStatus !== 'all' && currentStatus !== filterStatus) return false;
      
      // View filters
      if (filterView === 'my_inbox') {
        if (c.handledBy !== 'human' || currentStatus === 'resolved' || currentStatus === 'closed') return false;
      } else if (filterView === 'unassigned') {
        if (c.handledBy !== 'unassigned') return false;
      } else if (filterView === 'expired') {
        if (currentStatus !== 'expired') return false;
      }

      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!c.contactName.toLowerCase().includes(q) && 
            !(c.lastMessage && c.lastMessage.toLowerCase().includes(q)) &&
            !c.phone.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [conversations, filterChannel, filterStatus, filterView, searchQuery]);

  const handleSelectConversation = (id: string) => {
    setSelectedId(id);
    
    // Mark as read
    setConversations(prev => prev.map(c => {
      if (c.id === id && c.isUnread) {
        return { ...c, isUnread: false };
      }
      return c;
    }));
  };

  const handleSendMessage = (text: string, isInternal: boolean, replyToMsg?: Message) => {
    if (!selectedId) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      conversationId: selectedId,
      direction: isInternal ? 'internal' : 'outbound',
      type: 'text',
      text,
      createdAt: new Date().toISOString(),
      status: isInternal ? undefined : 'sending',
      replyToId: replyToMsg?.id,
      replyToMessage: replyToMsg
    };

    setConversations(prev => prev.map(c => {
      if (c.id === selectedId) {
        const activeChan = c.activeChannel || c.channel;
        const currentMsgs = c.threadsByChannel?.[activeChan] || c.messages || [];
        
        const newThreads = {
          ...(c.threadsByChannel || {}),
          [activeChan]: [...currentMsgs, newMessage]
        };

        return {
          ...c,
          lastMessage: isInternal ? c.lastMessage : text,
          lastMessageAt: newMessage.createdAt,
          messages: [...(c.messages || []), newMessage],
          threadsByChannel: newThreads as any
        };
      }
      return c;
    }));

    if (!isInternal) {
      // Simulate sending -> sent -> delivered
      setTimeout(() => {
        setConversations(prev => prev.map(c => {
          if (c.id === selectedId) {
            const activeChan = c.activeChannel || c.channel;
            const currentMsgs = c.threadsByChannel?.[activeChan] || c.messages || [];
            
            const updatedMsgs = currentMsgs.map(m => m.id === newMessage.id ? { ...m, status: 'sent' as const } : m);
            
            const newThreads = {
              ...(c.threadsByChannel || {}),
              [activeChan]: updatedMsgs
            };
            return {
              ...c,
              messages: c.messages?.map(m => m.id === newMessage.id ? { ...m, status: 'sent' } : m),
              threadsByChannel: newThreads as any
            };
          }
          return c;
        }));
      }, 800);
      
      toast.success("Mensaje enviado");
    } else {
      toast.success("Nota interna guardada");
    }
  };

  const handleChangeStatus = (status: 'open' | 'resolved' | 'closed' | 'expired') => {
    if (!selectedId) return;
    setConversations(prev => prev.map(c => {
      if (c.id === selectedId) {
        const activeChan = c.activeChannel || c.channel;
        return { 
          ...c, 
          status,
          channelStatus: {
            ...(c.channelStatus || {}),
            [activeChan]: status
          }
        };
      }
      return c;
    }));
    toast.success(`Conversación marcada como ${status === 'open' ? 'abierta' : status === 'resolved' ? 'resuelta' : 'cerrada'}`);
  };

  const handleSuggestAi = () => {
    toast("Sugerencia de IA generada", {
      description: "Claro, tenemos opciones de beca parcial según el programa. ¿Quieres que te comparta los requisitos?",
      action: {
        label: "Copiar",
        onClick: () => navigator.clipboard.writeText("Claro, tenemos opciones de beca parcial según el programa. ¿Quieres que te comparta los requisitos?")
      }
    });
  };

  return (
    <>
      <Toaster position="top-center" />
      {activeMainSection === "inbox" ? (
        <InboxLayout 
          activeMainSection={activeMainSection}
          onMainSectionChange={setActiveMainSection}
          listSlot={
            <ConversationList 
              conversations={filteredConversations}
              selectedId={selectedId}
              onSelect={handleSelectConversation}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterChannel={filterChannel}
              setFilterChannel={setFilterChannel}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterView={filterView}
              setFilterView={setFilterView}
              onOpenAdvancedFilters={() => setIsFiltersSheetOpen(true)}
              activeFilterCount={(filterChannel !== 'all' ? 1 : 0) + (filterStatus !== 'all' ? 1 : 0)}
            />
          }
          chatSlot={
            <ChatPanel 
              conversation={selectedConversation}
              onSendMessage={handleSendMessage}
              onChangeStatus={handleChangeStatus}
              onOpenTemplates={() => setIsTemplateModalOpen(true)}
              onSuggestAi={handleSuggestAi}
              onOpenTransfer={() => setIsTransferModalOpen(true)}
              onSwitchChannel={(ch) => {
                setConversations(prev => prev.map(c => {
                  if (c.id === selectedId) return { ...c, activeChannel: ch };
                  return c;
                }));
              }}
              activeChatTab={activeChatTab}
              setActiveChatTab={setActiveChatTab}
              openHistoryTabs={openHistoryTabs}
              setOpenHistoryTabs={setOpenHistoryTabs}
            />
          }
          detailsSlot={
            <ContactDetailsPanel 
              conversation={selectedConversation}
              onUpdateProperty={() => toast("Funcionalidad simulada: Actualizar propiedad")}
              onManageTags={() => setIsTagManagerOpen(true)}
              onChangeFunnelStage={(stage) => {
                setConversations(prev => prev.map(c => {
                  if (c.id === selectedId) {
                    return { 
                      ...c, 
                      funnelStage: stage,
                      events: [
                        ...c.events,
                        {
                          id: `ev_${Date.now()}`,
                          type: 'system_log',
                          description: `Etapa del funnel actualizada a ${stage}`,
                          createdAt: new Date().toISOString()
                        }
                      ]
                    };
                  }
                  return c;
                }));
                toast.success(`Etapa del funnel actualizada a ${stage}`);
              }}
              onOpenHistory={(historyId) => {
                if (!openHistoryTabs.includes(historyId)) {
                  setOpenHistoryTabs(prev => [...prev, historyId]);
                }
                if (activeChatTab !== historyId) {
                  setActiveChatTab(historyId);
                  toast("Conversación histórica abierta", {
                    description: "Modo de solo lectura.",
                    duration: 3000,
                  });
                }
              }}
              onAddTag={(tag) => {
                setConversations(prev => prev.map(c => {
                  if (c.id === selectedId) {
                    if (c.tags.some(t => t.id === tag.id)) return c;
                    return { ...c, tags: [...c.tags, tag] };
                  }
                  return c;
                }));
                toast.success("Etiqueta agregada.");
              }}
              onRemoveTag={(tagId) => {
                setConversations(prev => prev.map(c => {
                  if (c.id === selectedId) return { ...c, tags: c.tags.filter(t => t.id !== tagId) };
                  return c;
                }));
                toast.success("Etiqueta removida.");
              }}
            />
          }
        />
      ) : activeMainSection === "channels" ? (
        <ChannelsLayout 
          activeMainSection={activeMainSection}
          onMainSectionChange={setActiveMainSection}
          sidebarSlot={
            <ChannelsSidebar 
              activeChannel={activeChannelConfig} 
              onChannelChange={setActiveChannelConfig} 
            />
          }
          contentSlot={
            activeChannelConfig === 'whatsapp' ? <WhatsAppChannelPage /> : <InstagramChannelPage />
          }
        />
      ) : activeMainSection === "metrics" ? (
        <MetricsLayout
          activeMainSection={activeMainSection}
          onMainSectionChange={setActiveMainSection}
          sidebarSlot={
            <MetricsSidebar
              activeSection={activeMetricsSection}
              onSectionChange={setActiveMetricsSection}
            />
          }
          contentSlot={
            activeMetricsSection === 'general' ? <GeneralMetricsPage /> :
            activeMetricsSection === 'channels' ? <ChannelMetricsPage /> :
            <ExportMetricsPage />
          }
        />
      ) : activeMainSection === "contacts" ? (
        <ContactsLayout 
          activeMainSection={activeMainSection}
          onMainSectionChange={setActiveMainSection}
        />
      ) : activeMainSection === "ai_center" ? (
        <AiCenterLayout
          activeMainSection={activeMainSection}
          onMainSectionChange={setActiveMainSection}
          sidebarSlot={
            <AiCenterSidebar 
              activeSection={activeAiCenterSection}
              onSectionChange={setActiveAiCenterSection}
            />
          }
          contentSlot={
            activeAiCenterSection === "orchestrator" ? (
              <OrchestratorPage 
                config={orchConfig}
                setConfig={setOrchConfig}
                assets={aiAssets}
                setAssets={setAiAssets}
                subAgents={subAgents}
                routingRules={routingRules}
                setRoutingRules={setRoutingRules}
                handoffRules={handoffRules}
                setHandoffRules={setHandoffRules}
                onConfigureAgent={(agent) => {
                  setSelectedSubAgent(agent);
                  setActiveAiCenterSection("sub_agents");
                }}
              />
            ) : activeAiCenterSection === "sub_agents" ? (
              <SubAgentsPage 
                subAgents={subAgents}
                onOpenConfig={(agent) => setSelectedSubAgent(agent)}
                onActivate={(id) => setSubAgents(prev => prev.map(a => a.id === id ? { ...a, status: 'active' } : a))}
                onPause={(id) => setSubAgents(prev => prev.map(a => a.id === id ? { ...a, status: 'paused' } : a))}
              />
            ) : (
              <KnowledgeBasePage 
                knowledgeBases={kbs}
                setKnowledgeBases={setKbs}
                sources={kbSources}
                setSources={setKbSources}
                subAgents={subAgents}
              />
            )
          }
        />
      ) : activeMainSection === "admin" ? (
        <AdminLayout
          activeMainSection={activeMainSection}
          onMainSectionChange={setActiveMainSection}
          sidebarSlot={
            <AdminSidebar 
              activeSection={activeAdminSection}
              onSectionChange={setActiveAdminSection}
            />
          }
          contentSlot={
            activeAdminSection === "agents" ? (
              <AgentsPage agents={adminAgents} setAgents={setAdminAgents} teams={adminTeams} />
            ) : activeAdminSection === "teams" ? (
              <TeamsPage teams={adminTeams} setTeams={setAdminTeams} agents={adminAgents} setAgents={setAdminAgents} />
            ) : (
              <AssignmentRulesPage rules={adminAssignmentRules} setRules={setAdminAssignmentRules} agents={adminAgents} teams={adminTeams} />
            )
          }
        />
      ) : (
        <SettingsLayout
          activeMainSection={activeMainSection}
          onMainSectionChange={setActiveMainSection}
          sidebarSlot={
            <SettingsSidebar 
              activeSection={activeSettingsSection}
              onSectionChange={setActiveSettingsSection}
            />
          }
          contentSlot={
            <PricingPlansPage />
          }
        />
      )}

      {/* Ai Center Modals */}
      <SubAgentConfigSheet 
        open={selectedSubAgent !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedSubAgent(null);
        }}
        agent={selectedSubAgent}
        knowledgeBases={kbs}
        assets={aiAssets}
        onSave={(updated) => {
          setSubAgents(prev => prev.map(a => a.id === updated.id ? updated : a));
          toast.success("Sub-agente actualizado");
        }}
        onActivate={(id) => setSubAgents(prev => prev.map(a => a.id === id ? { ...a, status: 'active' } : a))}
        onPause={(id) => setSubAgents(prev => prev.map(a => a.id === id ? { ...a, status: 'paused' } : a))}
        onRemove={(id) => setSubAgents(prev => prev.filter(a => a.id !== id))}
      />

      {/* Modals outside layouts */}
      <TagManagerDialog open={isTagManagerOpen} onOpenChange={setIsTagManagerOpen} />
      <TransferDialog 
        open={isTransferModalOpen} 
        onOpenChange={setIsTransferModalOpen} 
        conversation={selectedConversation}
        onTransfer={(type, targetId, targetName, reason, note) => {
          if (!selectedId) return;
          setConversations(prev => prev.map(c => {
            if (c.id === selectedId) {
              return {
                ...c,
                handledBy: type === 'ai' ? 'ai' : 'human',
                ownerName: type === 'ai' ? 'Agente IA' : targetName,
                events: [
                  ...c.events,
                  {
                    id: `ev_${Date.now()}`,
                    type: 'transfer',
                    description: `Conversación transferida a ${targetName}${reason ? ` por motivo: ${reason}` : ''}`,
                    createdAt: new Date().toISOString()
                  }
                ]
              };
            }
            return c;
          }));
          toast.success(`Conversación transferida correctamente.`);
        }}
      />
      <AdvancedFiltersSheet 
        open={isFiltersSheetOpen} 
        onOpenChange={setIsFiltersSheetOpen}
        filterChannel={filterChannel}
        setFilterChannel={setFilterChannel}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      {/* Template Modal */}
      <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
        <DialogContent className="max-w-3xl h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Plantillas HSM (WhatsApp)</DialogTitle>
            <DialogDescription>
              Selecciona una plantilla pre-aprobada para iniciar o reabrir una conversación.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto mt-4 border rounded-md">
            {dummyTemplates.map(tpl => (
              <div key={tpl.id} className="p-4 border-b last:border-0 hover:bg-muted/50 cursor-pointer flex justify-between items-center"
                onClick={() => {
                  toast.success(`Plantilla "${tpl.name}" enviada exitosamente.`);
                  setIsTemplateModalOpen(false);
                  
                  if (selectedId) {
                    // Inject template message
                    setConversations(prev => prev.map(c => {
                      if (c.id === selectedId) {
                        const newMsg: Message = {
                          id: `msg_${Date.now()}`,
                          conversationId: selectedId,
                          direction: 'outbound',
                          type: 'template',
                          text: tpl.text.replace(/{{[^}]+}}/g, '...'),
                          createdAt: new Date().toISOString(),
                          status: 'delivered'
                        };
                        const activeChan = c.activeChannel || c.channel;
                        const currentMsgs = c.threadsByChannel?.[activeChan] || c.messages || [];
                        const newThreads = {
                          ...(c.threadsByChannel || {}),
                          [activeChan]: [...currentMsgs, newMsg]
                        };
                        return {
                          ...c,
                          status: 'open',
                          channelStatus: { ...(c.channelStatus || {}), [activeChan]: 'open' },
                          messages: [...(c.messages || []), newMsg],
                          threadsByChannel: newThreads as any
                        };
                      }
                      return c;
                    }));
                  }
                }}
              >
                <div>
                  <h4 className="font-semibold text-sm mb-1">{tpl.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-1">{tpl.text}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">{tpl.category}</span>
                    <span className="text-[10px] text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">Aprobada</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">Usar</Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

