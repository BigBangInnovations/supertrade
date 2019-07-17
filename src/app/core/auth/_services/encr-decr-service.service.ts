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
    sessionStorage.setItem(key, value);
  }

  getLocalStorage(key) {
    var value = sessionStorage.getItem(key);
    if (value != '' && value != null)
      return this.get(value);
    else return value
  }
}
