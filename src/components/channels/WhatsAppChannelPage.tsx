import * as React from "react";
import { toast } from "sonner";
import { ChannelHeader } from "./ChannelHeader";
import { LanguageSelectCard } from "./LanguageSelectCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function WhatsAppChannelPage() {
  const [selectedLine, setSelectedLine] = React.useState<any>(null);

  const handleMetricsClick = () => {
    toast("Las métricas del canal estarán disponibles próximamente.");
  };

  const lines = [
    {
      id: "1",
      name: "Admisiones principal",
      number: "+52 55 1907 6049",
      status: "Activa",
      quality: "Alta",
      qualityColor: "text-green-700 bg-green-50 border-green-200/60",
      dot: "bg-green-500",
      language: "Español",
      lastActivity: "Hace 12 min",
      verified: true,
      connectedAt: "12 de Enero, 2024"
    },
    {
      id: "2",
      name: "Soporte académico",
      number: "+52 55 2712 1204",
      status: "Activa",
      quality: "Media",
      qualityColor: "text-amber-700 bg-amber-50 border-amber-200/60",
      dot: "bg-amber-500",
      language: "Español",
      lastActivity: "Hoy, 10:42",
      verified: true,
      connectedAt: "15 de Febrero, 2024"
    },
    {
      id: "3",
      name: "Campañas educación",
      number: "+57 300 456 7788",
      status: "En revisión",
      quality: "Pendiente",
      qualityColor: "text-slate-700 bg-slate-100 border-slate-200",
      dot: "bg-slate-400",
      language: "Español",
      lastActivity: "Ayer",
      verified: false,
      connectedAt: "Hace 2 días"
    }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-300">
      <ChannelHeader 
        title="WhatsApp" 
        description="Gestiona las líneas conectadas, la calidad del canal y la configuración básica de respuesta."
        onMetricsClick={handleMetricsClick}
      />
      
      {/* Líneas Conectadas */}
      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="font-semibold mb-1">Líneas conectadas</h3>
          <p className="text-sm text-muted-foreground">
            Líneas de WhatsApp Business conectadas a este workspace.
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/30 text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Línea</th>
                <th className="px-6 py-3 font-medium hidden sm:table-cell">Calidad</th>
                <th className="px-6 py-3 font-medium hidden md:table-cell">Última actividad</th>
                <th className="px-6 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {lines.map((line) => (
                <tr key={line.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{line.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{line.number}</div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${line.qualityColor}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${line.dot}`}></div>
                      {line.quality}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">
                    {line.lastActivity}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <i className="ri-more-2-fill"></i>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedLine(line)}>
                          <i className="ri-profile-line mr-2"></i> Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast("La configuración de idioma de esta línea se modificará próximamente.")}>
                          <i className="ri-global-line mr-2"></i> Configurar idioma
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleMetricsClick}>
                          <i className="ri-bar-chart-box-line mr-2"></i> Ir a métricas
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selectedLine} onOpenChange={(open) => !open && setSelectedLine(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalles de línea</DialogTitle>
          </DialogHeader>
          {selectedLine && (
            <div className="space-y-4 mt-2">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Nombre de línea</span>
                <span className="font-medium text-sm">{selectedLine.name}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Número</span>
                <span className="font-medium text-sm">{selectedLine.number}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Estado</span>
                <span className="font-medium text-sm">{selectedLine.status}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Calidad</span>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${selectedLine.qualityColor}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${selectedLine.dot}`}></div>
                  {selectedLine.quality}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Idioma</span>
                <span className="font-medium text-sm">{selectedLine.language}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Empresa verificada</span>
                <span className="font-medium text-sm flex items-center gap-1">
                  {selectedLine.verified ? <><i className="ri-checkbox-circle-fill text-green-600"></i> Sí</> : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Fecha de conexión</span>
                <span className="font-medium text-sm">{selectedLine.connectedAt}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calidad de la línea */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="font-semibold mb-1">Calidad de la línea</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Monitorea la salud de tus líneas y posibles restricciones.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-6 mt-auto">
            <div className="p-4 bg-muted/30 rounded-xl border border-muted/50">
              <p className="text-2xl font-semibold mb-1">98.4%</p>
              <p className="text-xs text-muted-foreground">Tasa de entrega</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-xl border border-muted/50">
              <p className="text-2xl font-semibold mb-1">1,248</p>
              <p className="text-xs text-muted-foreground">Enviados hoy</p>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg border border-muted">
            <i className="ri-information-line mr-1 text-primary"></i> 
            Una buena calidad ayuda a mantener una entrega estable y reduce el riesgo de limitaciones.
          </p>
          
          <Button 
            variant="outline" 
            className="w-full mt-4" 
            onClick={() => toast("", {
              description: "✓ Evita enviar mensajes a usuarios sin consentimiento.\n✓ Mantén baja la tasa de bloqueos.\n✓ Usa templates relevantes y claros.",
              duration: 5000,
            })}
          >
            Ver recomendaciones
          </Button>
        </div>

        {/* Perfil */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="font-semibold mb-1">Perfil de WhatsApp</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Información visible para las personas que interactúan con esta línea.
          </p>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-2xl font-bold border border-primary/20">
              CE
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-medium text-lg">Ciarem Education</h4>
                <i className="ri-verified-badge-fill text-blue-500"></i>
              </div>
              <p className="text-sm text-green-600 font-medium">Empresa verificada</p>
            </div>
          </div>
          
          <div className="space-y-3 mt-auto">
            <div className="flex items-center justify-between text-sm py-2 border-b">
              <span className="text-muted-foreground">Business Manager</span>
              <span className="font-medium">Ciarem Technologies</span>
            </div>
            <div className="flex items-center justify-between text-sm py-2 border-b">
              <span className="text-muted-foreground">Categoría</span>
              <span className="font-medium">Educación</span>
            </div>
            <div className="flex items-center justify-between text-sm py-2">
              <span className="text-muted-foreground">Sitio web</span>
              <span className="font-medium text-primary">ciarem.ai</span>
            </div>
          </div>
          
          <Button variant="outline" className="w-full mt-4" onClick={() => toast("La edición del perfil estará disponible próximamente.")}>
            Editar perfil
          </Button>
        </div>
      </div>
      
      {/* HSM Templates (Coming Soon) */}
      <div className="bg-card border rounded-2xl p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute right-0 top-0 text-9xl text-muted/5 opacity-50 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
          <i className="ri-layout-grid-line"></i>
        </div>
        
        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
              <i className="ri-layout-grid-line text-xl"></i>
            </div>
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                HSM Templates 
                <span className="text-[10px] font-bold uppercase tracking-wide bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Próximamente</span>
              </h3>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl">
            Aquí podrás crear, revisar y administrar plantillas HSM aprobadas por Meta para iniciar o retomar interacciones de utilidad, marketing y autenticación.
          </p>
        </div>
        
        <Button 
          variant="secondary" 
          disabled
          className="relative z-10 shrink-0 opacity-80"
          onClick={() => toast("La gestión de HSM Templates estará disponible próximamente.")}
        >
          Gestionar templates
        </Button>
      </div>

      <LanguageSelectCard />
      
    </div>
  );
}
