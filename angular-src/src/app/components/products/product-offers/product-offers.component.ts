import { Component, OnInit } from '@angular/core';
import { NguCarousel, NguCarouselStore, NguCarouselService } from '@ngu/carousel';

import { ProductsService } from '../../../services/products.service';


@Component({
  selector: 'app-product-offers',
  templateUrl: './product-offers.component.html',
  styleUrls: ['./product-offers.component.css']
})
export class ProductOffersComponent implements OnInit {
  private carouselToken: string;

  public carouselTileItems: any;
  public carouselTile: NguCarousel;

  constructor(
    private productsService: ProductsService,
    private carousel: NguCarouselService
  ) { }

  ngOnInit() {

    this.productsService.getBestOffers().subscribe(data => {
      this.carouselTileItems = data;

      if (this.carouselTileItems.length > 0) {

        this.carouselTile = {
          grid: { xs: 1, sm: 2, md: 3, lg: 4, all: 0 },
          slide: 5,
          speed: 400,
          animation: 'lazy',
          point: {
            visible: true
          },
          load: 2,
          touch: true,
          easing: 'ease'
        }

      }
    })
  };

  initDataFn(key: NguCarouselStore) {
    this.carouselToken = key.token;
  };

  moveToSlide() {
    this.carousel.moveToSlide(this.carouselToken, 2, false);
  };

  productNameToUrl(str){
    str = str.replace(/[^a-zA-Z0-9 ]/g, "");
    str = str.replace(/\s+/g, '-');
    str = encodeURIComponent(str);
    return str;
  };
}
