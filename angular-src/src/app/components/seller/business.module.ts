import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../components/shared.module'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TagInputModule } from 'ngx-chips';


import { businessRouter } from './business.router';


import { SellerProfileComponent } from "./seller-profile/seller-profile.component";
import { UploadProductComponent } from './upload-product/upload-product.component';
import { ViewProductsComponent } from './view-products/view-products.component';
import { EditProductComponent } from "./edit-product/edit-product.component";
import { SellerEditComponent } from "./seller-edit/seller-edit.component";
import { SellerOrdersComponent } from './seller-orders/seller-orders.component';
import { SellerFinanceComponent } from './seller-finance/seller-finance.component';
import { PreviewProductComponent } from './preview-product/preview-product.component';
import { SellerOrderComponent } from './seller-order/seller-order.component';


import { ValidateService } from '../../services/validate.service';
import { SalesService } from '../../services/sales.service';




@NgModule({
  declarations: [ 
    SellerProfileComponent,
    UploadProductComponent,
    ViewProductsComponent,
    EditProductComponent,
    SellerEditComponent,
    SellerOrdersComponent,
    SellerFinanceComponent,
    PreviewProductComponent,
    SellerOrderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    NgxPaginationModule,
    businessRouter,
    SharedModule,
    NgbModule,
    TagInputModule
  ],
  providers: [
    ValidateService,
    SalesService,
  ],
})

export class BusinessModule {}