import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          opacity: 1,
          visibility: 'visible',
          transform: 'scale(1)',
        })
      ),
      state(
        'closed',
        style({
          opacity: 0,
          visibility: 'hidden',
          transform: 'scale(0.8)',
        })
      ),
      transition('open => closed', [animate('100ms ease-out')]),
      transition('closed => open', [animate('75ms ease-out')]),
    ]),
  ],
})
export class ProfileMenuComponent implements OnInit {
  userMenuActive: boolean = false;
  totalWishes: number = 0;

  constructor(
    private authSrv: AuthService,
    private wishlistSrv: WishlistService
  ) {}

  ngOnInit(): void {
    this.wishlistSrv.myTotalWishes$.subscribe((count) => {
      this.totalWishes = count;
    });
  }

  toggleUserMenu() {
    this.userMenuActive = !this.userMenuActive;
  }

  clickOutsideUserMenuButton() {
    if (this.userMenuActive) {
      this.userMenuActive = false;
    }
  }

  SignOut(): void {
    this.authSrv.logout();
  }
}
