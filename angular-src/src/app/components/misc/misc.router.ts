import { Routes, RouterModule } from '@angular/router';

import { FaqComponent } from './faq/faq.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
//import { GetStartedComponent } from './get-started/get-started.component';
//import { GetStartedSellerComponent } from './get-started-seller/get-started-seller.component';
import { JobsComponent } from './jobs/jobs.component';


const MISC_ROUTER: Routes = [

  {
    path: 'faq',
    component: FaqComponent
  },
  {
    path: 'jobs',
    component: JobsComponent
  },
  {
    path: 'aboutus',
    component: AboutUsComponent
  },
  {
    path: 'contactus',
    component: ContactUsComponent
  },
  /*
  {
    path: 'getstarted',
    component: GetStartedComponent
  },
  {
    path: 'getstarted-Business',
    component: GetStartedSellerComponent,
  },
  */
];

export const miscRouter = RouterModule.forChild(MISC_ROUTER);