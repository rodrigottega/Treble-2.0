import * as React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ChannelHeaderProps {
  title: string;
  description: string;
  onMetricsClick: () => void;
}

export function ChannelHeader({ title, description, onMetricsClick }: ChannelHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
            Conectado
          </span>
        </div>
        <p className="text-sm text-muted-foreground max-w-xl">
          {description}
        </p>
      </div>
      
      <Button variant="outline" onClick={onMetricsClick} className="shrink-0">
        <i className="ri-bar-chart-box-line mr-2"></i> Ir a métricas
      </Button>
    </div>
  );
}
