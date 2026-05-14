import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomPropertyDefinition, FunnelStageDef } from "@/types/contacts";
import { ManageColumnsDialog } from "./ManageColumnsDialog";
import { ManagePropertiesDialog } from "./ManagePropertiesDialog";
import { ManageFunnelStagesDialog } from "./ManageFunnelStagesDialog";

interface ContactsToolbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterChannel: string;
  setFilterChannel: (f: string) => void;
  filterStage: string;
  setFilterStage: (f: string) => void;
  totalContacts: number;
  filteredCount: number;
  customProperties: CustomPropertyDefinition[];
  setCustomProperties: React.Dispatch<React.SetStateAction<CustomPropertyDefinition[]>>;
  funnelStages: FunnelStageDef[];
  setFunnelStages: React.Dispatch<React.SetStateAction<FunnelStageDef[]>>;
}

export function ContactsToolbar({
  searchQuery,
  setSearchQuery,
  filterChannel,
  setFilterChannel,
  filterStage,
  setFilterStage,
  totalContacts,
  filteredCount,
  customProperties,
  setCustomProperties,
  funnelStages,
  setFunnelStages
}: ContactsToolbarProps) {
  const [isColumnsOpen, setIsColumnsOpen] = React.useState(false);
  const [isPropertiesOpen, setIsPropertiesOpen] = React.useState(false);
  const [isStagesOpen, setIsStagesOpen] = React.useState(false);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1">
        <div className="relative w-72">
          <i className="ri-search-line absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"></i>
          <Input 
            placeholder="Buscar contactos..." 
            className="pl-8 h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={filterChannel} onValueChange={setFilterChannel}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="Canal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los canales</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="wa_ig">WhatsApp e Instagram</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStage} onValueChange={setFilterStage}>
          <SelectTrigger className="w-[150px] h-9">
            <SelectValue placeholder="Filtro rápido" />
          </SelectTrigger>
          <SelectContent>
             <SelectItem value="all">Todas las etapas</SelectItem>
             <SelectItem value="qualified">Calificados</SelectItem>
             <SelectItem value="unqualified">Sin calificar</SelectItem>
             <SelectItem value="enrolled">Inscritos</SelectItem>
          </SelectContent>
        </Select>

        {(searchQuery || filterChannel !== 'all' || filterStage !== 'all') && (
          <Button variant="ghost" size="sm" onClick={() => {
            setSearchQuery("");
            setFilterChannel("all");
            setFilterStage("all");
          }} className="h-9 px-2 text-muted-foreground hover:text-foreground">
            Limpiar filtros
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground mr-2">
          {filteredCount !== totalContacts 
            ? `${filteredCount} contactos filtrados`
            : `${totalContacts} contactos`}
        </span>

        <Button variant="outline" size="sm" onClick={() => setIsStagesOpen(true)} className="h-9">
          <i className="ri-workflow-line mr-2"></i>
          Etapas del funnel
        </Button>

        <Button variant="outline" size="sm" onClick={() => setIsPropertiesOpen(true)} className="h-9">
          <i className="ri-settings-2-line mr-2"></i>
          Propiedades
        </Button>

        <Button variant="outline" size="sm" onClick={() => setIsColumnsOpen(true)} className="h-9">
          <i className="ri-layout-column-line mr-2"></i>
          Columnas
        </Button>
      </div>

      <ManageColumnsDialog 
        open={isColumnsOpen} 
        onOpenChange={setIsColumnsOpen} 
        customProperties={customProperties} 
        setCustomProperties={setCustomProperties} 
      />
      
      <ManagePropertiesDialog 
        open={isPropertiesOpen} 
        onOpenChange={setIsPropertiesOpen} 
        customProperties={customProperties} 
        setCustomProperties={setCustomProperties} 
      />
      
      <ManageFunnelStagesDialog 
        open={isStagesOpen} 
        onOpenChange={setIsStagesOpen} 
        funnelStages={funnelStages} 
        setFunnelStages={setFunnelStages} 
      />
    </div>
  );
}
