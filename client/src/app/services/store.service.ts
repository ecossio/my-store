import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private myShoppingCart: Product[] = [];

  // Patron Observable para el carrito de compras
  private myCart = new BehaviorSubject<Product[]>([]);
  myCart$ = this.myCart.asObservable();

  constructor() {}

  getShoppingCart() {
    return this.myShoppingCart;
  }

  addProduct(product: Product) {
    this.myShoppingCart.push(product);

    // Comunicar los cambios del carrito
    this.myCart.next(this.myShoppingCart);
  }

  getTotal() {
    return this.myShoppingCart.reduce((sum, item) => sum + item.price, 0);
  }
}
