import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MediaIcon } from "./MediaIcon";
import type { Clue } from "@/types/investigation";

interface SimpleDragDropProps {
  clue: Clue;
  onUpdateClue: (clueId: string, updates: Partial<Clue>) => void;
  onDeleteClue: (clueId: string) => void;
  onStartEdit: (clueId: string) => void;
  isEditing: boolean;
  onSaveClue: (clue: Clue) => void;
  onCancelEdit: () => void;
}

export const SimpleDragDrop = ({
  clue,
  onUpdateClue,
  onDeleteClue,
  onStartEdit,
  isEditing,
  onSaveClue,
  onCancelEdit,
}: SimpleDragDropProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;

    setIsDragging(true);
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !cardRef.current) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    cardRef.current.style.position = "fixed";
    cardRef.current.style.left = `${newX}px`;
    cardRef.current.style.top = `${newY}px`;
    cardRef.current.style.zIndex = "1000";
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    setIsDragging(false);
    if (cardRef.current) {
      cardRef.current.style.position = "";
      cardRef.current.style.left = "";
      cardRef.current.style.top = "";
      cardRef.current.style.zIndex = "";
    }
  };

  if (isEditing) {
    return (
      <Card className="border-2 border-blue-500 shadow-lg">
        <CardContent className="p-3 space-y-3">
          <input
            type="text"
            value={clue.title}
            onChange={(e) => onUpdateClue(clue.id, { title: e.target.value })}
            className="w-full px-2 py-1 border rounded text-sm font-medium"
            placeholder="Título da pista"
          />

          <textarea
            value={clue.content}
            onChange={(e) => onUpdateClue(clue.id, { content: e.target.value })}
            className="w-full px-2 py-1 border rounded text-sm min-h-[60px] resize-none"
            placeholder="Conteúdo da pista"
          />

          <div className="flex items-center gap-2">
            <select
              value={clue.mediaType}
              onChange={(e) =>
                onUpdateClue(clue.id, { mediaType: e.target.value as any })
              }
              className="px-2 py-1 border rounded text-xs"
            >
              <option value="text">Texto</option>
              <option value="image">Imagem</option>
              <option value="video">Vídeo</option>
              <option value="audio">Áudio</option>
            </select>

            {clue.mediaType !== "text" && (
              <input
                type="url"
                value={clue.mediaUrl || ""}
                onChange={(e) =>
                  onUpdateClue(clue.id, { mediaUrl: e.target.value })
                }
                placeholder="URL da mídia"
                className="flex-1 px-2 py-1 border rounded text-xs"
              />
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onCancelEdit}
              className="px-3 py-1 text-xs border rounded hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={() => onSaveClue(clue)}
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Salvar
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card
        ref={cardRef}
        className={`cursor-move hover:shadow-md transition-shadow ${
          isDragging ? "opacity-50 shadow-lg" : ""
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <CardContent className="p-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 flex-1">
              <MediaIcon type={clue.mediaType} />
              <div className="flex-1">
                <h4 className="font-medium text-sm">{clue.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {clue.content}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartEdit(clue.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                  >
                    ✏️
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Editar pista</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteClue(clue.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded text-red-600"
                  >
                    🗑️
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Deletar pista</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
