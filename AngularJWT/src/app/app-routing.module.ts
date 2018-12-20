import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './sign/sign-in/sign-in.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './sign/auth.guard';

const routes: Routes = [
  {path: '', component: SignInComponent},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
