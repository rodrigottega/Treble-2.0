import * as React from "react";
import { toast } from "sonner";
import { ChannelHeader } from "./ChannelHeader";
import { LanguageSelectCard } from "./LanguageSelectCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function InstagramChannelPage() {
  const [isConnected, setIsConnected] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleMetricsClick = () => {
    toast("Las métricas de Instagram estarán disponibles próximamente.");
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setIsDialogOpen(false);
    toast("Instagram desconectado correctamente.");
  };
  
  const handleReconnect = () => {
    toast("La reconexión estará disponible próximamente.");
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">Instagram</h1>
            {isConnected ? (
              <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                Conectado
              </span>
            ) : (
              <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                Desconectado
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            Administra la cuenta conectada, el idioma de respuesta y las acciones básicas del canal.
          </p>
        </div>
        
        <Button variant="outline" onClick={handleMetricsClick} className="shrink-0">
          <i className="ri-bar-chart-box-line mr-2"></i> Ir a métricas
        </Button>
      </div>
      
      {/* Cuenta conectada */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="font-semibold mb-1">Cuenta conectada</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Cuenta de Instagram conectada a este workspace.
          </p>
          
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl p-[2px]">
              <div className="w-full h-full bg-card rounded-full flex items-center justify-center">
                <i className="ri-instagram-line text-foreground"></i>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h4 className="font-semibold text-lg">Ciarem Education</h4>
              </div>
              <p className="text-sm text-muted-foreground">@ciarem.education</p>
              
              <div className="flex items-center gap-3 mt-3">
                <span className="text-xs bg-muted px-2 py-0.5 rounded-md text-muted-foreground font-medium">Cuenta profesional</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><i className="ri-refresh-line"></i> Hace 8 min</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:border-l md:pl-6 md:h-24 flex flex-col justify-center">
          {isConnected ? (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                  <i className="ri-link-unlink-M mr-2"></i> Desconectar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Desconectar Instagram</DialogTitle>
                  <DialogDescription>
                    Al desconectar esta cuenta, dejarás de recibir nuevos mensajes de Instagram en Ciarem. Las conversaciones existentes se conservarán como historial.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                  <Button variant="destructive" onClick={handleDisconnect}>Desconectar cuenta</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <Button onClick={handleReconnect}>
              <i className="ri-links-line mr-2"></i> Reconectar cuenta
            </Button>
          )}
        </div>
      </div>

      <LanguageSelectCard />
      
    </div>
  );
}
