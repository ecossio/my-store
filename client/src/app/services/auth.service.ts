import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Auth } from '../models/auth.model';
import { Credentials, User } from '../models/user.model';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { TokenService, LS_DATA_KEY } from './token.service';
import { LocalStorageService } from './local-storage.service';
import { environment } from './../../environments/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.API_URL}`;
  // Patron Observable para el usuario autenticado
  private user = new BehaviorSubject<User | null>(null);
  user$ = this.user.asObservable();

  constructor(
    private http: HttpClient,
    private tokenSrv: TokenService,
    private lsSrv: LocalStorageService
  ) {}

  getCSRFCookie() {
    // /sanctum/csrf-cookie
    return this.http.get(`${this.apiUrl}/sanctum/csrf-cookie`);
  }

  login(credentials: Credentials) {
    return this.getCSRFCookie().pipe(
      switchMap(() =>
        this.http.post<Auth>(`${this.apiUrl}/sanctum/login`, credentials)
      ),
      tap((response) => {
        if (response && response.hasOwnProperty('access_token')) {
          this.tokenSrv.saveToken(response.access_token);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        let message: string = '';
        switch (error.status) {
          case HttpStatusCode.InternalServerError:
            message = 'Error interno del servidor';
            break;
          case HttpStatusCode.Unauthorized:
            message = 'Credenciales incorrectas';
            break;
          default:
            message = 'Ocurrio un error';
        }

        return throwError(() => message);
      })
    );
  }

  getProfile(): Observable<ApiResponse<User>> {
    let myObservable = new Observable<ApiResponse<User>>();
    let lsData = this.lsSrv.getJsonValue(LS_DATA_KEY);

    if (this.isAuth()) {
      myObservable = new Observable<ApiResponse<User>>((subscriber) => {
        subscriber.next({ data: lsData.user });
        this.user.next(lsData.user);
      });
    } else {
      myObservable = this.http
        .get<ApiResponse<User>>(`${this.apiUrl}/api/users/me`)
        .pipe(
          tap((resp) => {
            const user = resp.data;
            this.updateUserProfileLS(user);
          }),
          catchError((e: HttpErrorResponse) => {
            let message: string = '';
            if (e.status == 401 || e.status == 419) {
              message = 'No estás autenticado';
              this.tokenSrv.remove();
            } else {
              message = e.error.message;
            }
            return throwError(() => message);
          })
        );
    }

    return myObservable;
  }

  loginAndGet(credentials: Credentials) {
    return this.login(credentials).pipe(switchMap(() => this.getProfile()));
  }

  logout() {
    this.http
      .post(`${this.apiUrl}/sanctum/logout`, {})
      .pipe(
        tap(() => {
          this.tokenSrv.remove();
          this.user.next(null);
        }),
        catchError((error: HttpErrorResponse) => {
          this.tokenSrv.remove();
          this.user.next(null);
          return throwError(() => error);
        })
      )
      .subscribe();
  }

  isAuth() {
    return this.lsSrv.existsAndHasProperty(LS_DATA_KEY, 'user') ? true : false;
  }

  /**
   * Update user data in local storage
   * @param user
   */
  updateUserProfileLS(user: User): void {
    let lsData = this.lsSrv.getJsonValue(LS_DATA_KEY);
    if (lsData) {
      lsData.user = user;
    } else {
      lsData = { user };
    }

    this.lsSrv.setJsonValue(LS_DATA_KEY, lsData);
    this.user.next(user);
  }
}
