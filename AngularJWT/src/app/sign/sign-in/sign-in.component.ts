import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SignInService } from './sign-in.service';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  login = this.fb.group({
    login: [''],
    password: ['']
  });
  constructor(private fb: FormBuilder, private signInService: SignInService, private router: Router) { }

  ngOnInit() {
  }
  authenticate() {
    console.log(this.login.getRawValue());
    this.signInService.login().subscribe(data => this.router.navigate(['home']));
  }

}
