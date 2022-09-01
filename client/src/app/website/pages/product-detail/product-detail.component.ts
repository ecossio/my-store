import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { Product } from '../../../models/product.model';
import { ProductsService } from '../../../services/products.service';
import Swiper, { Lazy, Navigation, Pagination } from 'swiper';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  productId: string | null = null;
  product: Product | null = null;

  constructor(
    private route: ActivatedRoute,
    private productsSev: ProductsService,
    private location: Location
  ) {}

  ngOnInit(): void {
    Swiper.use([Navigation, Pagination, Lazy]);

    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.productId = params.get('id');
          if (this.productId) {
            return this.productsSev.getProduct(Number(this.productId));
          } else {
            return [null];
          }
        })
      )
      .subscribe((data) => {
        this.product = data ? data.data : null;
      });
  }

  goToBack() {
    this.location.back();
  }
}
