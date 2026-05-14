import * as React from "react";
import { Contact } from "@/types/contacts";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ContactTimelineTabProps {
  contact: Contact;
}

export function ContactTimelineTab({ contact }: ContactTimelineTabProps) {
  if (!contact.timelineEvents || contact.timelineEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-full">
        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
          <i className="ri-history-line text-2xl text-muted-foreground"></i>
        </div>
        <h3 className="text-base font-medium text-foreground mb-1">Aún no hay actividad registrada</h3>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch(type) {
      case "contact_created": return <i className="ri-user-add-line text-blue-500"></i>;
      case "message_received": return <i className="ri-message-3-line text-green-500"></i>;
      case "template_sent": return <i className="ri-send-plane-fill text-green-600"></i>;
      case "funnel_stage_updated": return <i className="ri-filter-3-line text-indigo-500"></i>;
      case "property_updated": return <i className="ri-edit-2-line text-amber-500"></i>;
      default: return <i className="ri-record-circle-line text-slate-400"></i>;
    }
  };

  return (
    <div className="relative border-l-2 border-border ml-4 space-y-6 pb-6">
      {contact.timelineEvents.map((evt, idx) => (
         <div key={evt.id} className="relative pl-6">
            <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-card border-2 border-border flex items-center justify-center text-sm shadow-sm">
              {getIcon(evt.type)}
            </div>
            
            <div className="bg-card border rounded-lg p-4 shadow-sm">
               <div className="flex justify-between items-start mb-2">
                 <h5 className="font-semibold text-sm">{evt.title}</h5>
                 <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                   {format(new Date(evt.createdAt), "d MMM, HH:mm", { locale: es })}
                 </span>
               </div>
               <p className="text-sm text-muted-foreground">{evt.description}</p>
            </div>
         </div>
      ))}
    </div>
  );
}
