import { AlertTriangle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName?: string;
  type: "group" | "clue";
}

export const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  type,
}: ConfirmDeleteModalProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getIcon = () => {
    if (type === "group") {
      return <Trash2 className="h-5 w-5 text-destructive" />;
    }
    return <Trash2 className="h-5 w-5 text-destructive" />;
  };

  const getColor = () => {
    if (type === "group") {
      return "bg-red-500/10";
    }
    return "bg-orange-500/10";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${getColor()}`}
            >
              {getIcon()}
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                {title}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          {itemName && (
            <div className="rounded-lg border bg-muted/50 p-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Item:</span>
                <span className="text-sm text-muted-foreground">
                  {itemName}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                {type === "group"
                  ? "Esta ação irá remover o grupo e todas as suas conexões permanentemente."
                  : "Esta ação irá remover a pista permanentemente."}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Esta ação não pode ser desfeita.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            <Trash2 className="mr-2 h-4 w-4" />
            {type === "group" ? "Deletar Grupo" : "Deletar Pista"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
