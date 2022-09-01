import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

export interface OnExit {
  onExit: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ExitGuard implements CanDeactivate<unknown> {
  canDeactivate(
    component: OnExit,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // const rta = confirm('Estás seguro de salir?');
    // return rta;

    // De esta forma permitimos añadir la logica desde el componente
    return component.onExit ? component.onExit() : true;
  }
}
