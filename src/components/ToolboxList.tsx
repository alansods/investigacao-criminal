import InvestigationToolbox from "./InvestigationToolbox";

interface ToolboxItem {
  id: string;
  type: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

export default function ToolboxList({
  items,
  orientation = "vertical",
}: {
  items: ToolboxItem[];
  orientation?: "vertical" | "horizontal";
}) {
  if (orientation === "horizontal") {
    return (
      <div className="-mx-2 px-2">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {items.map((nodeType) => (
            <div key={nodeType.id} className="min-w-[140px]">
              <InvestigationToolbox
                id={nodeType.id}
                type={nodeType.type}
                label={nodeType.label}
                icon={nodeType.icon}
                color={nodeType.color}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((nodeType) => (
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
  );
}
