import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type AgentStatus = "active" | "inactive" | "break";

const statusConfig: Record<AgentStatus, { label: string; desc: string; dotClass: string }> = {
  active: {
    label: "Activo",
    desc: "Disponible para atender conversaciones.",
    dotClass: "bg-green-500",
  },
  inactive: {
    label: "Inactivo",
    desc: "No recibirás nuevas asignaciones.",
    dotClass: "bg-slate-400",
  },
  break: {
    label: "Break",
    desc: "Pausa temporal sin cerrar sesión.",
    dotClass: "bg-amber-500",
  },
};

export function AgentStatusSelector() {
  const [status, setStatus] = React.useState<AgentStatus>("active");

  const handleStatusChange = (newStatus: AgentStatus) => {
    setStatus(newStatus);
    toast.success(`Estado actualizado a ${statusConfig[newStatus].label}`);
  };

  const current = statusConfig[status];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-2 px-2 text-muted-foreground hover:text-foreground">
          <div className={cn("h-2.5 w-2.5 rounded-full shrink-0", current.dotClass)} />
          <span className="font-medium text-foreground">{current.label}</span>
          <i className="ri-arrow-down-s-line ml-0.5 text-muted-foreground/70"></i>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[260px]">
        {(Object.keys(statusConfig) as AgentStatus[]).map((key) => {
          const conf = statusConfig[key];
          return (
            <DropdownMenuItem 
              key={key} 
              onClick={() => handleStatusChange(key)}
              className="flex flex-col items-start px-3 py-2 cursor-pointer gap-1 focus:bg-muted"
            >
              <div className="flex items-start gap-2">
                <div className={cn("h-2 w-2 rounded-full mt-1.5 shrink-0", conf.dotClass)} />
                <div className="flex flex-col">
                  <span className="font-medium">{conf.label}</span>
                  <span className="text-xs text-muted-foreground">{conf.desc}</span>
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
