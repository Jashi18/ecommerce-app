// src/app/components/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
        console.log('Products loaded:', products); // Add this to debug
      },
      error: (error) => {
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
        console.error('Error fetching products:', error);
      }
    });
  }
}