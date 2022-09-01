import { HttpXsrfTokenExtractor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

// Identificador del donde se guarda el LS
export const LS_DATA_KEY = 'mystore_auth_data';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private lsSrv: LocalStorageService, private tokenExtractor: HttpXsrfTokenExtractor) {}

  saveToken(token: string) {
    const lsData = {
      token,
      user: null
    };

    // Seteamos primeramente el token en el LS
    const obj = this.lsSrv.setJsonValue(LS_DATA_KEY, lsData);
  }

  getToken() {
    let token = null;

    const lsData = this.lsSrv.getJsonValue(LS_DATA_KEY);
    if (lsData !== 'undefined' && lsData != null && lsData !== '' && lsData !== '{}') {
      token = lsData.token;
    }

    return token;
  }

  getXSRFToken() {
    return this.tokenExtractor.getToken() as string;;
  }

  remove() {
    this.lsSrv.removeItem(LS_DATA_KEY);
  }
}
