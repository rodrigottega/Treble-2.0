import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Contact, CustomPropertyDefinition, FunnelStageDef } from "@/types/contacts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/shared";
import { Button } from "@/components/ui/button";
import { ContactDetailsTab } from "./ContactDetailsTab";
import { ContactConversationsTab } from "./ContactConversationsTab";
import { ContactTimelineTab } from "./ContactTimelineTab";
import { ContactPropertiesTab } from "./ContactPropertiesTab";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface ContactDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
  customProperties: CustomPropertyDefinition[];
  funnelStages: FunnelStageDef[];
  onUpdateContact: (updated: Contact) => void;
  onDelete: () => void;
}

export function ContactDetailsDrawer({
  open,
  onOpenChange,
  contact,
  customProperties,
  funnelStages,
  onUpdateContact,
  onDelete
}: ContactDetailsDrawerProps) {
  
  if (!contact) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl p-0 flex flex-col h-full overflow-hidden border-l border-border bg-card">
        <div className="flex flex-col h-full overflow-hidden">
          
          <div className="flex-shrink-0 p-6 pb-4 border-b">
             <div className="flex justify-between items-start mb-4">
               <div className="flex items-center gap-4">
                 <Avatar fallback={contact.initials} className="h-14 w-14 text-lg bg-primary/10 text-primary" />
                 <div>
                   <SheetTitle className="text-xl">{contact.name}</SheetTitle>
                   <div className="flex items-center gap-2 mt-1">
                     <span className="text-sm text-muted-foreground">{contact.email || contact.phone || "Sin contacto"}</span>
                     <div className="flex gap-1 ml-2">
                        {contact.channels.includes("whatsapp") && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 w-5 h-5 p-0 flex items-center justify-center rounded-sm">
                            <i className="ri-whatsapp-line text-xs"></i>
                          </Badge>
                        )}
                        {contact.channels.includes("instagram") && (
                          <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200 w-5 h-5 p-0 flex items-center justify-center rounded-sm">
                            <i className="ri-instagram-line text-xs"></i>
                          </Badge>
                        )}
                     </div>
                   </div>
                 </div>
               </div>
               
               <div className="flex gap-2">
                 <Button variant="outline" size="icon" onClick={() => toast("Funcionalidad simulada: Abrir en Inbox")}>
                    <i className="ri-chat-3-line"></i>
                 </Button>
                 <Button variant="outline" size="icon" onClick={() => toast("Funcionalidad simulada: Enviar template individual")}>
                    <i className="ri-send-plane-fill"></i>
                 </Button>
                 <Button variant="outline" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={onDelete}>
                    <i className="ri-delete-bin-line"></i>
                 </Button>
               </div>
             </div>
          </div>

          <Tabs defaultValue="detalles" className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 border-b shrink-0">
              <TabsList className="bg-transparent h-12 p-0 w-full justify-start gap-6 border-b-0">
                <TabsTrigger value="detalles" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 h-12">Detalles</TabsTrigger>
                <TabsTrigger value="conversaciones" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 h-12">Conversaciones</TabsTrigger>
                <TabsTrigger value="timeline" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 h-12">Timeline</TabsTrigger>
                <TabsTrigger value="propiedades" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 h-12">Propiedades</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-muted/20">
              <TabsContent value="detalles" className="m-0 h-full focus-visible:outline-none">
                 <ContactDetailsTab contact={contact} funnelStages={funnelStages} onUpdateContact={onUpdateContact} />
              </TabsContent>
              <TabsContent value="conversaciones" className="m-0 h-full focus-visible:outline-none">
                 <ContactConversationsTab contact={contact} />
              </TabsContent>
              <TabsContent value="timeline" className="m-0 h-full focus-visible:outline-none">
                 <ContactTimelineTab contact={contact} />
              </TabsContent>
              <TabsContent value="propiedades" className="m-0 h-full focus-visible:outline-none">
                 <ContactPropertiesTab contact={contact} customProperties={customProperties} onUpdateContact={onUpdateContact} />
              </TabsContent>
            </div>
          </Tabs>

        </div>
      </SheetContent>
    </Sheet>
  );
}
