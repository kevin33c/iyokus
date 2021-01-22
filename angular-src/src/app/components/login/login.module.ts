import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared.module'
import { TagInputModule } from 'ngx-chips';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

import { UserVerifyComponent } from './user-verify/user-verify.component';
import { UserReverifyComponent } from './user-reverify/user-reverify.component';
import { UserResetpwComponent } from './user-resetpw/user-resetpw.component';
import { UserChangepwComponent } from './user-changepw/user-changepw.component';

import { SellerLoginComponent } from './seller-login/seller-login.component';
import { SellerSignupComponent } from './seller-signup/seller-signup.component';
import { MobileVerifyComponent } from './mobile-verify/mobile-verify.component';
import { loginRouter } from './login.router';

import { ValidateService } from '../../services/validate.service';
import { UserService } from '../../services/user.service';

@NgModule({
  declarations: [ 
    SignupComponent,
    LoginComponent,
    UserVerifyComponent,
    UserReverifyComponent,
    UserResetpwComponent,
    UserChangepwComponent,
    SellerLoginComponent,
    SellerSignupComponent,
    MobileVerifyComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    loginRouter,
    SharedModule,
    TagInputModule,
    NgbModule,
  ],
  providers: [
    ValidateService,
    UserService,
  ],
})

export class LoginModule {}