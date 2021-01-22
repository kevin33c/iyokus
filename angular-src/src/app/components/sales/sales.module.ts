import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { SharedModule } from '../../components/shared.module'
import { salesRouter } from './sales.router';

import { BidComponent } from '../products/bid/bid.component';
import { ChooseAddressComponent } from './choose-address/choose-address.component';
import { PaymentComponent } from './payment/payment.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { PaymentErrorComponent } from './payment-error/payment-error.component';

import { UserService } from '../../services/user.service';
import { SalesService } from '../../services/sales.service';
import { ReviewComponent } from './review/review.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [ 
    BidComponent,
    ChooseAddressComponent,
    PaymentComponent,
    ConfirmationComponent,
    PaymentErrorComponent,
    ReviewComponent
 
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    salesRouter,
    NgbModule,
  ],
  providers: [
    UserService,
    SalesService,
  ],
})

export class SalesModule {}