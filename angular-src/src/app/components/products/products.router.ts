import { Routes, RouterModule } from '@angular/router';


import { ProductListComponent } from './product-list/product-list.component'
import { ProductSearchComponent } from './product-search/product-search.component';
import { ProductSellerComponent } from './product-seller/product-seller.component';

const PRODUCTS_ROUTER: Routes = [
  {//for seller search
    path: 'seller/:id',
    component: ProductSellerComponent
  },
  {//for category search
    path: 'category/:id',
    component: ProductListComponent
  },
  {//for subcategory
    path: 'subcategory/:id',
    component: ProductListComponent
  },
  {
    path: 'search',
    component: ProductSearchComponent
  },

];

export const productsRouter = RouterModule.forChild(PRODUCTS_ROUTER);