import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NewPasswordForceComponent } from './new-password-force/new-password-force.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { SignInComponent } from './sign-in/sign-in.component';

const routes: Routes = [
  {
    path: 'sign-in',
    component: SignInComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'recover-password/:email',
    component: RecoverPasswordComponent,
  },
  {
    path: 'new-password/:userId',
    component: NewPasswordComponent,
  },
  {
    path: 'new-password-force',
    component: NewPasswordForceComponent,
  },
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRouter { }
