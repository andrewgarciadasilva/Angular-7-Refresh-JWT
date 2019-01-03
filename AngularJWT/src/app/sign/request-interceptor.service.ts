import { Injectable } from '@angular/core';

import { TokenService } from './token.service';
import { UserService } from './user.service';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpClient
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()

export class RequestInterceptorService implements HttpInterceptor {
  // tslint:disable-next-line:max-line-length
  constructor(private tokenService: TokenService, private userService: UserService, private http: HttpClient) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenService.getToken();

    let id;
    let dateExp;

    this.userService.user.subscribe((data: any) => {
      // id = data.id;
      console.log(data);
      dateExp = data.exp;
      dateExp = dateExp.toString() + '000';
      dateExp = parseInt(dateExp);
      dateExp = new Date(dateExp);
    });

    const newDateExp = new Date(this.tokenService.getTimeToRefreshToken());
    const currentDate = new Date(Date.now());

    if (currentDate > newDateExp && currentDate < dateExp && req.url !== '`${this.URI.API_REFRESHTOKEN}/${id}`') {
      this.http.get('`${this.URI.API_REFRESHTOKEN}/${id}`').subscribe(
        (data: { token: string }) => {
          this.userService.setUserToken(data.token);
          this.userService.setTimeRefreshToken();
        },
        err => {
          console.log(err);
        }
      );
    }
    if (currentDate > dateExp) {
      this.userService.logOut();
    }

    req = req.clone({ setHeaders: { 'Authorization': `bearer ${token}` } });
    return next.handle(req);
  }
}
