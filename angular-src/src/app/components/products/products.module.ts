import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../components/shared.module'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SalesService } from '../../services/sales.service';

import { ProductListComponent } from './product-list/product-list.component'
import { ProductSearchComponent } from './product-search/product-search.component';


import { productsRouter } from './products.router';
import { ProductSellerComponent } from './product-seller/product-seller.component';


@NgModule({
  declarations: [
    ProductListComponent,
    ProductSearchComponent,
    ProductSellerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    productsRouter,
    SharedModule,
    NgbModule
  ],
  providers: [
    SalesService,
  ],
})

export class ProductsModule { }