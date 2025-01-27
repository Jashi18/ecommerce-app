import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://fakestoreapi.com/products';
  private productsSubject = new BehaviorSubject<Product[]>([]);

  constructor(private http: HttpClient) {
    this.loadProducts();
  }

  private loadProducts() {
    this.http.get<Product[]>(this.apiUrl).subscribe(products => {
      const productsWithRating = products.map(product => ({
        ...product,
        rating: product.rating || {
          rate: 0,
          count: 0
        }
      }));
      this.productsSubject.next(productsWithRating);
    });
  }

  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      map(product => ({
        ...product,
        rating: product.rating || {
          rate: 0,
          count: 0
        }
      }))
    );
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product).pipe(
      tap(updatedProduct => {
        const products = this.productsSubject.getValue();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
          products[index] = updatedProduct;
          this.productsSubject.next([...products]);
        }
      })
    );
  }
  
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const products = this.productsSubject.getValue();
        this.productsSubject.next(products.filter(p => p.id !== id));
      })
    );
  }

  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product).pipe(
      map(newProduct => ({
        ...newProduct,
        rating: {
          rate: 0,
          count: 0
        }
      })),
      tap(newProduct => {
        const currentProducts = this.productsSubject.getValue();
        this.productsSubject.next([...currentProducts, newProduct]);
      })
    );
  }
}