// src/app/components/cart/cart.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CartItem, CartItemWithDetails } from '../../models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItemWithDetails[] = [];
  loading = true;
  error = '';
  total = 0;

  constructor(
    private cartService: CartService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadCartItems();
  }

  private loadCartItems() {
    this.cartService.getCartItems().subscribe((items: CartItem[]) => {
      if (items.length === 0) {
        this.loading = false;
        return;
      }

      this.productService.getProducts().subscribe({
        next: (products) => {
          this.cartItems = items.map(item => {
            const product = products.find(p => p.id === item.productId);
            return {
              productId: item.productId,
              quantity: item.quantity,
              product,
              subtotal: (product?.price || 0) * item.quantity
            };
          });
          this.calculateTotal();
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load cart items';
          this.loading = false;
          console.error('Error loading products:', error);
        }
      });
    });
  }

  updateQuantity(item: CartItemWithDetails, newQuantity: number) {
    if (item.product) {
      this.cartService.updateQuantity(item.productId, newQuantity);
    }
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  private calculateTotal() {
    this.total = this.cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  }
}