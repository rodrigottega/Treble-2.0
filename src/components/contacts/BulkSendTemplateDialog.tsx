import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Contact } from "@/types/contacts";
import { toast } from "sonner";
import { dummyTemplates } from "@/data/templates";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface BulkSendTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedContacts: Contact[];
  onComplete: () => void;
}

export function BulkSendTemplateDialog({ open, onOpenChange, selectedContacts, onComplete }: BulkSendTemplateDialogProps) {
  const [step, setStep] = React.useState(1);
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>("");
  
  const eligible = selectedContacts.filter(c => c.channels.includes("whatsapp") && c.phone);
  const nonEligible = selectedContacts.filter(c => !c.channels.includes("whatsapp") || !c.phone);

  const template = dummyTemplates.find(t => t.id === selectedTemplateId);

  React.useEffect(() => {
    if (open) {
      setStep(1);
      setSelectedTemplateId("");
    }
  }, [open]);

  const handleSend = () => {
    toast.success(`Template enviado a ${eligible.length} contactos correctamente.`);
    onOpenChange(false);
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Enviar template masivo (WhatsApp)</DialogTitle>
          <DialogDescription>
            Envía una plantilla HSM aprobada a varios contactos simultáneamente.
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 py-4">
             <div className="bg-muted/50 border rounded-lg p-4 space-y-3">
               <h4 className="font-medium text-sm">Resumen de destinatarios</h4>
               <div className="flex gap-4 items-center">
                 <div className="flex-1 bg-green-50 border border-green-200 p-3 rounded-md text-center">
                   <div className="text-2xl font-semibold text-green-700">{eligible.length}</div>
                   <div className="text-xs text-green-600 font-medium">Elegibles (Tienen WhatsApp)</div>
                 </div>
                 <div className="flex-1 bg-slate-50 border border-slate-200 p-3 rounded-md text-center">
                   <div className="text-2xl font-semibold text-slate-700">{nonEligible.length}</div>
                   <div className="text-xs text-slate-500 font-medium">Omitidos (Sin número)</div>
                 </div>
               </div>
               
               {nonEligible.length > 0 && (
                 <div className="text-xs text-amber-600 bg-amber-50 rounded p-2 flex gap-2">
                   <i className="ri-information-line"></i>
                   <span>Los contactos omitidos no recibirán este mensaje y se ignorarán en este envío.</span>
                 </div>
               )}
             </div>

             {eligible.length === 0 ? (
               <div className="text-center py-6 text-muted-foreground">
                 No hay ningún contacto seleccionable para enviar WhatsApp.
               </div>
             ) : (
                <div className="space-y-2 pt-2">
                  <Label>Selecciona la plantilla</Label>
                  <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Busca o selecciona un template" />
                    </SelectTrigger>
                    <SelectContent>
                      {dummyTemplates.map(tpl => (
                         <SelectItem key={tpl.id} value={tpl.id}>
                           <div className="flex items-center justify-between w-full pr-4">
                             <span>{tpl.name}</span>
                             <Badge variant="outline" className="text-[10px] ml-4">{tpl.category}</Badge>
                           </div>
                         </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {template && (
                     <div className="mt-4 p-3 bg-muted rounded-md text-sm whitespace-pre-wrap text-muted-foreground border">
                       {template.text}
                     </div>
                  )}
                </div>
             )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-4">
            <h4 className="font-medium text-sm">Validación de variables</h4>
            <div className="bg-amber-50 text-amber-800 text-xs p-3 rounded border border-amber-200">
               <i className="ri-error-warning-line mr-2"></i>
               Para propósitos de este prototipo, las variables se inyectarán automáticamente según el nombre y programa de interés del contacto.
            </div>

            <div className="border rounded-md p-4 bg-muted/30">
               <div className="space-y-3">
                 <div className="flex justify-between items-center text-sm border-b pb-2">
                   <span className="font-medium text-muted-foreground">Variable del template</span>
                   <span className="font-medium text-muted-foreground">Mapeo del contacto</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                   <span className="font-mono bg-muted px-1 rounded">{"{{nombre_paciente}}"}</span>
                   <span className="text-primary font-medium">Nombre (Propiedad base)</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                   <span className="font-mono bg-muted px-1 rounded">{"{{programa}}"}</span>
                   <span className="text-primary font-medium">Programa de interés</span>
                 </div>
               </div>
            </div>
            
            <p className="text-sm mt-4">¿Deseas proceder con el envío a los <strong>{eligible.length}</strong> contactos elegibles?</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          {step === 1 ? (
             <Button onClick={() => setStep(2)} disabled={!selectedTemplateId || eligible.length === 0}>
               Configurar variables <i className="ri-arrow-right-line ml-2"></i>
             </Button>
          ) : (
             <Button onClick={handleSend} className="bg-green-600 hover:bg-green-700 text-white">
               <i className="ri-send-plane-fill mr-2"></i> Enviar a {eligible.length} contactos
             </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
