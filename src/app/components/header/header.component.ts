// src/app/components/header/header.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  cartItemCount: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.getCartItemCount().subscribe(count => {
      console.log('Cart count updated:', count); // Debug log
      this.cartItemCount = count;
    });
  }
}