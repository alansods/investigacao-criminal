import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

export default function HelpButton({
  onClick,
  fullWidth = false,
}: {
  onClick: () => void;
  fullWidth?: boolean;
}) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={`${
        fullWidth ? "w-full" : ""
      } flex items-center justify-center gap-2 h-10 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors`}
    >
      <HelpCircle className="h-4 w-4" />
      <span className="text-sm font-medium">Ajuda</span>
    </Button>
  );
}
