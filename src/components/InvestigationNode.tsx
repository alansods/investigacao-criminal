import { memo, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Pencil, GripVertical } from "lucide-react";
import { MediaIcon } from "./MediaIcon";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { AddClueModal } from "./AddClueModal";
import type { Clue, MediaType } from "@/types/investigation";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

function EmptyDropZone({ groupId }: { groupId: string }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `empty-${groupId}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[60px] border-2 border-dashed rounded-lg flex items-center justify-center transition-colors ${
        isOver ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50"
      }`}
    >
      <p className="text-sm text-gray-500">
        {isOver ? "Solte a pista aqui" : "Nenhuma pista"}
      </p>
    </div>
  );
}

export interface InvestigationNodeData {
  label: string;
  description?: string;
  color?: string;
  icon?: React.ReactNode;
  clues?: Clue[];
  onDeleteGroup?: (groupId: string) => void;
  onDeleteClue?: (clueId: string) => void;
  onAddClue?: (
    groupId: string,
    clue: Omit<Clue, "id" | "groupId" | "order" | "createdAt" | "updatedAt">
  ) => void;
  onReorderClues?: (groupId: string, orderedIds: string[]) => void;
  onMoveClue?: (clueId: string, fromGroupId: string, toGroupId: string) => void;
  onUpdateClue?: (
    groupId: string,
    clueId: string,
    updates: {
      title: string;
      content: string;
      mediaType: MediaType;
      mediaUrl?: string;
    }
  ) => void;
  groupId?: string;
  draggedItem?: string | null;
}

function SortableClue({
  clue,
  onEdit,
  onDelete,
}: {
  clue: Clue;
  onEdit: (id: string, e?: React.MouseEvent) => void;
  onDelete: (id: string, e?: React.MouseEvent) => void;
}) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: clue.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  } as React.CSSProperties;

  return (
    <div ref={setNodeRef} style={style} className="group">
      <Card className="cursor-default hover:shadow-md transition-shadow">
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
            <div className="flex gap-1 items-center">
              <button
                onClick={(e) => onEdit(clue.id, e)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded flex items-center justify-center"
              >
                <Pencil className="h-3 w-3 text-gray-600" />
              </button>
              <button
                onClick={(e) => onDelete(clue.id, e)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded text-red-600 flex items-center justify-center"
              >
                <Trash2 className="h-3 w-3" />
              </button>
              <button
                {...attributes}
                {...listeners}
                className="p-1 ml-1 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing hover:cursor-grab"
                aria-label="Arrastar pista"
                title="Arrastar para mover entre categorias"
              >
                <GripVertical className="h-3 w-3 text-gray-500" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const InvestigationNode = memo(({ data, selected }: NodeProps) => {
  const [editingClueId, setEditingClueId] = useState<string | null>(null);
  const [draftClue, setDraftClue] = useState<{
    title: string;
    content: string;
    mediaType: MediaType;
    mediaUrl?: string;
  } | null>(null);
  const [addClueModal, setAddClueModal] = useState(false);
  const [deleteGroupModal, setDeleteGroupModal] = useState(false);
  const [deleteClueModal, setDeleteClueModal] = useState<{
    isOpen: boolean;
    clueId: string;
    clueName: string;
  }>({
    isOpen: false,
    clueId: "",
    clueName: "",
  });

  const nodeData = data as unknown as InvestigationNodeData;

  // Determinar se este nó é origem ou destino do drag
  const isDragSource =
    nodeData.draggedItem &&
    nodeData.clues?.some((clue) => clue.id === nodeData.draggedItem);
  const isDropTarget =
    nodeData.draggedItem &&
    !isDragSource &&
    nodeData.clues &&
    nodeData.clues.length >= 0; // Qualquer categoria pode ser destino

  const handleAddClue = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAddClueModal(true);
  };

  const handleSaveClue = (clue: {
    title: string;
    content: string;
    mediaType: MediaType;
  }) => {
    if (nodeData.onAddClue && nodeData.groupId) {
      nodeData.onAddClue(nodeData.groupId, clue);
    }
  };

  const handleStartEdit = (clueId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setEditingClueId(clueId);
    const clue = nodeData.clues?.find((c) => c.id === clueId);
    if (clue) {
      setDraftClue({
        title: clue.title,
        content: clue.content,
        mediaType: clue.mediaType,
        mediaUrl: clue.mediaUrl || "",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingClueId(null);
    setDraftClue(null);
  };

  const handleDeleteGroup = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteGroupModal(true);
  };

  const handleDeleteClue = (clueId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const clue = nodeData.clues?.find((c) => c.id === clueId);
    setDeleteClueModal({
      isOpen: true,
      clueId,
      clueName: clue?.title || "Pista",
    });
  };

  const confirmDeleteGroup = () => {
    if (nodeData.onDeleteGroup && nodeData.groupId) {
      nodeData.onDeleteGroup(nodeData.groupId);
    }
  };

  const confirmDeleteClue = () => {
    if (nodeData.onDeleteClue) {
      nodeData.onDeleteClue(deleteClueModal.clueId);
    }
  };

  const handleSaveEdit = () => {
    if (!editingClueId || !nodeData.groupId || !draftClue) return;
    // Validação: não permitir salvar sem título
    if (!draftClue.title.trim()) return;
    if (nodeData.onUpdateClue) {
      nodeData.onUpdateClue(nodeData.groupId, editingClueId, draftClue);
    }
    setEditingClueId(null);
    setDraftClue(null);
  };

  return (
    <div className="relative">
      <Card
        className={`
          w-full min-w-[280px] max-w-[320px] 
          sm:min-w-[300px] sm:max-w-[350px]
          md:min-w-[320px] md:max-w-[380px]
          lg:min-w-[340px] lg:max-w-[400px]
          xl:min-w-[360px] xl:max-w-[420px]
          transition-all ${selected ? "ring-2 ring-blue-500" : ""} ${
          isDragSource ? "ring-2 ring-orange-500 bg-orange-50" : ""
        } ${
          isDropTarget ? "ring-2 ring-green-500 bg-green-50 cursor-copy" : ""
        }`}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {nodeData.icon && (
                <div className="flex-shrink-0">{nodeData.icon}</div>
              )}
              <CardTitle className="text-xs sm:text-sm font-medium">
                {nodeData.label}
              </CardTitle>
              {isDragSource && (
                <span className="text-xs bg-orange-100 text-orange-800 px-1 sm:px-2 py-1 rounded-full">
                  Origem
                </span>
              )}
              {isDropTarget && (
                <span className="text-xs bg-green-100 text-green-800 px-1 sm:px-2 py-1 rounded-full">
                  Destino
                </span>
              )}
            </div>
            <div className="flex gap-0.5 sm:gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDeleteGroup}
                className="h-5 w-5 sm:h-6 sm:w-6 p-0 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </Button>
            </div>
          </div>
          {nodeData.description && (
            <p className="text-xs text-muted-foreground">
              {nodeData.description}
            </p>
          )}
        </CardHeader>

        {nodeData.description && <hr className="border-border mb-6" />}

        <CardContent className="pt-0 nodrag">
          <div className="space-y-1 sm:space-y-2 min-h-[80px] sm:min-h-[100px]">
            {/* Lista ordenável de pistas */}
            <SortableContext
              items={(nodeData.clues || []).map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {nodeData.clues && nodeData.clues.length > 0 ? (
                nodeData.clues.map((clue) => (
                  <div key={clue.id}>
                    {editingClueId === clue.id ? (
                      <Card className="border-2 border-blue-500 shadow-lg">
                        <CardContent className="p-3 space-y-3">
                          <input
                            type="text"
                            value={draftClue?.title ?? ""}
                            onChange={(e) =>
                              setDraftClue((prev) =>
                                prev ? { ...prev, title: e.target.value } : prev
                              )
                            }
                            className="w-full px-2 py-1 border rounded text-sm font-medium"
                            placeholder="Título da pista"
                          />

                          <textarea
                            value={draftClue?.content ?? ""}
                            onChange={(e) =>
                              setDraftClue((prev) =>
                                prev
                                  ? { ...prev, content: e.target.value }
                                  : prev
                              )
                            }
                            className="w-full px-2 py-1 border rounded text-sm min-h-[60px] resize-none"
                            placeholder="Conteúdo da pista (opcional)"
                          />

                          <div className="flex items-center gap-2">
                            <select
                              value={draftClue?.mediaType ?? "text"}
                              onChange={(e) =>
                                setDraftClue((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        mediaType: e.target.value as MediaType,
                                      }
                                    : prev
                                )
                              }
                              className="px-2 py-1 border rounded text-xs"
                            >
                              <option value="text">Texto</option>
                              <option value="image">Imagem</option>
                              <option value="video">Vídeo</option>
                              <option value="audio">Áudio</option>
                            </select>

                            {draftClue?.mediaType !== "text" && (
                              <input
                                type="url"
                                value={draftClue?.mediaUrl || ""}
                                onChange={(e) =>
                                  setDraftClue((prev) =>
                                    prev
                                      ? { ...prev, mediaUrl: e.target.value }
                                      : prev
                                  )
                                }
                                placeholder="URL da mídia"
                                className="flex-1 px-2 py-1 border rounded text-xs"
                              />
                            )}
                          </div>

                          <div className="flex justify-end gap-2">
                            <button
                              onClick={handleCancelEdit}
                              className="px-3 py-1 text-xs border rounded hover:bg-gray-50"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={handleSaveEdit}
                              disabled={!draftClue?.title.trim()}
                              className={`px-3 py-1 text-xs rounded ${
                                draftClue?.title.trim()
                                  ? "bg-blue-500 text-white hover:bg-blue-600"
                                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                              }`}
                            >
                              Salvar
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <SortableClue
                        clue={clue}
                        onEdit={handleStartEdit}
                        onDelete={handleDeleteClue}
                      />
                    )}
                  </div>
                ))
              ) : (
                // Zona de drop para categoria vazia
                <EmptyDropZone groupId={nodeData.groupId || ""} />
              )}
            </SortableContext>

            <Button
              size="sm"
              variant="outline"
              onClick={handleAddClue}
              className="w-full h-8 sm:h-9"
            >
              <Plus className="h-3 w-3 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Adicionar Pista</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Left Handle - both source and target */}
      <Handle
        id="left"
        type="source"
        position={Position.Left}
        className="w-6 h-6 bg-purple-500"
      />
      <Handle
        id="left-target"
        type="target"
        position={Position.Left}
        className="w-6 h-6 bg-purple-500"
        style={{ opacity: 0 }}
      />

      {/* Right Handle - both source and target */}
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        className="w-6 h-6 bg-purple-500"
      />
      <Handle
        id="right-target"
        type="target"
        position={Position.Right}
        className="w-6 h-6 bg-purple-500"
        style={{ opacity: 0 }}
      />

      {/* Top Handle - both source and target */}
      <Handle
        id="top"
        type="source"
        position={Position.Top}
        className="w-6 h-6 bg-purple-500"
      />
      <Handle
        id="top-target"
        type="target"
        position={Position.Top}
        className="w-6 h-6 bg-purple-500"
        style={{ opacity: 0 }}
      />

      {/* Bottom Handle - both source and target */}
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        className="w-6 h-6 bg-purple-500"
      />
      <Handle
        id="bottom-target"
        type="target"
        position={Position.Bottom}
        className="w-6 h-6 bg-purple-500"
        style={{ opacity: 0 }}
      />

      {/* Modais de confirmação */}
      <ConfirmDeleteModal
        isOpen={deleteGroupModal}
        onClose={() => setDeleteGroupModal(false)}
        onConfirm={confirmDeleteGroup}
        title="Deletar Grupo"
        description="Tem certeza que deseja deletar este grupo?"
        itemName={nodeData.label}
        type="group"
      />

      <ConfirmDeleteModal
        isOpen={deleteClueModal.isOpen}
        onClose={() =>
          setDeleteClueModal({ isOpen: false, clueId: "", clueName: "" })
        }
        onConfirm={confirmDeleteClue}
        title="Deletar Pista"
        description="Tem certeza que deseja deletar esta pista?"
        itemName={deleteClueModal.clueName}
        type="clue"
      />

      <AddClueModal
        isOpen={addClueModal}
        onClose={() => setAddClueModal(false)}
        onSave={handleSaveClue}
      />
    </div>
  );
});

InvestigationNode.displayName = "InvestigationNode";

export default InvestigationNode;
