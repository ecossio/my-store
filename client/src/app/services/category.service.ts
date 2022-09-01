import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Category } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  private apiUrl = `${environment.API_URL}/api/categories`;

  getAll(limit?: number, offset?: number) {
    let params = new HttpParams();
    if (limit != undefined && offset != undefined) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }

    return this.http.get<Category[]>(this.apiUrl, { params });
  }
}
