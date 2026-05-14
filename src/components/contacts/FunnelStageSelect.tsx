import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FunnelStage, FunnelStageDef } from "@/types/contacts";

interface FunnelStageSelectProps {
  value: FunnelStage;
  onChange: (val: string) => void;
  funnelStages: FunnelStageDef[];
}

export function FunnelStageSelect({ value, onChange, funnelStages }: FunnelStageSelectProps) {
  const currentStage = funnelStages.find(s => s.name === value);
  const colorClass = currentStage ? currentStage.color.split(" ").slice(0, 2).join(" ") : "bg-muted text-muted-foreground";

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`h-7 px-2 border border-transparent hover:border-border text-xs shadow-none w-[160px] ${colorClass} rounded-full font-medium justify-between`}>
         <span className="truncate">{value}</span>
      </SelectTrigger>
      <SelectContent>
        {funnelStages.map(stage => (
          <SelectItem key={stage.id} value={stage.name}>{stage.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
