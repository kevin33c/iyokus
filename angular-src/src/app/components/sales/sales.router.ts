import { Routes, RouterModule } from '@angular/router';

import { BidComponent } from '../products/bid/bid.component';
import { ChooseAddressComponent } from './choose-address/choose-address.component';
import { PaymentComponent } from './payment/payment.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { PaymentErrorComponent } from './payment-error/payment-error.component';
import { ReviewComponent } from './review/review.component';


const SALES_ROUTER: Routes = [
  {
    path: 'bidconfirmation/:id',
    component: BidComponent
  },
  {
    path: 'selectaddress',
    component: ChooseAddressComponent
  },
  {
    path: 'review/:id',
    component: ReviewComponent
  },
  {
    path: 'payment/:id',
    component: PaymentComponent
  },
  {
    path: 'confirmation',
    component: ConfirmationComponent
  },
  {
    path: 'error',
    component: PaymentErrorComponent
  },
];

export const salesRouter = RouterModule.forChild(SALES_ROUTER);