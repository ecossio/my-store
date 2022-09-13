import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, switchMap, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { WishlistedProduct } from '../models/product.model';
import { ApiResponse } from '../models/api-response.model';
import { LocalStorageService } from './local-storage.service';
import { LS_DATA_KEY } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private myWishlist: WishlistedProduct[] = [];
  private totalWishes: number = 0;

  // Patron Observable para el carrito de compras
  private myWishes = new BehaviorSubject<WishlistedProduct[]>([]);
  myWishes$ = this.myWishes.asObservable();

  private myTotalWishes = new BehaviorSubject<number>(0);
  myTotalWishes$ = this.myTotalWishes.asObservable();

  private apiUrl = `${environment.API_URL}/api/wishlists`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private lsSrv: LocalStorageService
  ) {}

  getWishes() {
    return this.http.get<ApiResponse<WishlistedProduct[]>>(this.apiUrl).pipe(
      tap((resp) => {
        this.init(resp.data);
        this.updateWishlistStorage();
      })
    );
  }

  addWish(id: number) {
    return this.http
      .post<ApiResponse<WishlistedProduct>>(this.apiUrl, { product_id: id })
      .pipe(
        tap((resp) => {
          const item = resp.data;
          const itemIdx = this.myWishlist.findIndex((i) => i.id == item.id);

          if (itemIdx < 0) {
            this.myWishlist.push(item);
            this.totalWishes++;

            // Comunicar los cambios
            this.myWishes.next(this.myWishlist);
            this.myTotalWishes.next(this.totalWishes);

            this.updateWishlistStorage();
          }
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status == 401) {
            this.router.navigate(['auth/login']);
          }

          return throwError(() => error);
        })
      );
  }

  deleteWish(id: number) {
    return this.http.delete<ApiResponse<WishlistedProduct>>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const productIdx = this.myWishlist.findIndex((i) => i.id == id);
        this.myWishlist.splice(productIdx, 0);
        this.totalWishes--;

        // Comunicar los cambios
        this.myWishes.next(this.myWishlist);
        this.myTotalWishes.next(this.totalWishes);

        this.updateWishlistStorage();
      })
    );
  }

  init(items: WishlistedProduct[]) {
    this.myWishlist = items;
    this.totalWishes = items.length;

    this.myWishes.next(this.myWishlist);
    this.myTotalWishes.next(this.totalWishes);
  }

  private updateWishlistStorage() {
    const lsData = this.lsSrv.getJsonValue(LS_DATA_KEY);
    lsData.user.wishlist.total_wishes = this.totalWishes;
    lsData.user.wishlist.items = this.myWishlist;
    this.lsSrv.setJsonValue(LS_DATA_KEY, lsData);
  }
}
