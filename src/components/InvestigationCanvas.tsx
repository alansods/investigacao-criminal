import {
  useState,
  useCallback,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
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
  type OnConnectStartParams,
  ConnectionMode,
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
  TouchSensor,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FileText, Image, Video, Volume2, HelpCircle } from "lucide-react";
import InvestigationNode from "./InvestigationNode";
import InvestigationToolbox from "./InvestigationToolbox";
import { DeleteConnectionModal } from "./DeleteConnectionModal";
import { DuplicateConnectionModal } from "./DuplicateConnectionModal";
import { HelpModal } from "./HelpModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Clue, MediaType } from "@/types/investigation";

import "@xyflow/react/dist/style.css";

const STORAGE_KEY = "investigation-workflow-data";

const nodeTypes = {
  investigation: InvestigationNode,
};

// Função para obter ícone baseado no tipo de categoria
function getIconForCategory(label: string): React.ReactNode {
  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes("evidência") || lowerLabel.includes("evidencias")) {
    return <FileText className="w-4 h-4 text-red-600" />;
  }
  if (lowerLabel.includes("depoimento")) {
    return <Volume2 className="w-4 h-4 text-blue-600" />;
  }
  if (lowerLabel.includes("suspeito")) {
    return <Image className="w-4 h-4 text-yellow-600" />;
  }
  if (lowerLabel.includes("cronologia") || lowerLabel.includes("timeline")) {
    return <Video className="w-4 h-4 text-green-600" />;
  }
  return <FileText className="w-4 h-4 text-red-600" />;
}

// Função para serializar nodes (remove ícones React que não podem ser salvos no localStorage)
function serializeNodes(nodes: Node[]): Array<{
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
}> {
  return nodes.map((node) => {
    const { data, ...rest } = node;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { icon, clues, ...otherData } = data as {
      icon?: React.ReactNode;
      clues?: Clue[];
      [key: string]: unknown;
    };
    return {
      ...rest,
      data: {
        ...otherData,
        clues:
          clues?.map((clue: Clue) => ({
            ...clue,
            createdAt: clue.createdAt?.toISOString(),
            updatedAt: clue.updatedAt?.toISOString(),
          })) || [],
      },
    };
  });
}

// Função para deserializar nodes (reconstrói ícones baseado no label)
function deserializeNodes(
  serializedNodes: Array<{
    id: string;
    type?: string;
    position: { x: number; y: number };
    data: Record<string, unknown>;
  }>
): Node[] {
  return serializedNodes.map((node) => {
    const { data, ...rest } = node;
    const nodeData = data as {
      label?: string;
      clues?: Array<{
        id: string;
        title: string;
        content: string;
        mediaType: MediaType;
        mediaUrl?: string;
        groupId: string;
        order: number;
        createdAt?: string;
        updatedAt?: string;
      }>;
      [key: string]: unknown;
    };
    const icon = getIconForCategory(nodeData.label || "");
    return {
      ...rest,
      data: {
        ...nodeData,
        icon,
        clues:
          nodeData.clues?.map((clue) => ({
            ...clue,
            createdAt: clue.createdAt ? new Date(clue.createdAt) : new Date(),
            updatedAt: clue.updatedAt ? new Date(clue.updatedAt) : new Date(),
          })) || [],
      },
    };
  });
}

// Função para carregar dados do localStorage
function loadFromLocalStorage(): { nodes: Node[]; edges: Edge[] } | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    return {
      nodes: deserializeNodes(parsed.nodes || []),
      edges: parsed.edges || [],
    };
  } catch (error) {
    console.error("Erro ao carregar dados do localStorage:", error);
    return null;
  }
}

// Função para salvar dados no localStorage
function saveToLocalStorage(nodes: Node[], edges: Edge[]): void {
  try {
    const data = {
      nodes: serializeNodes(nodes),
      edges,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Erro ao salvar dados no localStorage:", error);
  }
}

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
function makeInitialEdge(
  source: string,
  target: string,
  sourceHandle?: string,
  targetHandle?: string
): Edge {
  const targetNode = initialNodes.find((n) => n.id === target);
  const targetLabel = (targetNode?.data as any)?.label as string | undefined;
  const targetBg = (targetNode?.data as any)?.color as string | undefined;
  const stroke = mapTailwindBgToStrokeHex(targetBg);
  return {
    id: `e-${source}-${target}`,
    source,
    target,
    sourceHandle,
    targetHandle,
    type: "smoothstep",
    label: targetLabel,
    style: {
      stroke,
      strokeWidth: 2,
    },
    markerEnd: {
      type: "arrowclosed",
      color: stroke,
      width: 20,
      height: 20,
    },
  } as Edge;
}

const initialEdges: Edge[] = [
  makeInitialEdge("group-1", "group-2", "right", "left-target"),
  makeInitialEdge("group-2", "group-3", "right", "left-target"),
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

export interface InvestigationCanvasRef {
  saveData: () => void;
}

const InvestigationCanvas = forwardRef<InvestigationCanvasRef>(
  (_props, ref) => {
    // Carregar dados do localStorage ou usar dados iniciais
    const loadedData = loadFromLocalStorage();
    const [nodes, setNodes, onNodesChange] = useNodesState(
      loadedData?.nodes || initialNodes
    );
    const [edges, setEdges, onEdgesChange] = useEdgesState(
      loadedData?.edges || initialEdges
    );
    const [reactFlowInstance, setReactFlowInstance] =
      useState<ReactFlowInstance | null>(null);
    const [draggedNode, setDraggedNode] = useState<{
      id: string;
      type: string;
      label: string;
      icon: React.ReactNode;
      color: string;
    } | null>(null);
    // Guarda informações de onde a conexão começou
    const connectStartRef = useRef<{
      nodeId: string | null;
      handleId: string | null;
      handleType: "source" | "target" | null;
    } | null>(null);
    const [draggedItem, setDraggedItem] = useState<string | null>(null);
    const [deleteModal, setDeleteModal] = useState<{
      isOpen: boolean;
      edge: Edge | null;
    }>({
      isOpen: false,
      edge: null,
    });
    const [duplicateModal, setDuplicateModal] = useState<{
      isOpen: boolean;
      sourceNodeLabel: string;
      targetNodeLabel: string;
    }>({
      isOpen: false,
      sourceNodeLabel: "",
      targetNodeLabel: "",
    });
    const [helpModal, setHelpModal] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [pointerPos, setPointerPos] = useState<{
      x: number;
      y: number;
    } | null>(null);
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [isDraggingOverCanvas, setIsDraggingOverCanvas] = useState(false);
    const [dropPosition, setDropPosition] = useState<{
      x: number;
      y: number;
    } | null>(null);

    // Expor função de salvar para o componente pai
    useImperativeHandle(ref, () => ({
      saveData: () => {
        saveToLocalStorage(nodes, edges);
      },
    }));

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
      (params: Connection) => {
        // Se a conexão começou em um handle de target, invertemos a direção
        const startedOnTarget =
          connectStartRef.current?.handleType === "target";
        const sourceId = startedOnTarget
          ? (params.target as string)
          : (params.source as string);
        const targetId = startedOnTarget
          ? (params.source as string)
          : (params.target as string);

        // Verificar se já existe uma conexão entre esses dois nodes (em qualquer direção)
        const existingConnection = edges.find(
          (edge) =>
            (edge.source === sourceId && edge.target === targetId) ||
            (edge.source === targetId && edge.target === sourceId)
        );

        if (existingConnection) {
          // Encontrar os nomes dos nodes para exibir no modal
          const sourceNode = nodes.find((n) => n.id === sourceId);
          const targetNode = nodes.find((n) => n.id === targetId);
          const sourceLabel = (sourceNode?.data as any)?.label || "Card A";
          const targetLabel = (targetNode?.data as any)?.label || "Card B";

          // Mostrar modal de aviso
          setDuplicateModal({
            isOpen: true,
            sourceNodeLabel: sourceLabel,
            targetNodeLabel: targetLabel,
          });

          // Reset ref
          connectStartRef.current = null;
          return;
        }

        setEdges((eds) => {
          const sourceHandle = startedOnTarget
            ? params.targetHandle
            : params.sourceHandle;
          const targetHandle = startedOnTarget
            ? params.sourceHandle
            : params.targetHandle;

          const targetNode = nodes.find((n) => n.id === targetId);
          const targetLabel = (targetNode?.data as any)?.label as
            | string
            | undefined;
          const targetBg = (targetNode?.data as any)?.color as
            | string
            | undefined;
          const stroke = mapTailwindBgToStrokeHex(targetBg);

          const newEdge: Edge = {
            id: `e-${sourceId}-${targetId}-${Date.now()}`,
            source: sourceId,
            target: targetId,
            sourceHandle,
            targetHandle,
            type: "smoothstep",
            label: targetLabel,
            style: { stroke, strokeWidth: 2 },
            markerEnd: {
              type: "arrowclosed",
              color: stroke,
              width: 20,
              height: 20,
            },
          } as Edge;
          // Reset ref após conectar
          connectStartRef.current = null;
          return addEdge(newEdge, eds);
        });
      },
      [setEdges, nodes, edges]
    );

    const onConnectStart = useCallback(
      (_event: MouseEvent | TouchEvent, params: OnConnectStartParams) => {
        connectStartRef.current = {
          nodeId: params.nodeId ?? null,
          handleId: params.handleId ?? null,
          handleType: params.handleType ?? null,
        };
      },
      []
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

    const closeDuplicateModal = useCallback(() => {
      setDuplicateModal({
        isOpen: false,
        sourceNodeLabel: "",
        targetNodeLabel: "",
      });
    }, []);

    const toggleHelpModal = useCallback(() => {
      setHelpModal((prev) => !prev);
    }, []);

    const handleDeleteGroup = useCallback(
      (groupId: string) => {
        setNodes((nds) => nds.filter((node) => node.id !== groupId));
        setEdges((eds) =>
          eds.filter(
            (edge) => edge.source !== groupId && edge.target !== groupId
          )
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
            return {
              ...node,
              data: { ...(node.data as any), clues: reordered },
            };
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

    const handleUpdateClue = useCallback(
      (
        groupId: string,
        clueId: string,
        updates: {
          title: string;
          content: string;
          mediaType: MediaType;
          mediaUrl?: string;
        }
      ) => {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id !== groupId) return node;
            const clues = ((node.data as any).clues || []) as Clue[];
            const updatedClues = clues.map((c) =>
              c.id === clueId
                ? {
                    ...c,
                    title: updates.title,
                    content: updates.content,
                    mediaType: updates.mediaType,
                    mediaUrl: updates.mediaUrl,
                    updatedAt: new Date(),
                  }
                : c
            );
            return {
              ...node,
              data: { ...(node.data as any), clues: updatedClues },
            };
          })
        );
      },
      [setNodes]
    );

    const handleMouseMove = useCallback(
      (e: React.MouseEvent) => {
        // Guardar coordenadas absolutas de tela; screenToFlowPosition espera coords relativas à janela
        setMousePosition({ x: e.clientX, y: e.clientY });

        // Verificar se o mouse está sobre o canvas durante o arrastar
        if (draggedNode && reactFlowWrapper.current) {
          const rect = reactFlowWrapper.current.getBoundingClientRect();
          const isOver =
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;
          setIsDraggingOverCanvas(isOver);

          if (isOver && reactFlowInstance) {
            const position = reactFlowInstance.screenToFlowPosition({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
            setDropPosition(position);
          } else {
            setDropPosition(null);
          }
        }
      },
      [draggedNode, reactFlowInstance]
    );

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
      // Ensure grabbing cursor while dragging from toolbox
      document.body.style.cursor = "grabbing";
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
      // Restore cursor
      document.body.style.cursor = "";

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
      <DndContext
        sensors={useSensors(
          useSensor(PointerSensor, {
            activationConstraint: {
              distance: 5,
            },
          }),
          useSensor(TouchSensor, {
            activationConstraint: {
              delay: 250,
              tolerance: 5,
            },
          })
        )}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={() => {
          setDraggedNode(null);
          const stored = (window as any)._rf_handlePointerMove as
            | ((e: PointerEvent) => void)
            | null;
          if (stored) {
            window.removeEventListener("pointermove", stored);
            (window as any)._rf_handlePointerMove = null;
          }
          setPointerPos(null);
          document.body.style.cursor = "";
        }}
      >
        <div
          className={`flex h-full min-h-0 touch-none ${
            isDraggingOverCanvas
              ? "bg-blue-50 ring-2 ring-blue-200 ring-opacity-50"
              : ""
          } ${draggedNode || draggedItem ? "dragging" : ""}`}
        >
          {/* Toolbox */}
          <div className="w-64 bg-muted/50 p-4 border-r flex flex-col">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="text-sm">
                  Categorias de Investigação
                </CardTitle>
                <span className="text-xs text-muted-foreground">
                  Clique e arraste as categorias para o canvas.
                </span>
              </CardHeader>

              <CardContent className="space-y-3 mt-4">
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
              </CardContent>
            </Card>

            {/* Botão de Ajuda */}
            <div className="mt-4">
              <Button
                onClick={toggleHelpModal}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 h-10 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors"
              >
                <HelpCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Ajuda</span>
              </Button>
            </div>
          </div>

          {/* Flow Canvas */}
          <DndContext
            sensors={useSensors(
              useSensor(PointerSensor, {
                activationConstraint: {
                  distance: 5,
                  delay: 0,
                  tolerance: 5,
                },
              }),
              useSensor(TouchSensor, {
                activationConstraint: {
                  delay: 200,
                  tolerance: 8,
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
                  const currentIds = (
                    (sourceGroup.data as any).clues || []
                  ).map((c: any) => c.id);
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
                        onUpdateClue: handleUpdateClue,
                        onReorderClues: handleReorderClues,
                        onMoveClue: handleMoveClue,
                        groupId: node.id,
                        draggedItem: draggedItem,
                      },
                    }))}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnectStart={onConnectStart}
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
                        width: 20,
                        height: 20,
                      },
                    }}
                    connectionMode={ConnectionMode.Strict}
                  >
                    <Controls />
                    <MiniMap />
                    <Background
                      variant={BackgroundVariant.Dots}
                      gap={12}
                      size={1}
                    />
                    {isDraggingOverCanvas && dropPosition && (
                      <div
                        className="absolute w-4 h-4 bg-blue-500 rounded-full opacity-60 pointer-events-none z-10 animate-pulse"
                        style={{
                          left: dropPosition.x - 8,
                          top: dropPosition.y - 8,
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    )}
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

        {/* Duplicate Connection Modal */}
        <DuplicateConnectionModal
          isOpen={duplicateModal.isOpen}
          onClose={closeDuplicateModal}
          sourceNodeLabel={duplicateModal.sourceNodeLabel}
          targetNodeLabel={duplicateModal.targetNodeLabel}
        />

        {/* Help Modal */}
        <HelpModal isOpen={helpModal} onClose={toggleHelpModal} />

        <DragOverlay>
          {draggedNode ? (
            <div className="bg-white border-2 border-blue-500 rounded-lg shadow-2xl p-4 opacity-95 min-w-[220px] transform rotate-3">
              <Card className="w-full h-20 shadow-lg">
                <CardContent className="p-3 flex flex-col items-center justify-center h-full">
                  <div
                    className={`w-8 h-8 rounded-full ${draggedNode.color} flex items-center justify-center mb-2`}
                  >
                    {draggedNode.icon}
                  </div>
                  <span className="text-sm font-medium text-center leading-tight">
                    {draggedNode.label}
                  </span>
                </CardContent>
              </Card>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-500"></div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    );
  }
);

InvestigationCanvas.displayName = "InvestigationCanvas";

const InvestigationCanvasWithProvider = forwardRef<InvestigationCanvasRef>(
  (_props, ref) => (
    <ReactFlowProvider>
      <InvestigationCanvas ref={ref} />
    </ReactFlowProvider>
  )
);

InvestigationCanvasWithProvider.displayName = "InvestigationCanvasWithProvider";

export default InvestigationCanvasWithProvider;
