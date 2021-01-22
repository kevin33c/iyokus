import { Routes, RouterModule } from '@angular/router';

import { SellerProfileComponent } from './seller-profile/seller-profile.component';
import { UploadProductComponent } from './upload-product/upload-product.component';
import { ViewProductsComponent } from './view-products/view-products.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { SellerEditComponent } from './seller-edit/seller-edit.component';
import { SellerOrdersComponent } from './seller-orders/seller-orders.component';
import { SellerFinanceComponent } from './seller-finance/seller-finance.component';
import { PreviewProductComponent } from './preview-product/preview-product.component';
import { SellerOrderComponent } from './seller-order/seller-order.component';


const BUSINESS_ROUTER: Routes = [
  {
    path: 'profile',
    component: SellerProfileComponent
  },
  {
    path: 'addproduct',
    component: UploadProductComponent
  },
  {
    path: 'viewproduct',
    component: ViewProductsComponent
  },
  {
    path: 'previewproduct/:id',
    component: PreviewProductComponent
  },
  {
    path: 'editproduct/:id',
    component: EditProductComponent
  },
  {
    path: 'editprofile',
    component: SellerEditComponent
  },
  {
    path: 'orders',
    component: SellerOrdersComponent
  },
  {
    path: 'order/:id',
    component: SellerOrderComponent
  },
  {
    path: 'finance',
    component: SellerFinanceComponent
  },
];

export const businessRouter = RouterModule.forChild(BUSINESS_ROUTER);