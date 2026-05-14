import * as React from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../ui/card";
import { dummyCurrentPlan, dummyUsageBreakdown, initialLimitBehavior, initialAlertSettings, dummyUsageHistory, mockPlans } from "../../data/settings";
import { Progress } from "../ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { toast } from "sonner";
import { UsageHistoryDialog } from "./UsageHistoryDialog";
import { ChangePlanDialog } from "./ChangePlanDialog";
import { CurrentPlan, LimitBehaviorMode } from "../../types/settings";

export function PricingPlansPage() {
  const [currentPlan, setCurrentPlan] = React.useState(dummyCurrentPlan);
  const usageBreakdown = dummyUsageBreakdown;
  const outboundUsed = currentPlan.outboundUsed;
  const outboundLimit = currentPlan.outboundLimit;
  const percentUsed = Math.min(100, Math.round((outboundUsed / outboundLimit) * 100));
  const remaining = outboundLimit - outboundUsed;
  
  const [limitBehavior, setLimitBehavior] = React.useState(initialLimitBehavior);
  const [alertsEnabled, setAlertsEnabled] = React.useState(initialAlertSettings.enabled);
  const [primaryNumber, setPrimaryNumber] = React.useState(initialAlertSettings.primaryNumber);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [verificationCode, setVerificationCode] = React.useState("");

  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [changePlanOpen, setChangePlanOpen] = React.useState(false);

  // Health color logic
  let progressColor = "bg-green-500";
  let statusText = "Uso dentro del límite.";
  if (percentUsed >= 90) { progressColor = "bg-red-500"; statusText = "Estás cerca del límite mensual."; }
  else if (percentUsed >= 70) { progressColor = "bg-amber-500"; }
  
  if (percentUsed >= 100) {
    if (limitBehavior.mode === "continue_with_overage") {
      statusText = "Los mensajes siguen enviándose como consumo adicional.";
    } else if (limitBehavior.mode === "stop_sending") {
      statusText = "Los envíos outbound están pausados hasta el siguiente ciclo.";
    } else {
      statusText = "Los nuevos envíos requieren aprobación.";
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto w-full space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pricing / Planes</h1>
          <p className="text-muted-foreground mt-1">
            Consulta tu plan actual, el uso de mensajes outbound y define cómo actuar cuando alcances tus límites.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setHistoryOpen(true)}>
            <i className="ri-history-line mr-2"></i>
            Ver historial de uso
          </Button>
          <Button onClick={() => setChangePlanOpen(true)}>Cambiar plan</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CURRENT PLAN */}
        <Card className="md:col-span-1 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Plan actual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{currentPlan.name}</span>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium border border-green-200">Activo</span>
            </div>
            
            <div className="space-y-3 mt-4 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Ciclo:</span>
                <span className="font-medium">Mensual</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Renovación:</span>
                <span className="font-medium">Renueva el 1 de junio de 2026</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Canales incluidos:</span>
                <span className="font-medium">{currentPlan.channels.join(", ")}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Usuarios:</span>
                <span className="font-medium">{currentPlan.includedAgents} agentes incluidos</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button variant="outline" className="w-full" onClick={() => setChangePlanOpen(true)}>Cambiar plan</Button>
          </CardFooter>
        </Card>

        {/* OUTBOUND USAGE */}
        <Card className="md:col-span-2 shadow-sm">
          <CardHeader className="pb-4 flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-lg">Uso de mensajes outbound</CardTitle>
              <CardDescription className="mt-1">
                Este límite considera únicamente mensajes enviados desde la plataforma. <br />Los mensajes entrantes no consumen este límite.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 p-4 rounded-xl mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 w-full space-y-2">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <span className="text-3xl font-bold">{outboundUsed.toLocaleString()}</span>
                    <span className="text-muted-foreground ml-2">usados</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium bg-secondary px-2 py-1 rounded-md">{percentUsed}% usado</span>
                  </div>
                </div>
                
                <Progress value={percentUsed} className="h-3" defaultColor={progressColor} />
                
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-muted-foreground">Límite: {outboundLimit.toLocaleString()}</span>
                  <span className="font-medium text-[var(--theme-primary)]">{remaining.toLocaleString()} restantes</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              <div className="space-y-3">
                <h4 className="font-medium text-muted-foreground mb-3 uppercase tracking-wider text-xs">Desglose por canal</h4>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <i className="ri-whatsapp-line text-green-500 text-lg"></i>
                    <span>WhatsApp</span>
                  </div>
                  <span className="font-medium">{usageBreakdown.whatsapp.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <i className="ri-instagram-line text-pink-500 text-lg"></i>
                    <span>Instagram</span>
                  </div>
                  <span className="font-medium">{usageBreakdown.instagram.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-muted-foreground mb-3 uppercase tracking-wider text-xs">Desglose por tipo</h4>
                <div className="flex justify-between items-center">
                  <span>Mensajes manuales</span>
                  <span className="font-medium">{usageBreakdown.manualMessages.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Templates HSM</span>
                  <span className="font-medium">{usageBreakdown.hsmTemplates.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Mensajes automatizados/IA</span>
                  <span className="font-medium">{usageBreakdown.aiAutomated.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t flex items-start gap-3 text-sm text-muted-foreground">
              <i className="ri-information-line text-lg mt-0.5"></i>
              <p>
                <strong>¿Qué cuenta como outbound?</strong> Cuentan los mensajes enviados desde Ciarem hacia un contacto, incluyendo respuestas manuales, templates HSM, mensajes automatizados e IA.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LIMIT BEHAVIOR */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Cuando se alcance el límite</CardTitle>
            <CardDescription>
              Define cómo debe comportarse la plataforma si el workspace llega al límite de mensajes outbound del plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup 
              value={limitBehavior.mode} 
              onValueChange={(val: LimitBehaviorMode) => setLimitBehavior(prev => ({...prev, mode: val}))}
            >
              <div className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${limitBehavior.mode === 'continue_with_overage' ? 'border-primary bg-primary/5' : 'border-border hover:border-border/80'}`} onClick={() => setLimitBehavior(prev => ({...prev, mode: "continue_with_overage"}))}>
                <div className="flex items-start gap-3">
                  <RadioGroupItem value="continue_with_overage" id="mode_continue" className="mt-1" />
                  <div>
                    <Label htmlFor="mode_continue" className="font-semibold text-base cursor-pointer">Continuar enviando con consumo adicional</Label>
                    <p className="text-sm text-muted-foreground mt-1">Los mensajes seguirán enviándose y se registrarán como consumo adicional.</p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${limitBehavior.mode === 'stop_sending' ? 'border-primary bg-primary/5' : 'border-border hover:border-border/80'}`} onClick={() => setLimitBehavior(prev => ({...prev, mode: "stop_sending"}))}>
                <div className="flex items-start gap-3">
                  <RadioGroupItem value="stop_sending" id="mode_stop" className="mt-1" />
                  <div>
                    <Label htmlFor="mode_stop" className="font-semibold text-base cursor-pointer">Detener envíos outbound</Label>
                    <p className="text-sm text-muted-foreground mt-1">Se bloquearán nuevos mensajes outbound hasta que el ciclo se reinicie o se aumente el límite.</p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${limitBehavior.mode === 'require_admin_approval' ? 'border-primary bg-primary/5' : 'border-border hover:border-border/80'}`} onClick={() => setLimitBehavior(prev => ({...prev, mode: "require_admin_approval"}))}>
                <div className="flex items-start gap-3">
                  <RadioGroupItem value="require_admin_approval" id="mode_approval" className="mt-1" />
                  <div>
                    <Label htmlFor="mode_approval" className="font-semibold text-base cursor-pointer">Requerir aprobación de admin</Label>
                    <p className="text-sm text-muted-foreground mt-1">Los mensajes quedarán pendientes hasta que un admin apruebe continuar con consumo adicional.</p>
                  </div>
                </div>
              </div>
            </RadioGroup>

            <div className="bg-slate-50 p-4 rounded-lg text-sm">
              {limitBehavior.mode === "continue_with_overage" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">Costo estimado:</span>
                    <span className="font-medium">$0.012 USD / mensaje</span>
                  </div>
                  <div className="space-y-2">
                    <Label>Límite máximo de mensajes adicionales</Label>
                    <Input type="number" defaultValue="2000" />
                  </div>
                </div>
              )}
              {limitBehavior.mode === "stop_sending" && (
                <div className="flex items-start gap-2 text-amber-700">
                  <i className="ri-error-warning-line text-lg"></i>
                  <p>Cuando se alcance el límite, los agentes no podrán enviar nuevos mensajes outbound. Los mensajes entrantes seguirán llegando.</p>
                </div>
              )}
              {limitBehavior.mode === "require_admin_approval" && (
                <div className="space-y-2">
                  <Label>Admin responsable</Label>
                  <Select defaultValue="lucia">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un admin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lucia">Lucía Herrera</SelectItem>
                      <SelectItem value="carlos">Carlos Méndez</SelectItem>
                      <SelectItem value="sofia">Sofía Duarte</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">Los envíos quedarán pendientes hasta que este admin apruebe continuar.</p>
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              Esta configuración aplica a Inbox, Contacts, envíos masivos y mensajes enviados por IA.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => toast.success("Comportamiento de límite actualizado")}>Guardar comportamiento</Button>
          </CardFooter>
        </Card>

        {/* ALERTS */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Alertas por WhatsApp</CardTitle>
              <CardDescription>
                Recibe notificaciones sobre límites de mensajería en un número de WhatsApp.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <Label htmlFor="enable-alerts" className="font-medium">Enviar alertas por WhatsApp</Label>
                <Switch 
                  id="enable-alerts" 
                  checked={alertsEnabled} 
                  onCheckedChange={setAlertsEnabled}
                />
              </div>

              {alertsEnabled && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>Número de WhatsApp para alertas</Label>
                    <Input 
                      placeholder="+52 55 1234 5678" 
                      value={primaryNumber} 
                      onChange={(e) => setPrimaryNumber(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nombre del destinatario (opcional)</Label>
                    <Input placeholder="Ej. Admin principal" defaultValue={initialAlertSettings.recipientName} />
                  </div>

                  {!isVerifying ? (
                    <Button variant="secondary" className="w-full" onClick={() => {
                      setIsVerifying(true);
                      toast("Código de prueba enviado");
                    }}>
                      <i className="ri-send-plane-line mr-2"></i>
                      Enviar código de prueba
                    </Button>
                  ) : (
                    <div className="space-y-3 bg-slate-50 p-3 rounded-lg border">
                      <Label>Código de verificación (simulado)</Label>
                      <Input 
                        placeholder="123456" 
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button className="flex-1" onClick={() => {
                          setIsVerifying(false);
                          setVerificationCode("");
                          toast.success("Número verificado correctamente");
                        }}>
                          Verificar número
                        </Button>
                        <Button variant="ghost" onClick={() => setIsVerifying(false)}>Cancelar</Button>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t space-y-4">
                    <h4 className="font-medium text-sm">Cuándo recibir alertas</h4>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-normal">Cuando se alcance el 90% del límite</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-normal">Cuando se alcance el 100% del límite</Label>
                      <Switch defaultChecked />
                    </div>
                    {limitBehavior.mode === "continue_with_overage" && (
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-normal">Cuando inicie el consumo adicional</Label>
                        <Switch defaultChecked />
                      </div>
                    )}
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-normal">Cuando queden X mensajes disponibles</Label>
                        <Switch defaultChecked />
                      </div>
                      <Input type="number" defaultValue="1000" className="w-32 self-end h-8" />
                    </div>
                  </div>

                  <div className="pt-4 border-t space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">Destinatarios adicionales</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">Puedes agregar hasta 3 números extra para recibir estas alertas.</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => toast("Funcionalidad para agregar destinatario simulada")}>
                        <i className="ri-user-add-line mr-2"></i> Agregar
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border rounded-lg p-3 bg-white">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">Carlos Méndez</span>
                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">Verificado</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">+52 55 9876 5432</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="h-8 shadow-none" onClick={() => toast("Prueba enviada a Carlos")}>
                            <i className="ri-send-plane-line text-muted-foreground"></i>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 shadow-none text-red-500 hover:text-red-700" onClick={() => toast("Destinatario eliminado")}>
                            <i className="ri-delete-bin-line"></i>
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border rounded-lg p-3 bg-white">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">Sofía Duarte</span>
                            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">Pendiente</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">+57 300 123 4567</p>
                        </div>
                        <div className="flex gap-2">
                           <Button variant="ghost" size="sm" className="h-8 shadow-none" onClick={() => toast("Código reenviado a Sofía")}>
                            <i className="ri-refresh-line text-muted-foreground"></i>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 shadow-none text-red-500 hover:text-red-700" onClick={() => toast("Destinatario eliminado")}>
                            <i className="ri-delete-bin-line"></i>
                          </Button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={() => toast.success("Alertas actualizadas")}>Guardar alertas</Button>
            </CardFooter>
          </Card>

          {/* PREVIEW */}
          {alertsEnabled && (
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Preview de alerta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-[#EFEAE2] p-4 rounded-lg font-sans">
                  <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm inline-block max-w-[90%] text-[15px] leading-snug">
                    <p className="mb-1">⚠️ <strong>Ciarem alertas:</strong></p>
                    <p>Tu workspace ha usado el <strong>90%</strong> de sus mensajes outbound este mes.</p>
                    <p className="mt-2 text-muted-foreground text-sm">Te quedan 1,000 mensajes hasta el 1 de junio.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
      
      <UsageHistoryDialog open={historyOpen} onOpenChange={setHistoryOpen} />
      <ChangePlanDialog open={changePlanOpen} onOpenChange={setChangePlanOpen} currentPlanId={currentPlan.id} onPlanSelected={(id) => {
        const plan = mockPlans.find(p => p.id === id);
        if (plan) {
          setCurrentPlan(prev => ({
            ...prev,
            id: plan.id,
            name: plan.name,
            outboundLimit: plan.outboundLimit,
            includedAgents: plan.includedAgents as number // Simplification for mock
          }));
        }
      }} />

    </div>
  );
}
