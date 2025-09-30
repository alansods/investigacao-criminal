import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Image, Video, Volume2 } from "lucide-react";
import type { MediaType } from "@/types/investigation";

interface AddClueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clue: {
    title: string;
    content: string;
    mediaType: MediaType;
  }) => void;
}

export const AddClueModal = ({
  isOpen,
  onClose,
  onSave,
}: AddClueModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaType, setMediaType] = useState<MediaType>("text");

  const handleSave = () => {
    if (title.trim()) {
      onSave({ title: title.trim(), content: content.trim(), mediaType });
      setTitle("");
      setContent("");
      setMediaType("text");
      onClose();
    }
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setMediaType("text");
    onClose();
  };

  const getMediaIcon = (type: MediaType) => {
    switch (type) {
      case "text":
        return <FileText className="h-4 w-4" />;
      case "image":
        return <Image className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "audio":
        return <Volume2 className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[425px] sm:max-w-[500px] lg:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            Adicionar Nova Pista
          </DialogTitle>
          <DialogDescription className="text-sm">
            Preencha os dados da nova pista para adicionar ao grupo de
            investigação.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-1 sm:space-y-2">
            <label htmlFor="title" className="text-xs sm:text-sm font-medium">
              Título da Pista
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da pista"
              className="w-full text-sm"
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label htmlFor="content" className="text-xs sm:text-sm font-medium">
              Conteúdo{" "}
              <span className="text-xs text-muted-foreground">(opcional)</span>
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Descreva os detalhes da pista"
              className="w-full min-h-[80px] sm:min-h-[100px] text-sm resize-none"
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label
              htmlFor="mediaType"
              className="text-xs sm:text-sm font-medium"
            >
              Tipo de Mídia
            </label>
            <Select
              value={mediaType}
              onValueChange={(value: MediaType) => setMediaType(value)}
            >
              <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder="Selecione o tipo de mídia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">
                  <div className="flex items-center gap-2">
                    {getMediaIcon("text")}
                    <span className="text-sm">Texto</span>
                  </div>
                </SelectItem>
                <SelectItem value="image">
                  <div className="flex items-center gap-2">
                    {getMediaIcon("image")}
                    <span className="text-sm">Imagem</span>
                  </div>
                </SelectItem>
                <SelectItem value="video">
                  <div className="flex items-center gap-2">
                    {getMediaIcon("video")}
                    <span className="text-sm">Vídeo</span>
                  </div>
                </SelectItem>
                <SelectItem value="audio">
                  <div className="flex items-center gap-2">
                    {getMediaIcon("audio")}
                    <span className="text-sm">Áudio</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto text-sm"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title.trim()}
            className="w-full sm:w-auto text-sm"
          >
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
