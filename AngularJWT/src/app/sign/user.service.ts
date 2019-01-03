import { Injectable } from '@angular/core';
import { TokenService } from './token.service';

import * as jwt_decode from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private userSubject = new BehaviorSubject<any>(null);
  constructor(private tokenService: TokenService, private router: Router) { }

  decodeAndNotify() {
    const token = this.tokenService.getToken();
    // pegar o payload do token
    const claims = jwt_decode(token);
    const user: any = {
      email: claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
      exp: claims['exp']
    };

    this.userSubject.next(user);
  }

  get user() {
    return this.userSubject.asObservable();
  }

  setUserToken(token: string) {
    this.tokenService.setToken(token);
    this.decodeAndNotify();
  }

  logOut() {
    this.tokenService.removeToken();
    this.tokenService.removeTimeRefreshToken();
    this.userSubject.next(null);
    return this.router.navigate(['/']);
  }

  get isLogged() {
    return this.tokenService.hasToken();
  }

  get authorize() {
    return this.user;
  }

  setTimeRefreshToken() {
    let dateExp;

    this.user.subscribe(
      (data: any) => {
        dateExp = data.exp;
        dateExp = dateExp.toString() + '000';
        // tslint:disable-next-line:radix
        dateExp = parseInt(dateExp);
      }
    );

    const newDateExp = new Date(dateExp);

    if (newDateExp.getMinutes() < 5) {
      newDateExp.setMinutes(newDateExp.getMinutes() + 55);
      newDateExp.setHours(newDateExp.getHours() - 1);

    } else if (newDateExp.getMinutes() >= 5 && newDateExp.getMinutes() <= 59) {
      newDateExp.setMinutes(newDateExp.getMinutes() - 5);

    }

    return this.tokenService.timeToRefreshToken(newDateExp);
  }
  removeTimeRefreshToken() {
    this.tokenService.removeTimeRefreshToken();
  }
}
