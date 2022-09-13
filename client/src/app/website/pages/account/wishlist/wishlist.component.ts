import { Component, OnInit } from '@angular/core';
import { WishlistedProduct } from 'src/app/models/product.model';
import { StoreService } from 'src/app/services/store.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { Product } from 'src/app/models/product.model';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit {
  isLoading: boolean = true;
  total_wishes = 0;
  wishes: WishlistedProduct[] = [];
  constructor(
    private snakbarSrv: SnackbarService,
    private wishlistSrv: WishlistService,
    private storeSrv: StoreService
  ) {}

  ngOnInit(): void {
    this.wishlistSrv.myTotalWishes$.subscribe((total) => {
      this.total_wishes = total;
    });

    this.wishlistSrv.getWishes().subscribe({
      next: (resp) => {
        this.wishes = resp.data;
        this.isLoading = false;
      },
      error: (e) => {
        let msg = 'Try it again later';
        if (e.status != 0) {
          msg = e.error.message;
        }
        this.snakbarSrv.showErrorToast(msg);
      },
    });
  }

  remove(id: number) {
    this.wishlistSrv.deleteWish(id).subscribe((resp) => {
      const idx = this.wishes.findIndex((e) => e.id == id);
      if (idx >= 0) {
        this.wishes.splice(idx, 1);
      }
    });
  }

  onAddToShoppingCart(product: WishlistedProduct) {
    this.storeSrv.addProduct(product);
  }
}
