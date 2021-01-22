import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

//guard module
import { AuthGuard } from './guards/auth.guard';

//user
import { HomeComponent } from './components/home/home.component';

import { NotFoundComponent } from './components/misc/not-found/not-found.component';

const routes: Routes = [

  { path: '', component: HomeComponent },

  { path: 'messenger', loadChildren: './components/messaging/messaging.module#MessagingModule'},

  /*******************************************LOGIN HANDLING*******************************************/
  { path: '', loadChildren: './components/login/login.module#LoginModule' },

  /*******************************************USER*******************************************/
  {
    path: 'user', loadChildren: './components/user/user.module#UserModule', canActivate: [AuthGuard], data: {
      permission: {
        only: ['user'],
        redirectTo: './login'
      }
    }
  },
  /*******************************************BUSINESS*******************************************/
  {
    path: 'business', loadChildren: './components/seller/business.module#BusinessModule', canActivate: [AuthGuard], data: {
      permission: {
        only: ['seller'],
        redirectTo: './seller-login'
      }
    }
  },
  /*******************************************PRODUCT*******************************************/
  { path: 'view', loadChildren: './components/products/products.module#ProductsModule' },
  
  { path: 'product', loadChildren: './components/products/product.module#ProductModule' },


  /*******************************************SALES*******************************************/
  {
    path: 'purchase', loadChildren: './components/sales/sales.module#SalesModule', canActivate: [AuthGuard], data: {
      permission: {
        only: ['user'],
        redirectTo: './login'
      }
    }
  },

  /*******************************************HELP SECTIONS*******************************************/
  { path: 'help', loadChildren: './components/help/help.module#HelpModule' },


  /*******************************************MISC INFO*******************************************/
  { path: 'legal', loadChildren: './components/legal/legal.module#LegalModule' },
  { path: 'misc', loadChildren: './components/misc/misc.module#MiscModule' },
  { path: 'info', loadChildren: './components/information/info.module#InfoModule' },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }

];


@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  declarations: []
})
export class AppRoutingModule { }
