import InvestigationCanvas from "./components/InvestigationCanvas";
import { Button } from "@/components/ui/button";
import { HatGlasses, Save, Download } from "lucide-react";

function App() {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
              >
                <Save className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Salvar</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 sm:h-9 px-2 sm:px-3"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Exportar</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 min-h-0">
        <InvestigationCanvas />
      </main>
    </div>
  );
}

export default App;
