import { useDraggable } from "@dnd-kit/core";
import { Card, CardContent } from "@/components/ui/card";

interface InvestigationToolboxProps {
  id: string;
  type: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const InvestigationToolbox = ({
  id,
  type,
  label,
  icon,
  color,
}: InvestigationToolboxProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: {
        id,
        type,
        label,
        icon,
        color,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <Card className="w-full h-16 sm:h-20 lg:h-24 hover:shadow-md transition-shadow">
        <CardContent className="p-2 sm:p-3 flex flex-col items-center justify-center h-full">
          <div
            className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full ${color} flex items-center justify-center mb-1 sm:mb-2`}
          >
            {icon}
          </div>
          <span className="text-xs font-medium text-center leading-tight">
            {label}
          </span>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestigationToolbox;
