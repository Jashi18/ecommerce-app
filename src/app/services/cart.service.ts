// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'https://fakestoreapi.com/carts';
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private userId = 5;

  constructor(private http: HttpClient) {
    // Load cart from localStorage if exists
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems.next(JSON.parse(savedCart));
    }
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  addToCart(product: Product, quantity: number = 1) {
    console.log('CartService: Adding to cart:', product); // Debug log
    const currentItems = this.cartItems.getValue();
    const existingItem = currentItems.find(item => item.productId === product.id);

    let updatedItems: CartItem[];
    if (existingItem) {
      updatedItems = currentItems.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedItems = [...currentItems, { productId: product.id, quantity }];
    }

    console.log('CartService: Updated items:', updatedItems); // Debug log
    this.cartItems.next(updatedItems);
    this.saveCart(updatedItems);
  }

  private saveCart(items: CartItem[]) {
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(items));

    // Save to API
    const cart: Cart = {
      userId: this.userId,
      date: new Date().toISOString(),
      products: items
    };

    this.http.post<Cart>(this.apiUrl, cart).subscribe({
      next: (response) => console.log('Cart saved to API:', response),
      error: (error) => console.error('Error saving cart:', error)
    });
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity < 1) return;
    
    const currentItems = this.cartItems.getValue();
    const updatedItems = currentItems.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );

    this.cartItems.next(updatedItems);
    this.saveCart(updatedItems);
  }

  removeFromCart(productId: number) {
    const currentItems = this.cartItems.getValue();
    const updatedItems = currentItems.filter(item => item.productId !== productId);

    this.cartItems.next(updatedItems);
    this.saveCart(updatedItems);
  }

  getCartItemCount(): Observable<number> {
    return new Observable<number>(subscriber => {
      this.cartItems.subscribe(items => {
        const count = items.reduce((total, item) => total + item.quantity, 0);
        subscriber.next(count);
      });
    });
  }

  clearCart() {
    this.cartItems.next([]);
    this.saveCart([]);
    localStorage.removeItem('cart');
  }
}