// src/app/components/product-card/product-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(private cartService: CartService) {}

  addToCart(): void {
    console.log('Adding to cart:', this.product); // Debug log
    this.cartService.addToCart(this.product);
  }
}