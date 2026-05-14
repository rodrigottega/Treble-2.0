import * as React from "react";
import { Button } from "@/components/ui/button";
import { Contact, FunnelStageDef } from "@/types/contacts";
import { BulkSendTemplateDialog } from "./BulkSendTemplateDialog";
import { ExportContactsDialog } from "./ExportContactsDialog";
import { toast } from "sonner";

interface BulkActionsBarProps {
  selectedCount: number;
  selectedContacts: Contact[];
  onClear: () => void;
  funnelStages?: FunnelStageDef[];
}

export function BulkActionsBar({ selectedCount, selectedContacts, onClear, funnelStages }: BulkActionsBarProps) {
  const [isBulkSendOpen, setIsBulkSendOpen] = React.useState(false);
  const [isExportOpen, setIsExportOpen] = React.useState(false);

  return (
    <>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-5 fade-in z-20">
        <div className="bg-slate-800 text-slate-300 font-medium text-sm rounded-md px-2 py-1">
          {selectedCount} seleccionados
        </div>
        
        <div className="flex items-center gap-2 border-r border-slate-700 pr-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-300 hover:text-white hover:bg-slate-800 h-8"
            onClick={() => setIsBulkSendOpen(true)}
          >
            <i className="ri-whatsapp-line mr-2 text-green-400"></i> HSM Masivo
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-300 hover:text-white hover:bg-slate-800 h-8"
            onClick={() => {
              toast("Funcionalidad simulada: Etiquetar masivamente");
            }}
          >
             <i className="ri-price-tag-3-line mr-2"></i> Etiquetar
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-300 hover:text-white hover:bg-slate-800 h-8"
            onClick={() => setIsExportOpen(true)}
          >
             <i className="ri-download-2-line mr-2"></i> Exportar
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-slate-400 hover:text-white hover:bg-slate-800 h-8 px-2"
          onClick={onClear}
        >
          Limpiar
        </Button>
      </div>

      <BulkSendTemplateDialog 
        open={isBulkSendOpen}
        onOpenChange={setIsBulkSendOpen}
        selectedContacts={selectedContacts}
        onComplete={() => onClear()}
      />

      <ExportContactsDialog 
        open={isExportOpen} 
        onOpenChange={setIsExportOpen} 
        mode="selected" 
      />
    </>
  );
}
