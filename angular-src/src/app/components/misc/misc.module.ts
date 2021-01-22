import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
//import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { SharedModule } from '../../components/shared.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { FaqComponent } from './faq/faq.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
//import { GetStartedComponent } from './get-started/get-started.component';
//import { GetStartedSellerComponent } from './get-started-seller/get-started-seller.component';


import { miscRouter } from './misc.router';
import { JobsComponent } from './jobs/jobs.component';

@NgModule({
  declarations: [ 
    FaqComponent,
    AboutUsComponent,
    ContactUsComponent,
    //GetStartedComponent,
    //GetStartedSellerComponent,
    JobsComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    miscRouter,
    FormsModule,
    ReactiveFormsModule,
    //ScrollToModule.forRoot(),
    SharedModule,
  ],
  providers: [
    UserService,
  ],
})

export class MiscModule {}