import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}

  saveToken(token: string) {
    localStorage.setItem('myStoreTkn', token);
  }

  getToken() {
    return localStorage.getItem('myStoreTkn');
  }

  remove() {
    localStorage.removeItem('myStoreTkn');
  }
}
