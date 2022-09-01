import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../../services/store.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/product.model';

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
  categories: Category[] = [];
  mobileMenuActive: boolean = false;
  counter = 0;

  constructor(
    private storeService: StoreService,
    private categorySrv: CategoryService
  ) {}

  ngOnInit(): void {
    this.storeService.myCart$.subscribe((products) => {
      this.counter = products.length;
    });

    this.categorySrv.getAll().subscribe((data) => {
      this.categories = data;
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
