import { HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] md:max-h-[80vh] overflow-hidden flex flex-col p-0">
        <div className="px-6 pt-6">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <HelpCircle className="h-6 w-6 text-blue-600" />
              <DialogTitle className="text-lg font-semibold">
                Como Usar o Sistema de Investigação
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="border-t mt-4"></div>
        </div>

        <div className="space-y-6 py-4 px-6 overflow-y-auto flex-1">
          {/* Adicionar Categorias */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center text-blue-600 text-base font-bold">
                1.
              </span>
              Adicionar Categorias
            </h3>
            <div className="ml-8 space-y-2">
              <p className="text-sm text-gray-700">
                • Clique e arraste uma categoria da barra lateral esquerda para
                o canvas
              </p>
              <p className="text-sm text-gray-700">
                • Solte a categoria na posição desejada
              </p>
              <p className="text-sm text-gray-700">
                • Você pode adicionar quantas categorias quiser
              </p>
            </div>
          </section>

          {/* Adicionar Pistas */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center text-blue-600 text-base font-bold">
                2.
              </span>
              Adicionar Pistas
            </h3>
            <div className="ml-8 space-y-2">
              <p className="text-sm text-gray-700">
                • Clique no botão "+" dentro de uma categoria
              </p>
              <p className="text-sm text-gray-700">
                • Preencha o título e conteúdo da pista
              </p>
              <p className="text-sm text-gray-700">
                • Escolha o tipo de mídia (texto, imagem, vídeo ou áudio)
              </p>
              <p className="text-sm text-gray-700">
                • Adicione uma URL de mídia se necessário
              </p>
            </div>
          </section>

          {/* Criar Conexões */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center text-blue-600 text-base font-bold">
                3.
              </span>
              Criar Conexões entre Categorias
            </h3>
            <div className="ml-8 space-y-2">
              <p className="text-sm text-gray-700">
                • Clique e arraste de um dos pontos de conexão (círculos roxos)
                de uma categoria
              </p>
              <p className="text-sm text-gray-700">
                • Arraste até o ponto de conexão de outra categoria
              </p>
              <p className="text-sm text-gray-700">
                • Solte para criar a conexão
              </p>
              <p className="text-sm text-gray-700">
                • As conexões mostram o relacionamento entre diferentes
                categorias
              </p>
            </div>
          </section>

          {/* Mover Pistas */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center text-blue-600 text-base font-bold">
                4.
              </span>
              Mover e Reorganizar Pistas
            </h3>
            <div className="ml-8 space-y-2">
              <p className="text-sm text-gray-700">
                • Clique no ícone de arrastar (≡) ao lado de uma pista
              </p>
              <p className="text-sm text-gray-700">
                • Arraste para cima ou para baixo para reordenar dentro da mesma
                categoria
              </p>
              <p className="text-sm text-gray-700">
                • Ou arraste para outra categoria para mover a pista
              </p>
            </div>
          </section>

          {/* Editar e Excluir */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center text-blue-600 text-base font-bold">
                5.
              </span>
              Editar e Excluir
            </h3>
            <div className="ml-8 space-y-2">
              <p className="text-sm text-gray-700">
                • <strong>Editar pista:</strong> Clique no ícone de lápis em uma
                pista
              </p>
              <p className="text-sm text-gray-700">
                • <strong>Excluir pista:</strong> Clique no ícone de lixeira em
                uma pista
              </p>
              <p className="text-sm text-gray-700">
                • <strong>Excluir categoria:</strong> Clique no ícone de lixeira
                no cabeçalho da categoria
              </p>
              <p className="text-sm text-gray-700">
                • <strong>Excluir conexão:</strong> Clique sobre a linha de
                conexão
              </p>
            </div>
          </section>

          {/* Navegação no Canvas */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center text-blue-600 text-base font-bold">
                6.
              </span>
              Navegação no Canvas
            </h3>
            <div className="ml-8 space-y-2">
              <p className="text-sm text-gray-700">
                • <strong>Mover canvas:</strong> Clique e arraste em um espaço
                vazio
              </p>
              <p className="text-sm text-gray-700">
                • <strong>Zoom:</strong> Use a roda do mouse ou os controles no
                canto inferior esquerdo
              </p>
              <p className="text-sm text-gray-700">
                • <strong>Mover categoria:</strong> Clique e arraste o cabeçalho
                da categoria
              </p>
              <p className="text-sm text-gray-700">
                • <strong>Minimapa:</strong> Use o minimapa no canto inferior
                direito para navegar
              </p>
            </div>
          </section>

          {/* Regras Importantes */}
          <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-yellow-900 mb-2">
              ⚠️ Regras Importantes
            </h3>
            <div className="space-y-1">
              <p className="text-sm text-yellow-800">
                • <strong>Conexões únicas:</strong> Não é permitido conectar as
                mesmas categorias mais de uma vez, mesmo por lados diferentes
              </p>
              <p className="text-sm text-yellow-800">
                • <strong>Salvamento:</strong> Use o botão "Salvar" no topo da
                página para salvar seu progresso
              </p>
              <p className="text-sm text-yellow-800">
                • <strong>Limpar dados:</strong> O botão "Limpar" remove
                permanentemente todos os dados salvos
              </p>
            </div>
          </section>

          {/* Dicas */}
          <section className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              💡 Dicas Úteis
            </h3>
            <div className="space-y-1">
              <p className="text-sm text-blue-800">
                • Organize suas categorias da esquerda para a direita seguindo a
                cronologia dos eventos
              </p>
              <p className="text-sm text-blue-800">
                • Use cores diferentes para identificar tipos de evidências
                rapidamente
              </p>
              <p className="text-sm text-blue-800">
                • Salve regularmente para não perder seu trabalho
              </p>
              <p className="text-sm text-blue-800">
                • Use conexões para mostrar relações entre evidências,
                testemunhos e suspeitos
              </p>
            </div>
          </section>
        </div>

        <div className="flex justify-end pt-4 pb-6 px-6 border-t bg-white">
          <Button onClick={onClose} className="px-6">
            Entendi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
