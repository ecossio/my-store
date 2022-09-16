import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { zip } from 'rxjs';

import {
  CreateProductDTO,
  Product,
  UpdateProductDTO,
} from 'src/app/models/product.model';
import { ShopingCartService } from '../../../services/shoping-cart.service';
import { ProductsService } from '../../../services/products.service';
import Swiper, { Lazy, Navigation, Pagination } from 'swiper';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  @Input()
  set showButtonLoader(loader: boolean | null) {
    this.showLoader = loader;
  }

  @Input() products: Product[] = [];
  @Input()
  set productId(id: string | null) {
    if (id) {
      this.onShowDetails(Number(id));
    }
  }

  @Output() loadMore = new EventEmitter();
  showLoader: boolean | null = false;
  showProductDetails = false;
  myShoppingCart: Product[] = [];
  total: number = 0;
  productChosen: Product = {
    id: 0,
    name: '',
    description: '',
    categories: [],
    price: 0,
    images: [],
    rating: { rate: 0, count: 0 },
  };

  constructor(
    private storeService: ShopingCartService,
    private productsSrv: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    Swiper.use([Navigation, Pagination, Lazy]);
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  closeProductDetails() {
    this.showProductDetails = false;

    setTimeout(() => {
      this.productChosen.id = 0;
    }, 320);
  }

  onShowDetails(id: number) {
    // if (this.productChosen.id != id) {
    //   this.productChosen.id = 0;
    //   this.showProductDetails = false;

    //   this.productsSrv.getProduct(id).subscribe({
    //     next: (product) => {
    //       this.productChosen = { ...product };
    //       this.showProductDetails = true;
    //     },
    //     error: (errorMsg) => {
    //       window.alert(errorMsg);
    //       console.error(errorMsg);
    //     },
    //   });
    // }

    this.productsSrv.getProduct(id).subscribe({
      next: (response) => {
        this.productChosen = { ...response.data };
        this.showProductDetails = true;
      },
      error: (errorMsg) => {
        window.alert(errorMsg);
        console.error(errorMsg);
      },
    });
  }

  // Caso para mostrar como controlar el "callback hell"
  readAndUpdate(id: number) {
    // * NOTA: Se recomienda usar toda esa logica (ambos casos) en el servicio y no en el componente

    // Esto para cuando hay dependencia en las llamadas
    this.productsSrv
      .getProduct(id)
      .pipe(
        switchMap((product) =>
          this.productsSrv.update(product.data.id, { name: 'New title' })
        )
        // switchMap((product) => this.productsSrv.update(id, { name: 'New title' })),
        // switchMap((product) => this.productsSrv.update(id, { name: 'New title' }))
      )
      .subscribe((data) => {
        console.log(data);
      });

    // Esto para cuando no hay dependencia en las llamadas (fetchReadAndUpdate() en el servicio)
    zip(
      this.productsSrv.getProduct(id),
      this.productsSrv.update(id, { name: 'New title again' })
    ).subscribe((response) => {
      const product = response[0]; // Respuesta de getProduct()
      const update = response[1]; // Respuesta de update()
    });

    // Ejemplo haciendolo en el servicio
    this.productsSrv
      .fetchReadAndUpdate(id, { name: 'change' })
      .subscribe((response) => {
        const product = response[0]; // Respuesta de getProduct()
        const update = response[1]; // Respuesta de update()
      });
  }

  createNewProduct() {
    const product: CreateProductDTO = {
      name: 'Tenis Superstar',
      description: 'Cloud White / Cloud White / Core Black',
      price: 1000,
      images: [
        `https://placeimg.com/640/480/any?random=${Math.random()}`,
        `https://placeimg.com/640/480/any?random=${Math.random()}`,
        `https://placeimg.com/640/480/any?random=${Math.random()}`,
      ],
      categoryId: 2,
    };
    this.productsSrv.create(product).subscribe((data) => {
      this.products.unshift(data);
    });
  }

  updateProduct() {
    const changes: UpdateProductDTO = {
      name: 'Change title',
    };

    const id = this.productChosen.id;
    this.productsSrv.update(id, changes).subscribe((data) => {
      const productIndex = this.products.findIndex((e) => e.id == id);
      this.products[productIndex] = { ...data };
    });
  }

  deleteProduct() {
    const id = this.productChosen.id;
    this.productsSrv.delete(id).subscribe(() => {
      const productIndex = this.products.findIndex((e) => e.id == id);
      this.products.splice(productIndex, 1);
      this.showProductDetails = false;
    });
  }

  onLoadMore() {
    this.loadMore.emit();
  }
}
