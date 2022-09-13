import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { WishlistedProduct } from 'src/app/models/product.model';

@Component({
  selector: 'app-wish-item',
  templateUrl: './wish-item.component.html',
  styleUrls: ['./wish-item.component.scss'],
})
export class WishItemComponent {
  @Output() deleteWish = new EventEmitter<number>();
  @Output() addToCart = new EventEmitter<number>();
  @Input() wish: WishlistedProduct;

  constructor() {
    this.wish = {
      id: 0,
      name: '',
      description: '',
      added_at: '9999-01-01',
      price: 0,
      rating: { rate: 0, count: 0 },
    };
  }

  onAddtoCart() {
    this.addToCart.emit(this.wish.id);
  }

  onDeleteWish() {
    this.deleteWish.emit(this.wish.id);
  }
}
