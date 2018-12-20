import { Injectable } from '@angular/core';

const KEY = 'authToken';
const TIME = 'timeToRefreshToken';
const ID = 'id';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }
  hasToken() {
    return !!this.getToken();
  }

  setToken(token) {
    window.localStorage.setItem(KEY, token);
  }


  getToken() {
    return window.localStorage.getItem(KEY);
  }

  removeToken() {
    window.localStorage.removeItem(KEY);
  }

  timeToRefreshToken(time) {
    window.localStorage.setItem(TIME, time);
  }

  getTimeToRefreshToken() {
    return window.localStorage.getItem(TIME);
  }
  removeTimeRefreshToken() {
    window.localStorage.removeItem(TIME);
  }
}
