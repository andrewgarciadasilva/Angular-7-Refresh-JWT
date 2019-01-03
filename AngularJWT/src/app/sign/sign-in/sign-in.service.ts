import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class SignInService {

  constructor(
    private http: HttpClient,
    private userService: UserService) { }

  // login(email: string, password: string) {
  login() {
    // this.http.post('./api.txt', { email, password })
    return this.http.get('assets/api.json')
      .pipe(
        tap((response: any) => {
          this.userService.setUserToken(response.token);
          this.userService.setTimeRefreshToken();
        })
      );
  }
}
