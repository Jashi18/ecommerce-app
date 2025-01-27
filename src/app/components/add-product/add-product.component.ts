import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {
  product = {
    title: '',
    price: 0,
    description: '',
    image: '',
    category: '',
    rating: {
      rate: 0,
      count: 0
    }
  };
  loading = false;
  error = '';
  successMessage = '';

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  addProduct() {
    this.loading = true;
    this.error = '';
    this.successMessage = '';

    const productToAdd = {
      ...this.product,
      rating: {
        rate: 0,
        count: 0
      }
    };

    this.productService.addProduct(productToAdd).subscribe({
      next: (response) => {
        const productWithRating = {
          ...response,
          rating: response.rating || {
            rate: 0,
            count: 0
          }
        };
        console.log('Product added:', productWithRating);
        this.loading = false;
        this.successMessage = 'Product added successfully!';
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      },
      error: (error) => {
        this.error = 'Failed to add product';
        this.loading = false;
        console.error('Error adding product:', error);
      }
    });
  }
}