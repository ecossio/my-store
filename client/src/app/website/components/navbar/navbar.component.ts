import { Component, OnInit } from '@angular/core';
import { ShopingCartService } from '../../../services/shoping-cart.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/product.model';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
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
export class NavbarComponent implements OnInit {
  user: User | null = null;
  categories: Category[] = [];
  mobileMenuActive: boolean = false;
  counter = 0;

  constructor(
    private storeService: ShopingCartService,
    private categorySrv: CategoryService,
    private authSrv: AuthService
  ) {}

  ngOnInit(): void {
    this.storeService.myCart$.subscribe((products) => {
      this.counter = products.length;
    });

    this.authSrv.user$.subscribe({
      next: (user) => {
        this.user = user;
      },
    });

    this.categorySrv.getAll().subscribe((categories) => {
      this.categories = categories.data;
    });
  }

  OpenMobileMenu() {
    this.mobileMenuActive = !this.mobileMenuActive;
  }

  clickOutsideUserMenuButton() {
    if (this.mobileMenuActive) {
      this.mobileMenuActive = false;
    }
  }
}
