import { Component, OnInit } from '@angular/core';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-account-layout',
  templateUrl: './account-layout.component.html',
  styleUrls: ['./account-layout.component.scss'],
})
export class AccountLayoutComponent implements OnInit {
  totalWishes = 0;
  constructor(private wishlistSrv: WishlistService) {}

  ngOnInit(): void {
    this.wishlistSrv.myTotalWishes$.subscribe((count) => {
      this.totalWishes = count;
    });
  }
}
