import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/shared";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function OrchestratorPlayground() {
  const [messages, setMessages] = React.useState<{role: "user"|"ai", text: string, mockData?: any}[]>([]);
  const [input, setInput] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  
  const [channel, setChannel] = React.useState("whatsapp");
  const [stage, setStage] = React.useState("Nuevo lead");
  const [context, setContext] = React.useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsGenerating(true);

    setTimeout(() => {
      // Logic for dummy responses
      let textResponse = "Claro, aquí tienes la información.";
      let mockData: any = {
        agent: "SDR / Ventas",
        action: "Responder y sugerir curso",
        transferReason: null
      };

      if (userMsg.toLowerCase().includes("humano") || userMsg.toLowerCase().includes("persona")) {
        textResponse = "Voy a transferirte con una persona de nuestro equipo para que te ayude mejor.";
        mockData = {
          agent: "Orquestador",
          action: "Transferir a humano",
          transferReason: "Solicitud explícita de humano"
        };
      } else if (userMsg.toLowerCase().includes("plan") || userMsg.toLowerCase().includes("programa") || userMsg.toLowerCase().includes("pdf")) {
        textResponse = "Te comparto el programa del Diplomado UX/UI para que puedas revisar módulos y duración.";
        mockData = {
          agent: "SDR / Ventas",
          action: "Responder y sugerir PDF",
          asset: "Programa_Diplomado_UXUI.pdf",
          kb: "Programas académicos"
        };
      }

      setMessages(prev => [...prev, { role: "ai", text: textResponse, mockData }]);
      setIsGenerating(false);
    }, 1500);
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div id="orchestrator-playground" className="bg-card border rounded-xl shadow-sm overflow-hidden mb-8">
      <div className="p-5 border-b bg-muted/20 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">Playground <Badge className="ml-2 font-normal">Test mode</Badge></h2>
          <p className="text-sm text-muted-foreground mt-0.5">Prueba cómo respondería el agente ante distintos escenarios.</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleClear} disabled={messages.length === 0}>
          Limpiar prueba
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row h-[600px] divide-y lg:divide-y-0 lg:divide-x">
        {/* Left Panel - Context Setting */}
        <div className="w-full lg:w-[300px] p-5 flex flex-col gap-5 bg-muted/10 overflow-y-auto">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">Escenario Simulado</Label>
          </div>

          <div className="space-y-2">
            <Label>Canal</Label>
            <Select value={channel} onValueChange={setChannel}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Etapa del contacto</Label>
            <Select value={stage} onValueChange={setStage}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="Nuevo lead">Nuevo lead</SelectItem>
                <SelectItem value="Contactado">Contactado</SelectItem>
                <SelectItem value="Inscrito">Inscrito</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Contexto previo (opcional)</Label>
            <textarea 
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder="Ej. El contacto ya preguntó por precios anteriormente."
            />
          </div>
        </div>

        {/* Right Panel - Chat */}
        <div className="flex-1 flex flex-col bg-background/50 relative">
           
           <div className="flex-1 p-6 overflow-y-auto space-y-6">
             {messages.length === 0 ? (
               <div className="h-full flex items-center justify-center text-center">
                 <div className="max-w-[300px]">
                   <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                     <i className="ri-flask-line text-2xl"></i>
                   </div>
                   <h3 className="text-lg font-medium">Inicia una prueba</h3>
                   <p className="text-sm text-muted-foreground mt-2">Envía un mensaje para ver qué agente toma el caso, qué respuesta genera y qué decisión toma.</p>
                 </div>
               </div>
             ) : (
               messages.map((msg, i) => (
                 <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                   <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                     {msg.role === 'ai' && (
                       <Avatar fallback="AI" className="h-8 w-8 bg-primary/10 text-primary mt-1 shrink-0" />
                     )}
                     
                     <div className="flex flex-col gap-2">
                       <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                         msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-card border rounded-tl-sm'
                       }`}>
                         {msg.text}
                       </div>

                       {msg.mockData && (
                         <div className="bg-muted border rounded-lg p-3 text-[11px] w-full mt-1">
                           <div className="font-semibold text-xs mb-2 border-b border-border/50 pb-1 flex items-center gap-1.5"><i className="ri-stethoscope-line text-primary"></i> Análisis de decisión</div>
                           <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                             <div className="text-muted-foreground">Agente asignado:</div>
                             <div className="font-medium text-foreground">{msg.mockData.agent}</div>
                             
                             <div className="text-muted-foreground">Acción:</div>
                             <div className="font-medium text-foreground">{msg.mockData.action}</div>
                             
                             {msg.mockData.asset && (
                               <>
                                 <div className="text-muted-foreground">Recurso sugerido:</div>
                                 <div className="font-medium text-blue-600 flex items-center gap-1"><i className="ri-file-pdf-2-line"></i> {msg.mockData.asset}</div>
                               </>
                             )}
                             
                             {msg.mockData.kb && (
                               <>
                                 <div className="text-muted-foreground">Conocimiento consultado:</div>
                                 <div className="font-medium text-amber-600 flex items-center gap-1"><i className="ri-book-3-line"></i> {msg.mockData.kb}</div>
                               </>
                             )}

                             {msg.mockData.transferReason && (
                               <>
                                 <div className="text-muted-foreground">Razón transferencia:</div>
                                 <div className="font-medium text-destructive">{msg.mockData.transferReason}</div>
                               </>
                             )}
                           </div>
                         </div>
                       )}
                     </div>
                   </div>
                 </div>
               ))
             )}
             
             {isGenerating && (
                <div className="flex items-start gap-3 w-max">
                  <Avatar fallback="AI" className="h-8 w-8 bg-primary/10 text-primary mt-1 shrink-0" />
                  <div className="p-3 bg-card border rounded-2xl rounded-tl-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-primary/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
             )}
           </div>

           <div className="p-4 border-t bg-background">
             <div className="relative">
               <Input 
                 placeholder="Escribe un mensaje de prueba..." 
                 className="pr-12 h-12 shadow-sm rounded-xl"
                 value={input}
                 onChange={e => setInput(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && handleSend()}
                 autoComplete="off"
               />
               <Button 
                 size="icon" 
                 className="absolute right-1 top-1 h-10 w-10 shrink-0 bg-primary/10 text-primary hover:bg-primary/20" 
                 onClick={handleSend}
                 disabled={!input.trim() || isGenerating}
               >
                 <i className="ri-send-plane-fill"></i>
               </Button>
             </div>
             <p className="text-[10px] text-center text-muted-foreground mt-2">
               Este playground usa respuestas simuladas para demostrar el flujo de UI.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}

// simple Badge dummy
function Badge({ children, className }: any) {
  return <span className={`px-2 py-0.5 rounded bg-muted text-[10px] ${className}`}>{children}</span>;
}
