import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

const secureStorage = require('secure-web-storage');
const SECRET_KEY =
  'lA~gqMHK9j;C~x=4^q)Wdn(S:D^LqI[|X+:DgSjI@Xps>tK>6/6*sE4)=B}m8}7';

@Injectable({
  providedIn: 'root',
})
export class SecureLocalStorageService {
  constructor() {}

  public secureStorage = new secureStorage(localStorage, {
    hash: function hash(key: any) {
      key = CryptoJS.HmacSHA256(key, SECRET_KEY);
      return key.toString();
    },
    encrypt: function encrypt(data: any) {
      data = CryptoJS.AES.encrypt(data, SECRET_KEY);
      data = data.toString();
      return data;
    },
    decrypt: function decrypt(data: any) {
      data = CryptoJS.AES.decrypt(data, SECRET_KEY);
      data = data.toString(CryptoJS.enc.Utf8);
      return data;
    },
  });
}
