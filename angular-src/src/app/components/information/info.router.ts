import { Routes, RouterModule } from '@angular/router';
import { GetStartedComponent } from './get-started/get-started.component';
import { GetStartedSellerComponent } from './get-started-seller/get-started-seller.component';
import { InstructionBuyerComponent } from './instruction-buyer/instruction-buyer.component';
import { InstructionSellerComponent } from './instruction-seller/instruction-seller.component';

const INFO_ROUTER: Routes = [
  {
    path: 'getstarted',
    component: GetStartedComponent
  },
  {
    path: 'getstarted-Business',
    component: GetStartedSellerComponent,
  },
  {
    path: 'instruction-buyer',
    component: InstructionBuyerComponent,
  },
  {
    path: 'instruction-seller',
    component: InstructionSellerComponent,
  },
];

export const infoRouter = RouterModule.forChild(INFO_ROUTER);