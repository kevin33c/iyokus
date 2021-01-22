import { Routes, RouterModule } from '@angular/router';
import { HelpCenterComponent } from './help-center/help-center.component';


const HELP_ROUTER: Routes = [
  
  {
    path: 'center',
    component: HelpCenterComponent
  },
  {
    path: 'center/:id',
    component: HelpCenterComponent
  },
  
];

export const helpRouter = RouterModule.forChild(HELP_ROUTER);