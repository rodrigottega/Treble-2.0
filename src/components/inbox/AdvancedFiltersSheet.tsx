import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface AdvancedFiltersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filterChannel: 'all' | 'whatsapp' | 'instagram';
  setFilterChannel: (c: 'all' | 'whatsapp' | 'instagram') => void;
  filterStatus: 'all' | 'open' | 'resolved' | 'closed' | 'expired';
  setFilterStatus: (s: 'all' | 'open' | 'resolved' | 'closed' | 'expired') => void;
}

export function AdvancedFiltersSheet({ 
  open, 
  onOpenChange, 
  filterChannel, 
  setFilterChannel, 
  filterStatus, 
  setFilterStatus 
}: AdvancedFiltersSheetProps) {

  // Local state for applying filters
  const [localChannel, setLocalChannel] = React.useState(filterChannel);
  const [localStatus, setLocalStatus] = React.useState(filterStatus);

  React.useEffect(() => {
    if (open) {
      setLocalChannel(filterChannel);
      setLocalStatus(filterStatus);
    }
  }, [open, filterChannel, filterStatus]);

  const handleApply = () => {
    setFilterChannel(localChannel);
    setFilterStatus(localStatus);
    onOpenChange(false);
  };

  const handleClear = () => {
    setLocalChannel('all');
    setLocalStatus('all');
    setFilterChannel('all');
    setFilterStatus('all');
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-6 flex flex-col sm:max-w-xs w-full gap-0">
        <SheetHeader className="mb-6">
          <SheetTitle>Filtros avanzados</SheetTitle>
          <SheetDescription>
            Refina tu lista de conversaciones.
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6">
            
            {/* Canales */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">Canal</label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 p-2 rounded-lg border cursor-pointer hover:bg-muted transition-colors">
                  <input type="radio" name="channel" className="accent-primary w-4 h-4" checked={localChannel === 'all'} onChange={() => setLocalChannel('all')} />
                  <span className="text-sm font-medium">Todos</span>
                </label>
                <label className="flex items-center gap-3 p-2 rounded-lg border cursor-pointer hover:bg-muted transition-colors">
                  <input type="radio" name="channel" className="accent-primary w-4 h-4" checked={localChannel === 'whatsapp'} onChange={() => setLocalChannel('whatsapp')} />
                  <span className="text-sm font-medium flex items-center gap-2"><i className="ri-whatsapp-line text-green-600"></i> WhatsApp</span>
                </label>
                <label className="flex items-center gap-3 p-2 rounded-lg border cursor-pointer hover:bg-muted transition-colors">
                  <input type="radio" name="channel" className="accent-primary w-4 h-4" checked={localChannel === 'instagram'} onChange={() => setLocalChannel('instagram')} />
                  <span className="text-sm font-medium flex items-center gap-2"><i className="ri-instagram-line text-pink-600"></i> Instagram</span>
                </label>
              </div>
            </div>

            {/* Estado */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">Estado</label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 p-2 rounded-lg border cursor-pointer hover:bg-muted transition-colors">
                  <input type="radio" name="status" className="accent-primary w-4 h-4" checked={localStatus === 'all'} onChange={() => setLocalStatus('all')} />
                  <span className="text-sm font-medium">Todos</span>
                </label>
                <label className="flex items-center gap-3 p-2 rounded-lg border cursor-pointer hover:bg-muted transition-colors">
                  <input type="radio" name="status" className="accent-primary w-4 h-4" checked={localStatus === 'open'} onChange={() => setLocalStatus('open')} />
                  <span className="text-sm font-medium">Abierta</span>
                </label>
                <label className="flex items-center gap-3 p-2 rounded-lg border cursor-pointer hover:bg-muted transition-colors">
                  <input type="radio" name="status" className="accent-primary w-4 h-4" checked={localStatus === 'resolved'} onChange={() => setLocalStatus('resolved')} />
                  <span className="text-sm font-medium">Resuelta</span>
                </label>
                <label className="flex items-center gap-3 p-2 rounded-lg border cursor-pointer hover:bg-muted transition-colors">
                  <input type="radio" name="status" className="accent-primary w-4 h-4" checked={localStatus === 'closed'} onChange={() => setLocalStatus('closed')} />
                  <span className="text-sm font-medium">Cerrada</span>
                </label>
                <label className="flex items-center gap-3 p-2 rounded-lg border cursor-pointer hover:bg-muted transition-colors">
                  <input type="radio" name="status" className="accent-primary w-4 h-4" checked={localStatus === 'expired'} onChange={() => setLocalStatus('expired')} />
                  <span className="text-sm font-medium">WA Expirado</span>
                </label>
              </div>
            </div>

            {/* Dummy Mock Sections */}
            <div className="space-y-3 opacity-50">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between block">
                <span>Intención</span>
                <span className="text-[9px] bg-muted px-1.5 py-0.5 rounded-sm normal-case">Próximamente</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                 <div className="p-2 border rounded-md text-xs text-center">Alta</div>
                 <div className="p-2 border rounded-md text-xs text-center">Media</div>
              </div>
            </div>

          </div>
        </ScrollArea>

        <div className="pt-6 mt-auto border-t flex gap-3">
          <Button variant="outline" className="flex-1" onClick={handleClear}>Limpiar</Button>
          <Button className="flex-1" onClick={handleApply}>Aplicar</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
