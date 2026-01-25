
export type OrderStatus = 'pendente' | 'em andamento' | 'pronto';

export interface User {
  id: string;
  name: string;
  instagram: string;
  whatsapp: string;
  isAdmin?: boolean;
}

export interface Occasion {
  id: string;
  label: string;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  theme: string;
  occasionId: string;
  occasionLabel: string;
  price: number;
  rhythm: string;
  story: string;
  mentions?: string;
  status: OrderStatus;
  createdAt: number;
}

export type Screen = 'Login' | 'Dashboard' | 'NewMusic' | 'Admin';
