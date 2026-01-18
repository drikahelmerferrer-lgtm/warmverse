
export enum OrderStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  ADJUSTING = 'ADJUSTING',
  COMPLETED = 'COMPLETED'
}

export interface SongOrder {
  id: string;
  theme: string;
  occasion: string;
  style: string;
  names: string;
  feelings: string;
  status: OrderStatus;
  createdAt: string;
  audioUrl?: string;
}

export interface User {
  name: string;
  whatsapp: string;
}
