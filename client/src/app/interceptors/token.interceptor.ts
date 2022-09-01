import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private tokenSrv: TokenService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    request = this.addHeaders(request);
    return next.handle(request);
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

      // Añadir access token al cabecero
      if (token) {
        req = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`),
        });
      }

      return req;
    }

    return req;
  }
}
