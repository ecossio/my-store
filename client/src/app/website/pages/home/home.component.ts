import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/product.model';
import { ProductsService } from '../../../services/products.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isLoadingMore: boolean | null = false;
  products: Product[] = [];
  productId: string | null = null;
  // Pagination params
  limit = 10;
  offset = 0;

  constructor(
    private productsSrv: ProductsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.onLoadMore();

    // Leer los query params de la url
    this.route.queryParamMap.subscribe((params) => {
      this.productId = params.get('product');
    });
  }

  onLoadMore() {
    this.isLoadingMore = true;
    this.productsSrv.getAll(this.limit, this.offset).subscribe({
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
