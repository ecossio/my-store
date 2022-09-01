import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpStatusCode,
} from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
} from '../models/product.model';
import { environment } from './../../environments/environment';
import { throwError, zip } from 'rxjs';
import { checkTime } from '../interceptors/time.interceptor';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  // Se puede utilizar un proxy (proxy.config.json) para evitar el problema de CORS en modo desarrollo, esto NO funciona en modo Producción.
  // Para usar el proxy se creo una tarea en package.json llamada start:proxy, esa es la que habria que ejecutar para usar el proxy: npm run start:proxy

  // private apiUrl = 'https://young-sands-07814.herokuapp.com/api/products';

  private apiUrl = `${environment.API_URL}/api`;

  constructor(private http: HttpClient) {}

  getByCategory(categoryId: string, limit?: number, offset?: number) {
    let params = new HttpParams();
    if (limit != undefined && offset != undefined) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }

    /**
     * Podemos habilitar o deshabilitar un interceptor de acuerdo a un contexto (context),
     * de esta forma podemos decidir especificamente a que peticiones se aplica el interceptor
     */
    return this.http
      .get<Product[]>(`${this.apiUrl}/categories/${categoryId}/products`, {
        params,
      })
      .pipe(retry(2));
  }

  getAll(limit?: number, offset?: number) {
    let params = new HttpParams();

    if (limit != undefined && offset != undefined) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }

    /**
     * Podemos habilitar o deshabilitar un interceptor de acuerdo a un contexto (context),
     * de esta forma podemos decidir especificamente a que peticiones se aplica el interceptor
     */

    return this.http
      .get<ApiResponse<Product[]>>(`${this.apiUrl}/products`, {
        params,
        context: checkTime(),
      })
      .pipe(retry(2));
  }

  // Ejemplo de multiples llamadas sin dependencia para evitar el "callback hell"
  fetchReadAndUpdate(id: number, dto: UpdateProductDTO) {
    return zip(this.getProduct(id), this.update(id, dto));
  }

  getProduct(id: number) {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/products/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        let message: string = '';
        switch (error.status) {
          case HttpStatusCode.InternalServerError:
            message = 'Error interno del servidor';
            break;
          case HttpStatusCode.NotFound:
            message = 'El producto no existe';
            break;
          case HttpStatusCode.Unauthorized:
            message = 'No estás autenticado';
            break;
          default:
            message = 'Ocurrio un error';
        }

        return throwError(() => message);
      })
    );
  }

  getProductsByPage(limit: number, offset: number) {
    return this.http.get<Product[]>(`${this.apiUrl}/products`, {
      params: { limit, offset },
    });
  }

  create(dto: CreateProductDTO) {
    return this.http.post<Product>(this.apiUrl, dto);
  }

  update(id: number, dto: UpdateProductDTO) {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, dto);
  }

  delete(id: number) {
    return this.http.delete<boolean>(`${this.apiUrl}/products/${id}`);
  }
}
