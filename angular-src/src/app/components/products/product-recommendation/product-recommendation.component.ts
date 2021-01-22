import { Component, OnInit } from '@angular/core';
import { NguCarousel, NguCarouselStore, NguCarouselService } from '@ngu/carousel';

import { ProductsService } from '../../../services/products.service';
import { RecommendationService } from '../../../services/recommendation.service';


@Component({
  selector: 'app-product-recommendation',
  templateUrl: './product-recommendation.component.html',
  styleUrls: ['./product-recommendation.component.css']
})
export class ProductRecommendationComponent implements OnInit {
  private carouselToken: string;

  public carouselTileItems: any;
  public carouselTile: NguCarousel;

  recCategory: any;
  recSubcategory: any;
  keySearched: any;

  constructor(
    private recommendationService: RecommendationService,
    private productsService: ProductsService,
    private carousel: NguCarouselService
  ) { }

  ngOnInit() {

    //get history in localstorage
    this.recCategory = this.recommendationService.getViewedCategory();

    if (this.recCategory === null) {

      var dummy = 'dummy'
      this.productsService.searchRecommendedProducts(dummy).subscribe(data => {
        this.carouselTileItems = data

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

          this.carouselTileItems = shuffle(this.carouselTileItems);

        };

      });

    } else {

      var key = this.recCategory[0];

      this.productsService.searchRecommendedProducts(key).subscribe(data => {
        this.carouselTileItems = data

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

          this.carouselTileItems = shuffle(this.carouselTileItems);

        };

      });

    };


  }

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


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}



