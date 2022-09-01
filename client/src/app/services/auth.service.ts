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
import { TokenService, LS_DATA_KEY } from './token.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.API_URL}/api/auth`;
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
    return this.http.get(`${environment.API_URL}/sanctum/csrf-cookie`);
  }

  login(credentials: Credentials) {
    return this.getCSRFCookie().pipe(
      switchMap(() =>
        this.http.post<Auth>(
          `${environment.API_URL}/sanctum/login`,
          credentials
        )
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

    // return this.http.post<Auth>(`${this.apiUrl}/login`, credentials).pipe(
    //   tap((response) => {
    //     this.tokenSrv.saveToken(response.access_token);
    //   }),
    //   catchError((error: HttpErrorResponse) => {
    //     let message: string = '';
    //     switch (error.status) {
    //       case HttpStatusCode.InternalServerError:
    //         message = 'Error interno del servidor';
    //         this.tokenSrv.remove();
    //         break;
    //       case HttpStatusCode.NotFound:
    //         message = 'El producto no existe';
    //         break;
    //       case HttpStatusCode.Unauthorized:
    //         message = 'No estás autenticado';
    //         break;
    //       default:
    //         message = 'Ocurrio un error';
    //     }

    //     return throwError(() => message);
    //   })
    // );
  }

  getProfile(): Observable<User> {
    let myObservable = new Observable<User>();
    let lsData = this.lsSrv.getJsonValue(LS_DATA_KEY);

    if (this.lsSrv.existsAndHasProperty(LS_DATA_KEY, 'user')) {
      console.log('NO hizo request', lsData);
      myObservable = new Observable<User>((subscriber) => {
        subscriber.next(lsData.user);
        this.user.next(lsData.user);
      });
    } else {
      console.log('Hizo request', lsData);
      myObservable = this.http.get<User>(`${this.apiUrl}/me`).pipe(
        tap((user) => {
          if (lsData) {
            lsData.user = user;
          } else {
            lsData = { user };
          }

          this.lsSrv.setJsonValue(LS_DATA_KEY, lsData);
          this.user.next(user);
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

    // return this.http.get<User>(`${this.apiUrl}/me`).pipe(
    //   tap((user) => {
    //     const lsData = this.lsSrv.getJsonValue(LS_DATA_KEY);
    //     if (this.lsSrv.exists(LS_DATA_KEY) && !lsData.hasOwnProperty('user')) {
    //       lsData.user = user;
    //       this.lsSrv.setJsonValue(LS_DATA_KEY, lsData);
    //     }

    //     this.user.next(user);
    //   }),
    //   catchError((error: HttpErrorResponse) => {
    //     if (error.status == 401) {
    //       this.tokenSrv.remove();
    //     }
    //     return throwError(() => error);
    //   })
    // );
  }

  loginAndGet(credentials: Credentials) {
    return this.login(credentials).pipe(switchMap(() => this.getProfile()));
  }

  logout() {
    this.http
      .post(`${environment.API_URL}/sanctum/logout`, {})
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
}
