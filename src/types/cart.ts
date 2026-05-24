export interface CartItem {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  total: number;
}