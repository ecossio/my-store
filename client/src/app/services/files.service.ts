import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { map, tap } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { HttpHeaders } from '@angular/common/http';

interface File {
  originalname: string;
  filename: string;
  location: string;
}

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  private apiUrl = `${environment.API_URL}/api/files`;

  constructor(private http: HttpClient) {}

  getFile(name: string, url: string, type: string) {
    return this.http.get(url, { responseType: 'blob' }).pipe(
      tap((content) => {
        const blob = new Blob([content], { type });
        saveAs(blob, name);
      }),
      map(() => true)
    );
  }

  uploadFile(file: Blob) {
    const dto = new FormData();
    dto.append('file', file);

    // Hay API's que requieren añadir el header Content-type
    /*const headers = new HttpHeaders().set(
      'Content-type',
      'multipart/form-data'
    );
    return this.http.post(`${this.apiUrl}/upload`, dto, { headers });*/

    return this.http.post<File>(`${this.apiUrl}/upload`, dto);
  }
}
