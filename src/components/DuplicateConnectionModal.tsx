import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DuplicateConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceNodeLabel?: string;
  targetNodeLabel?: string;
}

export const DuplicateConnectionModal = ({
  isOpen,
  onClose,
  sourceNodeLabel = "Card A",
  targetNodeLabel = "Card B",
}: DuplicateConnectionModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                Conexão Duplicada
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Esta conexão já existe
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-lg border bg-yellow-50 border-yellow-200 p-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-yellow-900">
                Não é permitido conectar os mesmos cards mais de uma vez
              </p>
              <div className="mt-3 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-600"></div>
                  <span className="text-sm text-yellow-800">
                    <strong>{sourceNodeLabel}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-sm text-yellow-700">↓</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-600"></div>
                  <span className="text-sm text-yellow-800">
                    <strong>{targetNodeLabel}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Estes dois cards já possuem uma conexão entre eles. Para criar uma
            nova conexão, primeiro remova a conexão existente clicando sobre
            ela.
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button onClick={onClose} className="w-full">
            Entendi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
