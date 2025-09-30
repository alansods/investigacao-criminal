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

interface DeleteConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  connectionLabel?: string;
  sourceNode?: string;
  targetNode?: string;
}

export const DeleteConnectionModal = ({
  isOpen,
  onClose,
  onConfirm,
  connectionLabel = "conexão",
  sourceNode = "Grupo A",
  targetNode = "Grupo B",
}: DeleteConnectionModalProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                Remover Conexão
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Esta ação não pode ser desfeita
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Conexão:</span>
                <span className="text-sm text-muted-foreground">
                  {connectionLabel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">De:</span>
                <span className="text-sm text-muted-foreground">
                  {sourceNode}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Para:</span>
                <span className="text-sm text-muted-foreground">
                  {targetNode}
                </span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Tem certeza que deseja remover esta conexão? Esta ação irá
            desconectar os grupos permanentemente.
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            <Trash2 className="mr-2 h-4 w-4" />
            Remover Conexão
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
