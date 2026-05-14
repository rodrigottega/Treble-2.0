import * as React from "react";
import { AppSidebar } from "../layout/AppSidebar";
import { ContactsTable } from "./ContactsTable";
import { ContactsToolbar } from "./ContactsToolbar";
import { ContactDetailsDrawer } from "./ContactDetailsDrawer";
import { ContactsHeader } from "./ContactsHeader";
import { BulkActionsBar } from "./BulkActionsBar";
import { mockContacts, initialCustomProperties, initialFunnelStages } from "@/data/contacts";
import { Contact, CustomPropertyDefinition, FunnelStageDef } from "@/types/contacts";
import { toast } from "sonner";

interface ContactsLayoutProps {
  activeMainSection: "inbox" | "channels" | "metrics" | "contacts";
  onMainSectionChange: (s: "inbox" | "channels" | "metrics" | "contacts") => void;
}

export function ContactsLayout({ activeMainSection, onMainSectionChange }: ContactsLayoutProps) {
  const [contacts, setContacts] = React.useState<Contact[]>(mockContacts);
  const [customProperties, setCustomProperties] = React.useState<CustomPropertyDefinition[]>(initialCustomProperties);
  const [funnelStages, setFunnelStages] = React.useState<FunnelStageDef[]>(initialFunnelStages);
  
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterChannel, setFilterChannel] = React.useState<string>("all");
  const [filterStage, setFilterStage] = React.useState<string>("all");
  
  const [selectedContactIds, setSelectedContactIds] = React.useState<string[]>([]);
  const [activeContactId, setActiveContactId] = React.useState<string | null>(null);

  const activeContact = React.useMemo(() => contacts.find(c => c.id === activeContactId) || null, [contacts, activeContactId]);

  const filteredContacts = React.useMemo(() => {
    return contacts.filter(c => {
      if (filterChannel !== "all") {
        if (filterChannel === "wa_ig" && !(c.channels.includes("whatsapp") && c.channels.includes("instagram"))) return false;
        if (filterChannel === "whatsapp" && !c.channels.includes("whatsapp")) return false;
        if (filterChannel === "instagram" && !c.channels.includes("instagram")) return false;
      }
      if (filterStage !== "all" && c.funnelStage !== filterStage) {
        if (filterStage === "qualified" && c.funnelStage !== "Calificado") return false;
        if (filterStage === "unqualified" && c.funnelStage !== "No calificado") return false;
        if (filterStage === "enrolled" && c.funnelStage !== "Inscrito") return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && 
            !c.email?.toLowerCase().includes(q) &&
            !c.phone?.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [contacts, searchQuery, filterChannel, filterStage]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar 
        activeMainSection={activeMainSection} 
        onMainSectionChange={onMainSectionChange} 
      />
      
      <div className="flex-1 flex flex-col relative overflow-hidden bg-background">
        <ContactsHeader 
          onAddContact={(contact) => setContacts(prev => [contact, ...prev])}
          onImport={(imported) => {
             // For real import, handle logic here, or just simulate toast
          }}
        />
        
        <div className="px-6 py-4 flex-1 flex flex-col overflow-hidden">
          <ContactsToolbar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterChannel={filterChannel}
            setFilterChannel={setFilterChannel}
            filterStage={filterStage}
            setFilterStage={setFilterStage}
            totalContacts={contacts.length}
            filteredCount={filteredContacts.length}
            customProperties={customProperties}
            setCustomProperties={setCustomProperties}
            funnelStages={funnelStages}
            setFunnelStages={setFunnelStages}
          />
          
          <div className="flex-1 overflow-auto border rounded-lg bg-card shadow-sm mt-4 relative">
            <ContactsTable 
              contacts={filteredContacts}
              customProperties={customProperties}
              funnelStages={funnelStages}
              selectedIds={selectedContactIds}
              onSelectIds={setSelectedContactIds}
              onRowClick={setActiveContactId}
              onChangeStage={(id, stage) => {
                 setContacts(prev => prev.map(c => {
                   if (c.id === id) {
                     return {
                       ...c,
                       funnelStage: stage,
                       timelineEvents: [
                         {
                           id: `ev_${Date.now()}`,
                           type: "funnel_stage_updated",
                           title: "Etapa del funnel actualizada",
                           description: `Cambió a ${stage}.`,
                           createdAt: new Date().toISOString()
                         },
                         ...c.timelineEvents
                       ]
                     };
                   }
                   return c;
                 }));
                 toast.success(`Etapa del funnel actualizada a ${stage}`);
              }}
            />
          </div>
        </div>

        {selectedContactIds.length > 0 && (
          <BulkActionsBar 
            selectedCount={selectedContactIds.length}
            selectedContacts={contacts.filter(c => selectedContactIds.includes(c.id))}
            onClear={() => setSelectedContactIds([])}
            funnelStages={funnelStages}
          />
        )}

      </div>

      <ContactDetailsDrawer 
        contact={activeContact} 
        open={!!activeContactId} 
        onOpenChange={(open) => !open && setActiveContactId(null)}
        customProperties={customProperties}
        funnelStages={funnelStages}
        onUpdateContact={(updated) => {
          setContacts(prev => prev.map(c => c.id === updated.id ? updated : c));
        }}
        onDelete={() => {
          if (activeContactId) {
             setContacts(prev => prev.filter(c => c.id !== activeContactId));
             setSelectedContactIds(prev => prev.filter(id => id !== activeContactId));
             setActiveContactId(null);
          }
        }}
      />
    </div>
  );
}
