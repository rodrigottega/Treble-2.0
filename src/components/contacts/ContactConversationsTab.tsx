import * as React from "react";
import { Contact } from "@/types/contacts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

interface ContactConversationsTabProps {
  contact: Contact;
}

export function ContactConversationsTab({ contact }: ContactConversationsTabProps) {
  
  if (!contact.conversations || contact.conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-full">
        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
          <i className="ri-chat-history-line text-2xl text-muted-foreground"></i>
        </div>
        <h3 className="text-base font-medium text-foreground mb-1">Este contacto no tiene conversaciones</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">Cuando interactúe por WhatsApp o Instagram, aparecerán aquí.</p>
        <Button variant="outline" size="sm" onClick={() => toast("Funcionalidad simulada")}>
          <i className="ri-send-plane-fill mr-2"></i> Enviar HSM
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
       {contact.conversations.map(conv => (
         <div key={conv.id} className="bg-card border rounded-lg p-5 shadow-sm">
            <div className="flex justify-between items-start mb-3">
               <div className="flex gap-2 items-center">
                  {conv.channel === "whatsapp" ? (
                    <div className="w-8 h-8 rounded bg-green-50 text-green-600 flex items-center justify-center">
                      <i className="ri-whatsapp-line text-lg"></i>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded bg-pink-50 text-pink-600 flex items-center justify-center">
                      <i className="ri-instagram-line text-lg"></i>
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-sm flex gap-2 items-center">
                      {conv.channel === "whatsapp" ? "WhatsApp" : "Instagram"}
                      <Badge variant="outline" className={`text-[10px] uppercase font-semibold tracking-wider ${
                        conv.status === 'open' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        conv.status === 'resolved' ? 'bg-green-50 text-green-700 border-green-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {conv.status === 'open' ? 'Abierta' : conv.status === 'resolved' ? 'Resuelta' : conv.status === 'expired' ? 'Expirada WA' : 'Cerrada'}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {format(new Date(conv.startedAt), "d MMM, HH:mm", { locale: es })}
                      {conv.endedAt && ` - ${format(new Date(conv.endedAt), "d MMM, HH:mm", { locale: es })}`}
                    </div>
                  </div>
               </div>
               <Button variant="outline" size="sm" className="h-8" onClick={() => toast("Abre esta conversación en Inbox para responder o leer todo el historial.")}>
                  Ver detalle
               </Button>
            </div>
            
            <div className="bg-muted/30 rounded p-3 text-sm text-muted-foreground mt-4">
              <span className="font-medium text-foreground text-xs uppercase tracking-wider mb-1 block">Resumen</span>
              {conv.summary}
            </div>

            <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
               <div className="flex items-center gap-1">
                 <i className="ri-user-star-line"></i>
                 <span>Atendida por: <span className="font-medium text-foreground">{conv.owner || "Bot"}</span></span>
               </div>
               <div className="flex items-center gap-1">
                 <i className="ri-message-3-line"></i>
                 <span>{conv.messages?.length || 0} mensajes</span>
               </div>
            </div>
         </div>
       ))}
    </div>
  );
}
