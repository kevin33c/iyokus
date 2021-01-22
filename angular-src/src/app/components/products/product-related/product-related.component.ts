import { Component, OnInit } from '@angular/core';
import { NguCarousel, NguCarouselStore, NguCarouselService } from '@ngu/carousel';

import { ProductsService } from '../../../services/products.service';

//router to redirect
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-product-related',
  templateUrl: './product-related.component.html',
  styleUrls: ['./product-related.component.css']
})
export class ProductRelatedComponent implements OnInit {
  private carouselToken: string;

  public carouselTileItems: any;
  public carouselTile: NguCarousel;

  product: any;

  constructor(
    private productsService: ProductsService,
    private carousel: NguCarouselService,
    private router: Router,
  ) { }

  ngOnInit() {


    const query = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);

    //pass http request to get product information
    this.productsService.searchPublishedProduct(query).subscribe(data => {
      this.product = data;

      //get related products
      this.productsService.searchRelatedProducts(this.product.subcategory).subscribe(data => {

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
          };

          //filter out the product itself
          this.carouselTileItems = this.carouselTileItems.filter((x => x._id !== this.product._id));

          this.carouselTileItems = shuffle(this.carouselTileItems);

        }

      });
    }
    );



  };

  initDataFn(key: NguCarouselStore) {
    this.carouselToken = key.token;
  };

  moveToSlide() {
    this.carousel.moveToSlide(this.carouselToken, 2, false);
  };

  onClickGotoTop() {
    window.scrollTo(0, 0);
  };

  productNameToUrl(str){
    str = str.replace(/[^a-zA-Z0-9 ]/g, "");
    str = str.replace(/\s+/g, '-');
    str = encodeURIComponent(str);
    return str;
  };

};

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
};
