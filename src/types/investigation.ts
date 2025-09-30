export type MediaType = 'text' | 'image' | 'video' | 'audio';

export interface Clue {
  id: string;
  title: string;
  content: string;
  mediaType: MediaType;
  mediaUrl?: string;
  groupId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

