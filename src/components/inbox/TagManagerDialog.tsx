import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { dummyTags } from "@/data/tags";
import { Tag } from "@/types/inbox";
import { toast } from "sonner";

interface TagManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TagManagerDialog({ open, onOpenChange }: TagManagerDialogProps) {
  const [tags, setTags] = React.useState<Tag[]>(dummyTags);
  const [newTagName, setNewTagName] = React.useState("");

  const handleCreate = () => {
    if (!newTagName.trim()) return;
    setTags([...tags, { 
      id: `tag_${Date.now()}`, 
      name: newTagName, 
      color: "bg-slate-100 text-slate-800 border-slate-200" 
    }]);
    setNewTagName("");
    toast.success("Etiqueta creada");
  };

  const handleDelete = (id: string, name: string) => {
    setTags(tags.filter(t => t.id !== id));
    toast.success(`Etiqueta "${name}" eliminada`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gestionar Etiquetas</DialogTitle>
          <DialogDescription>
            Crea, edita o elimina las etiquetas globales.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 mt-4">
          <Input 
            value={newTagName} 
            onChange={e => setNewTagName(e.target.value)} 
            placeholder="Nueva etiqueta..." 
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <Button type="button" onClick={handleCreate}>
            <i className="ri-add-line mr-1"></i> Crear
          </Button>
        </div>

        <div className="flex flex-col gap-2 mt-4 max-h-[300px] overflow-y-auto">
          {tags.map(tag => (
            <div key={tag.id} className="flex items-center justify-between p-2 border rounded-md">
              <Badge variant="outline" className={tag.color}>{tag.name}</Badge>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => toast("Funcionalidad simulada: Editar etiqueta")}>
                  <i className="ri-pencil-line"></i>
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(tag.id, tag.name)}>
                  <i className="ri-delete-bin-line"></i>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
