import { FileText, Image, Video, Volume2 } from "lucide-react";
import type { MediaType } from "@/types/investigation";

interface MediaIconProps {
  type: MediaType;
  className?: string;
}

const mediaIcons = {
  text: FileText,
  image: Image,
  video: Video,
  audio: Volume2,
};

const mediaColors = {
  text: "text-blue-600",
  image: "text-green-600",
  video: "text-purple-600",
  audio: "text-orange-600",
};

export const MediaIcon = ({ type, className = "w-4 h-4" }: MediaIconProps) => {
  const Icon = mediaIcons[type];
  const colorClass = mediaColors[type];

  return <Icon className={`${className} ${colorClass}`} />;
};
