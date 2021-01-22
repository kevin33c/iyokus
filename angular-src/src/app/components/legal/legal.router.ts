import { Routes, RouterModule } from '@angular/router';
import { PoliciesComponent } from './policies/policies.component';
import { UsePoliciesComponent } from './use-policies/use-policies.component';

const LEGAL_ROUTER: Routes = [

  {
    path: 'policies',
    component: PoliciesComponent
  },
  {
    path: 'useprivacy',
    component: UsePoliciesComponent
  },

];

export const legalRouter = RouterModule.forChild(LEGAL_ROUTER);