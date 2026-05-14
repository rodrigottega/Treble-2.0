import * as React from "react";
import { Input } from "@/components/ui/input";

interface TeamsToolbarProps {
  search: string;
  setSearch: (v: string) => void;
  count: number;
}

export function TeamsToolbar({ search, setSearch, count }: TeamsToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative w-72">
           <i className="ri-search-line absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground mr-1"></i>
           <Input 
             placeholder="Buscar equipos..." 
             className="pl-8 h-9" 
             value={search}
             onChange={e => setSearch(e.target.value)}
           />
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        {count} {count === 1 ? 'equipo' : 'equipos'}
      </div>
    </div>
  );
}
