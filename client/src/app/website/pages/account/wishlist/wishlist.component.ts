import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit {
  wishes: Product[] = [];
  constructor(private wishlistSrv: WishlistService) {}

  ngOnInit(): void {
    this.wishlistSrv.getWishes().subscribe((resp) => {
      this.wishes = resp.data;
      console.log(resp.data);
    });
  }

  remove(id: number) {
    this.wishlistSrv.deleteWish(id).subscribe((resp) => {
      const idx = this.wishes.findIndex((e) => e.id == id);
      console.log(idx)
      if (idx >= 0) {
        this.wishes.splice(idx, 1);
      }
    });
  }
}
