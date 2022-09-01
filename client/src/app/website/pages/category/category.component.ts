import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../models/product.model';
import { ProductsService } from '../../../services/products.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-category',
  template: `<app-products
    [productId]="productId"
    [products]="products"
    (loadMore)="onLoadMore()"
    [showButtonLoader]="isLoadingMore"
  ></app-products>`,
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  isLoadingMore: boolean | null = false;
  products: Product[] = [];
  categoryId: string | null = null;
  productId: string | null = null;
  limit = 10;
  offset = 0;

  constructor(
    private route: ActivatedRoute,
    private productsSrv: ProductsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.categoryId = params.get('id');
          this.limit = 10;
          this.offset = 0;
          if (this.categoryId) {
            return this.productsSrv.getByCategory(
              this.categoryId,
              this.limit,
              this.offset
            );
          } else {
            return [];
          }
        })
      )
      .subscribe((data: Product[]) => {
        this.products = data;
        this.offset += this.limit;
      });

    // Leer los query params de la url
    this.route.queryParamMap.subscribe((params) => {
      this.productId = params.get('product');
    });
  }

  onLoadMore() {
    if (this.categoryId) {
      this.isLoadingMore = true;
      this.productsSrv
        .getByCategory(this.categoryId, this.limit, this.offset)
        .subscribe({
          next: (data: Product[]) => {
            this.products = this.products.concat(data);
            this.offset += this.limit;
            this.isLoadingMore = false;
          },
          error: (e) => {
            this.isLoadingMore = false;
          },
        });
    }
  }
}
