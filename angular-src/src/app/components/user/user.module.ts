import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../components/shared.module'
import { userRouter } from './user.router';
import { TagInputModule } from 'ngx-chips';


import { ProfileComponent } from './profile/profile.component';
import { ViewBidsComponent } from './view-bids/view-bids.component';
import { ViewOrdersComponent } from './view-orders/view-orders.component';
import { UserAddressComponent } from './user-address/user-address.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserFavouriteComponent } from './user-favourite/user-favourite.component';


import { ValidateService } from '../../services/validate.service';
import { UserService } from '../../services/user.service';
import { SalesService } from '../../services/sales.service';
import { DataService } from '../../services/data.service';
import { ViewOrderComponent } from './view-order/view-order.component';

@NgModule({
  declarations: [
    ProfileComponent,
    ViewBidsComponent,
    ViewOrdersComponent,
    UserAddressComponent,
    UserEditComponent,
    UserFavouriteComponent,
    ViewOrderComponent

  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    userRouter,
    SharedModule,
    TagInputModule 
  ],
  providers: [
    UserService,
    ValidateService,
    SalesService,
    DataService,
  ],
})

export class UserModule {}