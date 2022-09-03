import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WishlistService } from '../../../services/wishlist.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent {
  @Output() addedProduct = new EventEmitter<Product>();
  // @Output() showProduct = new EventEmitter<number>();

  @Input() product: Product = {
    id: 0,
    name: '',
    description: '',
    categories: [],
    price: 0,
    images: [],
    rating: { rate: 0, count: 0 },
  };

  constructor(private wishlistSrv: WishlistService) {}

  onAddtoShoppingCart() {
    this.addedProduct.emit(this.product);
  }

  addToWishlist() {
    this.wishlistSrv.addWish(this.product.id).subscribe({
      next: (resp) => {},
      error: (e) => {

      },
    });
  }
  /*
  onShowDetails() {
    this.showProduct.emit(this.product.id);
  }*/
}
