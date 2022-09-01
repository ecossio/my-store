import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpXsrfTokenExtractor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private tokenSrv: TokenService,
    private tokenExtractor: HttpXsrfTokenExtractor
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    request = this.addHeaders(request);
    return next.handle(request);
  }

  private addHeaders(request: HttpRequest<unknown>) {
    const csrfToken = this.tokenExtractor.getToken() as string;
    const token = this.tokenSrv.getToken();

    let req = request.clone({
      withCredentials: true,
      headers: request.headers.set('Accept', 'application/json'),
    });

    if (token || csrfToken) {
      // Añadir cabecero para token CSRF que ofrece Sanctum
      const cookieheaderName = 'X-XSRF-TOKEN';
      if (csrfToken !== null && !request.headers.has(cookieheaderName)) {
        req = req.clone({
          headers: req.headers.set(cookieheaderName, csrfToken),
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
