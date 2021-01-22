import { Routes, RouterModule } from '@angular/router';


import { ProfileComponent } from './profile/profile.component';
import { ViewBidsComponent } from './view-bids/view-bids.component';
import { ViewOrdersComponent } from './view-orders/view-orders.component';
import { UserAddressComponent } from './user-address/user-address.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserFavouriteComponent } from './user-favourite/user-favourite.component';
import { ViewOrderComponent } from './view-order/view-order.component';

const USER_ROUTER: Routes = [
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'yourbids',
    component: ViewBidsComponent
  },
  {
    path: 'yourorders',
    component: ViewOrdersComponent
  },
  {
    path: 'yourorders/:id',
    component: ViewOrderComponent
  },
  {
    path: 'address',
    component: UserAddressComponent
  },
  {
    path: 'editprofile',
    component: UserEditComponent
  },
  {
    path: 'yourfavourites',
    component: UserFavouriteComponent
  },
];

export const userRouter = RouterModule.forChild(USER_ROUTER);