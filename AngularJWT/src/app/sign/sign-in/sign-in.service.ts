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

  login(email: string, password: string) {
    this.http.post('your-api', { email, password })
      .pipe(
        tap((response: any) => {
          this.userService.setUserToken(response.token);
          this.userService.setTimeRefreshToken();
        })
      );
  }
}
