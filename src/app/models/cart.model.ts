// src/app/models/cart.model.ts
import { Product } from './product.model';

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface Cart {
  userId: number;
  date: string;
  products: CartItem[];
}

export interface CartItemWithDetails extends CartItem {
  product?: Product;
  subtotal: number;
}