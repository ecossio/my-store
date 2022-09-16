import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpContext,
  HttpContextToken,
} from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

const PUBLIC_ENDPOINT = new HttpContextToken<boolean>(() => false);

export function isPublicEndpoint() {
  return new HttpContext().set(PUBLIC_ENDPOINT, true);
}

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private tokenSrv: TokenService,
    private router: Router,
    private auth: AuthService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    request = this.addHeaders(request);
    return next
      .handle(request)
      .pipe(catchError((x) => this.handleAuthError(request, x)));
  }

  private addHeaders(request: HttpRequest<unknown>) {
    const xsrfToken = this.tokenSrv.getXSRFToken();
    const token = this.tokenSrv.getToken();

    let req = request.clone({
      withCredentials: true,
      headers: request.headers.set('Accept', 'application/json'),
    });

    if (token || xsrfToken) {
      // Añadir cabecero para token CSRF que ofrece Sanctum
      const cookieheaderName = 'X-XSRF-TOKEN';
      if (xsrfToken !== null && !request.headers.has(cookieheaderName)) {
        req = req.clone({
          headers: req.headers.set(cookieheaderName, xsrfToken),
        });
      }

      if (!request.context.get(PUBLIC_ENDPOINT)) {
        // Añadir access token al cabecero
        if (token) {
          req = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`),
          });
        }
      }

      return req;
    }

    return req;
  }

  private handleAuthError(
    request: HttpRequest<unknown>,
    err: HttpErrorResponse
  ): Observable<any> {
    //handle your auth error or rethrow
    if (err.status === 401 || err.status === 419) {
      //navigate /delete cookies or whatever
      if (!request.context.get(PUBLIC_ENDPOINT)) {
        this.auth.logout().subscribe(() => {
          this.router.navigate(['/auth/login']);
        });
      }

      // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
      return of(err.message); // or EMPTY may be appropriate here
    }

    return throwError(() => err);
  }
}
