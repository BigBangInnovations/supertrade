import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class EncrDecrServiceService {

  constructor() { }

  set(value) {
    value = CryptoJS.DES.encrypt(value, environment.encKey);
    value = value.toString();
    return value;
  }

  //The get method is use for decrypt the value.
  get(data) {
    data = CryptoJS.DES.decrypt(data, environment.encKey);
    data = data.toString(CryptoJS.enc.Utf8);
    return data;
  }

  setLocalStorage(key, value) {
    value = this.set(value);
    localStorage.setItem(key, value);
    //Set expire time
    let now: any = new Date().getTime();
    localStorage.setItem('setupTime', now)
  }

  getLocalStorage(key) {
    var value = localStorage.getItem(key);
    if (value != '' && value != null)
      return this.get(value);
    else return value
  }

  validateStorage() {
    let hours = 6; // Reset when storage is more than 24hours
    let now: any = new Date().getTime();
    let setupTime: any = localStorage.getItem('setupTime');

    if (now - setupTime > hours * 60 * 60 * 1000) {
      localStorage.removeItem(environment.localStorageKey);
      localStorage.removeItem('setupTime');
    }
  }
}
