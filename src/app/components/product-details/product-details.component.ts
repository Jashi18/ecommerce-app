import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.component.html',
  styles: [`
    .product-details-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .back-button {
      margin-bottom: 2rem;
      padding: 0.5rem 1rem;
      border: none;
      background: #f0f0f0;
      cursor: pointer;
      border-radius: 4px;
    }

    .product-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    .product-image img {
      max-width: 100%;
      height: auto;
    }

    .product-info h1 {
      margin-bottom: 1rem;
      font-size: 2rem;
    }

    .price {
      font-size: 1.5rem;
      font-weight: bold;
      color: #2c3e50;
      margin: 1rem 0;
    }

    .rating {
      margin: 1rem 0;
    }

    .rating span {
      margin-right: 1rem;
    }

    .category {
      color: #666;
      margin-bottom: 1rem;
    }

    .description {
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .add-to-cart-btn {
      padding: 0.8rem 1.5rem;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .loading, .error {
      text-align: center;
      padding: 2rem;
    }

    .error {
      color: red;
    }

    @media (max-width: 768px) {
      .product-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadProduct(id);
    });
  }

  private loadProduct(id: number) {
    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load product details';
        this.loading = false;
        console.error('Error loading product:', error);
      }
    });
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product);
    }
  }

  editProduct() {
    if (this.product) {
      const updatedProduct = {
        ...this.product,
        price: this.product.price + 10
      };
      
      this.productService.updateProduct(this.product.id, updatedProduct).subscribe({
        next: () => {
          console.log('Product updated successfully');
          this.loadProduct(this.product!.id);
        },
        error: (error) => console.error('Error updating product:', error)
      });
    }
  }

  deleteProduct() {
    if (this.product) {
      if (confirm('Are you sure you want to delete this product?')) {
        this.productService.deleteProduct(this.product.id).subscribe({
          next: () => {
            console.log('Product deleted successfully');
            this.router.navigate(['/']);
          },
          error: (error) => console.error('Error deleting product:', error)
        });
      }
    }
  }
}