import { NgModule }  from '@angular/core';
import { CommonModule } from '@angular/common';
import { NguCarouselModule } from '@ngu/carousel';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//shared components
import { ProductRecommendationComponent } from '../components/products/product-recommendation/product-recommendation.component';
import { ProductOffersComponent } from '../components/products/product-offers/product-offers.component';
import { ProductTopViewedComponent } from '../components/products/product-top-viewed/product-top-viewed.component';
import { ProductAdvertisementComponent } from '../components/products/product-advertisement/product-advertisement.component';
import { HeaderComponent } from '../components/layout/header/header.component';
import { FooterComponent } from '../components/layout/footer/footer.component';


@NgModule({
  imports: [ 
    CommonModule,
    NguCarouselModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports : [
    ProductRecommendationComponent,
    ProductOffersComponent,
    ProductTopViewedComponent,
    ProductAdvertisementComponent,
    HeaderComponent,
    FooterComponent,
    
  ],
  declarations: [ 
    ProductRecommendationComponent,
    ProductOffersComponent,
    ProductTopViewedComponent,
    ProductAdvertisementComponent,
    HeaderComponent,
    FooterComponent,
  ],
})
export class SharedModule { }