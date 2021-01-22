import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { SharedModule } from '../../components/shared.module'

import { GetStartedComponent } from './get-started/get-started.component';
import { GetStartedSellerComponent } from './get-started-seller/get-started-seller.component';

import { infoRouter } from './info.router';
import { InstructionBuyerComponent } from './instruction-buyer/instruction-buyer.component';
import { InstructionSellerComponent } from './instruction-seller/instruction-seller.component';

@NgModule({
  declarations: [ 
    GetStartedComponent,
    GetStartedSellerComponent,
    InstructionBuyerComponent,
    InstructionSellerComponent,
  ],
  imports: [
    infoRouter,
    RouterModule,
    CommonModule,
    ScrollToModule.forRoot(),
    SharedModule,
  ],
  providers: [

  ],
})

export class InfoModule {}