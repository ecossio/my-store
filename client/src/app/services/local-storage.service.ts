import { Injectable } from '@angular/core';
import { SecureLocalStorageService } from './secure-local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(private slsSrv: SecureLocalStorageService) {}

  // Set the json data to local
  setJsonValue(key: string, value: any) {
    this.slsSrv.secureStorage.setItem(key, value);
  }

  // Get the json value from local
  getJsonValue(key: string) {
    return this.slsSrv.secureStorage.getItem(key);
  }

  // Clear the local
  removeItem(key: string) {
    return this.slsSrv.secureStorage.removeItem(key);
  }

  exists(key: string) {
    const lsData = this.getJsonValue(key);
    return lsData !== 'undefined' &&
      lsData != null &&
      lsData !== '' &&
      lsData !== '{}'
      ? true
      : false;
  }

  existsAndHasProperty(key: string, property: string) {
    const lsData = this.getJsonValue(key);
    return this.exists(key) && lsData.hasOwnProperty(property) && lsData[property];
  }
}
