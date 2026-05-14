import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { mockPlans } from "../../data/settings";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Card, CardContent } from "../ui/card";

interface ChangePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlanId: string;
  onPlanSelected: (id: string) => void;
}

export function ChangePlanDialog({ open, onOpenChange, currentPlanId, onPlanSelected }: ChangePlanDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cambiar plan</DialogTitle>
          <DialogDescription>
            Compara planes y selecciona el que mejor se ajuste a tu volumen de mensajes.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {mockPlans.map(plan => {
            const isCurrent = plan.id === currentPlanId;
            return (
              <Card key={plan.id} className={`flex flex-col ${isCurrent ? 'border-primary shadow-md' : ''}`}>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl">{plan.name}</h3>
                    {isCurrent && (
                      <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                        Plan actual
                      </span>
                    )}
                  </div>
                  <div className="mb-6">
                    <span className="text-3xl font-black">{plan.price}</span>
                  </div>
                  
                  <div className="space-y-4 text-sm flex-1 mb-8">
                    <div className="flex items-start gap-2">
                      <i className="ri-message-3-line text-muted-foreground mt-0.5"></i>
                      <span><strong>{plan.outboundLimit.toLocaleString()}</strong> mensajes outbound / mes</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <i className="ri-team-line text-muted-foreground mt-0.5"></i>
                      <span><strong>{plan.includedAgents === 'unlimited' ? 'Ilimitados' : plan.includedAgents}</strong> agentes incluidos</span>
                    </div>
                    
                    <div className="pt-4 mt-4 border-t space-y-2">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <i className="ri-check-line text-green-500 mt-0.5"></i>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full mt-auto" 
                    variant={isCurrent ? "secondary" : "default"}
                    disabled={isCurrent}
                    onClick={() => {
                      toast.success("Plan actualizado (Simulado)");
                      onPlanSelected(plan.id);
                      onOpenChange(false);
                    }}
                  >
                    {isCurrent ? "Plan actual" : "Seleccionar plan"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

      </DialogContent>
    </Dialog>
  );
}
