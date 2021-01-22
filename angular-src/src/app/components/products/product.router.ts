import { Routes, RouterModule } from '@angular/router';

import { ProductComponent } from './product/product.component';

const PRODUCT_ROUTER: Routes = [
  
  {
    path: ':id/:id2',
    component: ProductComponent
  }
];

export const productRouter = RouterModule.forChild(PRODUCT_ROUTER);