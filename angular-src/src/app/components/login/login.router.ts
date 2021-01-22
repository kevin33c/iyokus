import { Routes, RouterModule } from '@angular/router';

import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

import { UserVerifyComponent } from './user-verify/user-verify.component';
import { UserReverifyComponent } from './user-reverify/user-reverify.component';
import { UserResetpwComponent } from './user-resetpw/user-resetpw.component';
import { UserChangepwComponent } from './user-changepw/user-changepw.component';

import { SellerLoginComponent } from './seller-login/seller-login.component';
import { SellerSignupComponent } from './seller-signup/seller-signup.component';
import { MobileVerifyComponent } from './mobile-verify/mobile-verify.component';

const LOGIN_ROUTER: Routes = [

  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'user/verify/:id',
    component: UserVerifyComponent
  },
  {
    path: 'login/reverify',
    component: UserReverifyComponent
  },
  {
    path: 'login/resetpassword',
    component: UserResetpwComponent
  },
  {
    path: 'user/changepw/:id',
    component: UserChangepwComponent
  },
  {
    path: 'seller-login',
    component: SellerLoginComponent
  },
  {
    path: 'seller-signup',
    component: SellerSignupComponent
  },
  {
    path: 'security/mobileverification/:id',
    component: MobileVerifyComponent
  },

];

export const loginRouter = RouterModule.forChild(LOGIN_ROUTER);