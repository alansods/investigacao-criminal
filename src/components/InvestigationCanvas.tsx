import { useState, useCallback, useRef, useEffect } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  ReactFlowProvider,
  type ReactFlowInstance,
} from "@xyflow/react";
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  useDroppable,
  useSensors,
  useSensor,
  PointerSensor,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FileText, Image, Video, Volume2 } from "lucide-react";
import InvestigationNode from "./InvestigationNode";
import InvestigationToolbox from "./InvestigationToolbox";
import { DeleteConnectionModal } from "./DeleteConnectionModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Clue } from "@/types/investigation";

import "@xyflow/react/dist/style.css";

const nodeTypes = {
  investigation: InvestigationNode,
};

function mapTailwindBgToStrokeHex(bg?: string): string {
  if (!bg) return "#64748b"; // slate-500 fallback
  if (bg.includes("red")) return "#ef4444"; // red-500
  if (bg.includes("blue")) return "#3b82f6"; // blue-500
  if (bg.includes("yellow")) return "#eab308"; // yellow-500
  if (bg.includes("green")) return "#22c55e"; // green-500
  if (bg.includes("purple")) return "#a855f7"; // purple-500
  if (bg.includes("orange")) return "#f97316"; // orange-500
  return "#64748b";
}

// Dados iniciais para investigação criminal
const initialNodes: Node[] = [
  {
    id: "group-1",
    type: "investigation",
    position: { x: 100, y: 100 },
    data: {
      label: "Evidências Físicas",
      description: "Evidências materiais encontradas na cena do crime",
      color: "bg-red-100",
      icon: <FileText className="w-4 h-4 text-red-600" />,
      clues: [
        {
          id: "clue-1",
          title: "Impressão Digital",
          content: "Impressão digital encontrada na maçaneta da porta",
          mediaType: "image",
          mediaUrl: "https://example.com/fingerprint.jpg",
        },
        {
          id: "clue-2",
          title: "Fio de Cabelo",
          content: "Fio de cabelo castanho encontrado no local",
          mediaType: "text",
        },
      ],
    },
  },
  {
    id: "group-2",
    type: "investigation",
    position: { x: 600, y: 100 },
    data: {
      label: "Depoimentos",
      description: "Relatos de testemunhas e envolvidos",
      color: "bg-blue-100",
      icon: <Volume2 className="w-4 h-4 text-blue-600" />,
      clues: [
        {
          id: "clue-3",
          title: "Testemunha João",
          content: "Viu um carro vermelho saindo do local às 23h",
          mediaType: "audio",
          mediaUrl: "https://example.com/testimony.mp3",
        },
      ],
    },
  },
  {
    id: "group-3",
    type: "investigation",
    position: { x: 1100, y: 100 },
    data: {
      label: "Suspeitos",
      description: "Pessoas de interesse na investigação",
      color: "bg-yellow-100",
      icon: <Image className="w-4 h-4 text-yellow-600" />,
      clues: [
        {
          id: "clue-4",
          title: "Carlos Silva",
          content: "Ex-funcionário da empresa, tem histórico de violência",
          mediaType: "text",
        },
      ],
    },
  },
];

// Helper para criar arestas com label/cor do nó alvo
function makeInitialEdge(source: string, target: string): Edge {
  const targetNode = initialNodes.find((n) => n.id === target);
  const targetLabel = (targetNode?.data as any)?.label as string | undefined;
  const targetBg = (targetNode?.data as any)?.color as string | undefined;
  const stroke = mapTailwindBgToStrokeHex(targetBg);
  return {
    id: `e-${source}-${target}`,
    source,
    target,
    type: "smoothstep",
    label: targetLabel,
    style: {
      stroke,
      strokeWidth: 2,
    },
    markerEnd: {
      type: "arrowclosed",
      color: stroke,
    },
  } as Edge;
}

const initialEdges: Edge[] = [
  makeInitialEdge("group-1", "group-2"),
  makeInitialEdge("group-2", "group-3"),
];

const investigationTypes = [
  {
    id: "evidence",
    type: "investigation",
    label: "Evidências",
    icon: <FileText className="w-4 h-4 text-red-600" />,
    color: "bg-red-100",
  },
  {
    id: "testimony",
    type: "investigation",
    label: "Depoimentos",
    icon: <Volume2 className="w-4 h-4 text-blue-600" />,
    color: "bg-blue-100",
  },
  {
    id: "suspects",
    type: "investigation",
    label: "Suspeitos",
    icon: <Image className="w-4 h-4 text-yellow-600" />,
    color: "bg-yellow-100",
  },
  {
    id: "timeline",
    type: "investigation",
    label: "Cronologia",
    icon: <Video className="w-4 h-4 text-green-600" />,
    color: "bg-green-100",
  },
];

// Componente wrapper para capturar eventos de mouse
const DroppableReactFlow = ({
  children,
  onMouseMove,
}: {
  children: React.ReactNode;
  onMouseMove: (e: React.MouseEvent) => void;
}) => {
  const { setNodeRef } = useDroppable({
    id: "reactflow-canvas",
  });

  return (
    <div ref={setNodeRef} className="flex-1 h-full" onMouseMove={onMouseMove}>
      {children}
    </div>
  );
};

const InvestigationCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [draggedNode, setDraggedNode] = useState<{
    id: string;
    type: string;
    label: string;
    icon: React.ReactNode;
    color: string;
  } | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    edge: Edge | null;
  }>({
    isOpen: false,
    edge: null,
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Ajustar visualização inicial após carregamento
  useEffect(() => {
    if (reactFlowInstance) {
      // Aguardar um pouco para garantir que os nós foram renderizados
      setTimeout(() => {
        reactFlowInstance.fitView({
          padding: 0.2,
          includeHiddenNodes: false,
          minZoom: 0.5,
          maxZoom: 1.2,
        });
      }, 100);
    }
  }, [reactFlowInstance]);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => {
        const targetNode = nodes.find((n) => n.id === params.target);
        const targetLabel = (targetNode?.data as any)?.label as
          | string
          | undefined;
        const targetBg = (targetNode?.data as any)?.color as string | undefined;
        const stroke = mapTailwindBgToStrokeHex(targetBg);

        const newEdge: Edge = {
          id: `e-${params.source}-${params.target}-${Date.now()}`,
          ...params,
          type: "smoothstep",
          label: targetLabel,
          style: { stroke, strokeWidth: 2 },
          markerEnd: { type: "arrowclosed", color: stroke },
        } as Edge;
        return addEdge(newEdge, eds);
      }),
    [setEdges, nodes]
  );

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation();
    setDeleteModal({
      isOpen: true,
      edge,
    });
  }, []);

  const handleDeleteConnection = useCallback(() => {
    if (deleteModal.edge) {
      setEdges((eds) => eds.filter((e) => e.id !== deleteModal.edge!.id));
    }
  }, [deleteModal.edge, setEdges]);

  const closeDeleteModal = useCallback(() => {
    setDeleteModal({
      isOpen: false,
      edge: null,
    });
  }, []);

  const handleDeleteGroup = useCallback(
    (groupId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== groupId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== groupId && edge.target !== groupId)
      );
    },
    [setNodes, setEdges]
  );

  const handleDeleteClue = useCallback(
    (clueId: string) => {
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: {
            ...node.data,
            clues:
              (node.data.clues as any[])?.filter(
                (clue: any) => clue.id !== clueId
              ) || [],
          },
        }))
      );
    },
    [setNodes]
  );

  const handleReorderClues = useCallback(
    (groupId: string, orderedIds: string[]) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id !== groupId) return node;
          const current = ((node.data as any).clues || []) as Clue[];
          const byId = new Map(current.map((c) => [c.id, c] as const));
          const reordered = orderedIds
            .map((id, idx) => {
              const c = byId.get(id);
              if (!c) return null;
              return { ...c, order: idx } as Clue;
            })
            .filter(Boolean) as Clue[];
          return { ...node, data: { ...(node.data as any), clues: reordered } };
        })
      );
    },
    [setNodes]
  );

  const handleMoveClue = useCallback(
    (clueId: string, fromGroupId: string, toGroupId: string) => {
      setNodes((nds) => {
        // Encontrar a pista no grupo de origem
        let clueToMove: Clue | null = null;
        const updatedNodes = nds.map((node) => {
          if (node.id === fromGroupId) {
            const clues = (node.data as any).clues || [];
            const clueIndex = clues.findIndex((c: Clue) => c.id === clueId);
            if (clueIndex !== -1) {
              clueToMove = clues[clueIndex];
              return {
                ...node,
                data: {
                  ...node.data,
                  clues: clues.filter((c: Clue) => c.id !== clueId),
                },
              };
            }
          }
          return node;
        });

        // Adicionar a pista ao grupo de destino
        if (clueToMove) {
          return updatedNodes.map((node) => {
            if (node.id === toGroupId) {
              const clues = (node.data as any).clues || [];
              return {
                ...node,
                data: {
                  ...node.data,
                  clues: [...clues, { ...clueToMove, groupId: toGroupId }],
                },
              };
            }
            return node;
          });
        }

        return updatedNodes;
      });
    },
    [setNodes]
  );

  const handleAddClue = useCallback(
    (
      groupId: string,
      clue: Omit<Clue, "id" | "groupId" | "order" | "createdAt" | "updatedAt">
    ) => {
      const newClue: Clue = {
        ...clue,
        id: `clue-${Date.now()}`,
        groupId,
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === groupId) {
            const currentClues = (node.data.clues as any[]) || [];
            return {
              ...node,
              data: {
                ...node.data,
                clues: [...currentClues, newClue],
              },
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // Guardar coordenadas absolutas de tela; screenToFlowPosition espera coords relativas à janela
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current) {
      setDraggedNode(
        event.active.data.current as {
          id: string;
          type: string;
          label: string;
          icon: React.ReactNode;
          color: string;
        }
      );
    }

    const activator = event.activatorEvent as MouseEvent | undefined;
    if (activator?.clientX != null && activator?.clientY != null) {
      setPointerPos({ x: activator.clientX, y: activator.clientY });
    }
    const handlePointerMove = (e: PointerEvent) => {
      setPointerPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("pointermove", handlePointerMove);
    // Store remover on window for cleanup on drop
    (window as any)._rf_handlePointerMove = handlePointerMove;
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active } = event;
    setDraggedNode(null);

    // Se não há active.data.current, não é um item do toolbox
    if (!active.data.current) return;

    // Se não há reactFlowInstance, não podemos calcular a posição
    if (!reactFlowInstance) return;

    const bounds = reactFlowWrapper.current?.getBoundingClientRect();
    if (!bounds) return;
    const clientX = pointerPos?.x ?? mousePosition.x;
    const clientY = pointerPos?.y ?? mousePosition.y;
    // Converter coordenadas de tela -> posição no flow
    const position = reactFlowInstance.screenToFlowPosition({
      x: clientX - bounds.left,
      y: clientY - bounds.top,
    });

    // Cleanup pointer listener
    const stored = (window as any)._rf_handlePointerMove as (
      e: PointerEvent
    ) => void;
    if (stored) {
      window.removeEventListener("pointermove", stored);
      (window as any)._rf_handlePointerMove = null;
    }
    setPointerPos(null);

    const newNode: Node = {
      id: `group-${Date.now()}`,
      type: active.data.current.type,
      position,
      data: {
        label: active.data.current.label,
        description: `Nova categoria de ${active.data.current.label.toLowerCase()}`,
        color: active.data.current.color,
        icon: active.data.current.icon,
        clues: [],
      },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="flex h-full min-h-0">
        {/* Toolbox */}
        <div className="w-64 bg-muted/50 p-4 border-r">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Ferramentas de Investigação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground">
                  Categorias
                </h4>

                <span className="text-xs text-muted-foreground">
                  Arraste e solte para adicionar uma nova categoria
                </span>
                {investigationTypes.map((nodeType) => (
                  <InvestigationToolbox
                    key={nodeType.id}
                    id={nodeType.id}
                    type={nodeType.type}
                    label={nodeType.label}
                    icon={nodeType.icon}
                    color={nodeType.color}
                  />
                ))}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground">
                  Tipos de Pistas
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 p-2 rounded border text-xs">
                    <FileText className="h-3 w-3 text-blue-600" />
                    Texto
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded border text-xs">
                    <Image className="h-3 w-3 text-green-600" />
                    Imagem
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded border text-xs">
                    <Video className="h-3 w-3 text-purple-600" />
                    Vídeo
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded border text-xs">
                    <Volume2 className="h-3 w-3 text-orange-600" />
                    Áudio
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Flow Canvas */}
        <DndContext
          sensors={useSensors(
            useSensor(PointerSensor, {
              activationConstraint: {
                distance: 8,
              },
            })
          )}
          collisionDetection={closestCenter}
          onDragStart={({ active }) => {
            setDraggedItem(String(active.id));
            // Adicionar cursor de arrastar ao body durante o drag
            document.body.style.cursor = "grabbing";
          }}
          onDragCancel={() => {
            setDraggedItem(null);
            // Restaurar cursor normal em caso de cancelamento
            document.body.style.cursor = "";
          }}
          onDragEnd={({ active, over }) => {
            setDraggedItem(null);
            // Restaurar cursor normal
            document.body.style.cursor = "";

            if (!over) return;

            const activeId = String(active.id);
            const overId = String(over.id);

            // Se está arrastando para o mesmo item, não faz nada
            if (activeId === overId) return;

            // Encontrar os grupos de origem e destino
            const sourceGroup = nodes.find((node) =>
              (node.data as any).clues?.some((c: any) => c.id === activeId)
            );

            let targetGroup = nodes.find((node) =>
              (node.data as any).clues?.some((c: any) => c.id === overId)
            );

            // Se não encontrou o grupo pelo clue, verifica se é uma zona de drop vazia
            if (!targetGroup && overId.startsWith("empty-")) {
              const groupId = overId.replace("empty-", "");
              targetGroup = nodes.find((node) => node.id === groupId);
            }

            if (sourceGroup && targetGroup) {
              if (sourceGroup.id !== targetGroup.id) {
                // Movimento entre categorias diferentes
                handleMoveClue(activeId, sourceGroup.id, targetGroup.id);
              } else {
                // Reordenação dentro da mesma categoria
                const currentIds = ((sourceGroup.data as any).clues || []).map(
                  (c: any) => c.id
                );
                const from = currentIds.indexOf(activeId);
                const to = currentIds.indexOf(overId);

                if (from !== -1 && to !== -1) {
                  const reordered = [...currentIds];
                  const [moved] = reordered.splice(from, 1);
                  reordered.splice(to, 0, moved);
                  handleReorderClues(sourceGroup.id, reordered);
                }
              }
            }
          }}
        >
          <SortableContext
            items={nodes.flatMap((node) =>
              ((node.data as any).clues || []).map((clue: any) => clue.id)
            )}
            strategy={verticalListSortingStrategy}
          >
            <DroppableReactFlow onMouseMove={handleMouseMove}>
              <div ref={reactFlowWrapper} className="w-full h-full min-h-0">
                <ReactFlow
                  nodes={nodes.map((node) => ({
                    ...node,
                    data: {
                      ...node.data,
                      onDeleteGroup: handleDeleteGroup,
                      onDeleteClue: handleDeleteClue,
                      onAddClue: handleAddClue,
                      onReorderClues: handleReorderClues,
                      onMoveClue: handleMoveClue,
                      groupId: node.id,
                      draggedItem: draggedItem,
                    },
                  }))}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onEdgeClick={onEdgeClick}
                  onInit={setReactFlowInstance}
                  nodeTypes={nodeTypes}
                  fitView={false}
                  className="bg-background"
                  defaultEdgeOptions={{
                    type: "smoothstep",
                    style: {
                      strokeWidth: 2,
                    },
                    markerEnd: {
                      type: "arrowclosed",
                    },
                  }}
                >
                  <Controls />
                  <MiniMap />
                  <Background
                    variant={BackgroundVariant.Dots}
                    gap={12}
                    size={1}
                  />
                </ReactFlow>
              </div>
            </DroppableReactFlow>
          </SortableContext>

          <DragOverlay>
            {draggedItem
              ? (() => {
                  // Encontrar a pista sendo arrastada
                  const draggedClue = nodes
                    .flatMap((node) => (node.data as any).clues || [])
                    .find((clue: any) => clue.id === draggedItem);

                  return (
                    <div className="bg-white border-2 border-blue-500 rounded-lg shadow-xl p-3 opacity-95 min-w-[200px]">
                      <div className="flex items-start gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded mt-0.5"></div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-gray-800">
                            {draggedClue?.title || "Pista"}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {draggedClue?.content || "Movendo pista..."}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()
              : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Delete Connection Modal */}
      <DeleteConnectionModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConnection}
        connectionLabel={deleteModal.edge?.label as string}
        sourceNode={deleteModal.edge?.source}
        targetNode={deleteModal.edge?.target}
      />

      <DragOverlay>
        {draggedNode ? (
          <div className="opacity-50">
            <InvestigationToolbox
              id={draggedNode.id}
              type={draggedNode.type}
              label={draggedNode.label}
              icon={draggedNode.icon}
              color={draggedNode.color}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

const InvestigationCanvasWithProvider = () => (
  <ReactFlowProvider>
    <InvestigationCanvas />
  </ReactFlowProvider>
);

export default InvestigationCanvasWithProvider;
