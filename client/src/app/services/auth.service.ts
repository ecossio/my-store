import { Injectable } from '@angular/core';
import { Auth } from '../models/auth.model';
import { Credentials, User } from '../models/user.model';
import {
  HttpClient,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { environment } from './../../environments/environment';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { BehaviorSubject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.API_URL}/api/auth`;
  // Patron Observable para el usuario autenticado
  private user = new BehaviorSubject<User | null>(null);
  user$ = this.user.asObservable();

  constructor(private http: HttpClient, private tokenSrv: TokenService) {}

  login(credentials: Credentials) {
    return this.http.post<Auth>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        this.tokenSrv.saveToken(response.access_token);
      }),
      catchError((error: HttpErrorResponse) => {
        let message: string = '';
        switch (error.status) {
          case HttpStatusCode.InternalServerError:
            message = 'Error interno del servidor';
            this.tokenSrv.remove();
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

  getProfile() {
    return this.http.get<User>(`${this.apiUrl}/profile`).pipe(
      tap((user) => {
        console.log('auth.service', user);
        this.user.next(user);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status == 401) {
          this.tokenSrv.remove();
        }
        return throwError(() => error);
      })
    );
  }

  loginAndGet(credentials: Credentials) {
    return this.login(credentials).pipe(switchMap(() => this.getProfile()));
  }

  logout() {
    this.tokenSrv.remove();
  }
}
