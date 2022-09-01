import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map, Observable } from 'rxjs';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private tokenSrv: TokenService,
    private authSrv: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = this.tokenSrv.getToken();
    if (!token) {
      this.router.navigate(['/home']);
      return false;
    }

    return true;

    /*
    return this.authSrv.user$.pipe(
      map((user) => {
        console.log('auth.guard', user);
        if (!user) {
          this.router.navigate(['/home']);
          return false;
        }

        return true;
      })
    );*/
  }
}
