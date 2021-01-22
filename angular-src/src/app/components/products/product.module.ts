import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../components/shared.module'
import { NguCarouselModule } from '@ngu/carousel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ProductComponent } from './product/product.component';


import { SalesService } from '../../services/sales.service';
import { ValidateService } from '../../services/validate.service';

import { productRouter } from './product.router';
import { ProductRelatedComponent } from './product-related/product-related.component';


@NgModule({
  declarations: [
    ProductComponent,
    ProductRelatedComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    productRouter,
    SharedModule,
    NguCarouselModule,
    NgbModule
  ],
  providers: [
    SalesService,
    ValidateService
  ],
})

export class ProductModule { }