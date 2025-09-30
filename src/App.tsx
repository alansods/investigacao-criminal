import { useRef, useState } from "react";
import InvestigationCanvas, {
  type InvestigationCanvasRef,
} from "./components/InvestigationCanvas";
import { Button } from "@/components/ui/button";
import HelpButton from "./components/HelpButton";
import { HatGlasses, Save, Check, Trash2, AlertTriangle } from "lucide-react";

function App() {
  const canvasRef = useRef<InvestigationCanvasRef>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const handleSave = () => {
    if (canvasRef.current) {
      canvasRef.current.saveData();
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleClearClick = () => {
    setShowConfirmClear(true);
  };

  const handleConfirmClear = () => {
    // Limpar localStorage e salvar dados vazios para não carregar exemplos
    localStorage.setItem(
      "investigation-workflow-data",
      JSON.stringify({
        nodes: [],
        edges: [],
        savedAt: new Date().toISOString(),
      })
    );
    setShowConfirmClear(false);
    // Recarregar a página para resetar tudo
    window.location.reload();
  };

  const handleCancelClear = () => {
    setShowConfirmClear(false);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
        <div className="container flex h-12 sm:h-14 lg:h-16 max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8">
          <div className="mr-2 sm:mr-4 flex items-center">
            <HatGlasses className="h-5 w-5 sm:h-6 sm:w-6 mr-1 sm:mr-2" />
            <span className="font-bold text-sm sm:text-base lg:text-lg hidden sm:inline">
              Investigação Criminal
            </span>
            <span className="font-bold text-sm sm:hidden">Investigação</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-1 sm:space-x-2">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 sm:h-9 px-2 sm:px-3"
                onClick={handleSave}
              >
                {isSaved ? (
                  <>
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2 text-green-600" />
                    <span className="hidden sm:inline text-green-600">
                      Salvo!
                    </span>
                  </>
                ) : (
                  <>
                    <Save className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Salvar</span>
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 sm:h-9 px-2 sm:px-3 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                onClick={handleClearClick}
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Limpar</span>
              </Button>
              {/* Help on mobile/tablet (hidden on desktop) */}
              <div className="lg:hidden">
                <HelpButton
                  onClick={() => {
                    canvasRef.current?.openHelp?.();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 min-h-0 overflow-hidden">
        <InvestigationCanvas ref={canvasRef} />
      </main>

      {/* Modal de Confirmação para Limpar */}
      {showConfirmClear && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Limpar toda a investigação?
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Esta ação não pode ser desfeita.
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-6">
              Todos os dados salvos serão permanentemente removidos, incluindo
              todas as categorias, pistas e conexões. Tem certeza que deseja
              continuar?
            </p>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelClear}
                className="px-4"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmClear}
                className="bg-red-600 hover:bg-red-700 text-white px-4"
              >
                Sim, limpar tudo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
