import * as React from "react";
import { Contact, FunnelStage, FunnelStageDef } from "@/types/contacts";
import { FunnelStageSelect } from "./FunnelStageSelect";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ContactDetailsTabProps {
  contact: Contact;
  funnelStages: FunnelStageDef[];
  onUpdateContact: (updated: Contact) => void;
}

export function ContactDetailsTab({ contact, funnelStages, onUpdateContact }: ContactDetailsTabProps) {
  
  const handleStageChange = (newStage: string) => {
    onUpdateContact({
      ...contact,
      funnelStage: newStage as FunnelStage,
      timelineEvents: [
        {
          id: `ev_${Date.now()}`,
          type: "funnel_stage_updated",
          title: "Etapa del funnel actualizada",
          description: `Cambió de ${contact.funnelStage} a ${newStage}.`,
          createdAt: new Date().toISOString()
        },
        ...contact.timelineEvents
      ]
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border rounded-lg p-5 shadow-sm space-y-4">
        <h4 className="font-semibold text-sm">Información principal</h4>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
          <div>
            <div className="text-muted-foreground text-xs mb-1">Teléfono</div>
            <div className="font-medium">{contact.phone || "-"}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs mb-1">Correo electrónico</div>
            <div className="font-medium truncate">{contact.email || "-"}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs mb-1">Etapa del funnel</div>
            <div className="mt-1">
               <FunnelStageSelect value={contact.funnelStage} funnelStages={funnelStages} onChange={handleStageChange} />
            </div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs mb-1">Responsable</div>
            <div className="font-medium">{contact.owner || "Sin asignar"}</div>
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-5 shadow-sm space-y-4">
        <h4 className="font-semibold text-sm">Contexto del prospecto</h4>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
          <div>
            <div className="text-muted-foreground text-xs mb-1">Intención</div>
            <Badge variant={contact.intent === "Alta" ? "default" : contact.intent === "Media" ? "secondary" : "outline"} className="text-[10px] mt-1">
                 {contact.intent}
            </Badge>
          </div>
          <div>
            <div className="text-muted-foreground text-xs mb-1">Ciudad</div>
            <div className="font-medium">{contact.city || "-"}</div>
          </div>
          <div className="col-span-2">
            <div className="text-muted-foreground text-xs mb-1">Programa de interés</div>
            <div className="font-medium">{contact.programOfInterest || "-"}</div>
          </div>
          <div className="col-span-2">
            <div className="text-muted-foreground text-xs mb-1">Etiquetas (Tags)</div>
            <div className="flex gap-1 mt-1 flex-wrap">
               {contact.tags.length > 0 ? contact.tags.map((t, i) => (
                 <Badge key={i} variant="secondary" className="font-normal text-xs">{t}</Badge>
               )) : <span className="text-muted-foreground text-xs">Sin etiquetas</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-5 shadow-sm space-y-4">
        <h4 className="font-semibold text-sm">Actividad</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
          <div>
            <div className="text-muted-foreground text-xs mb-1">Miembro desde</div>
            <div className="font-medium">
               {format(new Date(contact.createdAt), "d MMM yyyy", { locale: es })}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs mb-1">Última actividad</div>
            <div className="font-medium">
               {format(new Date(contact.lastActivityAt), "d MMM yyyy, HH:mm", { locale: es })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
