import { Component, OnInit, Input } from '@angular/core';

//import services
import { ProductsService } from '../../../services/products.service';
import { DataService } from '../../../services/data.service';
import { NguCarousel, NguCarouselStore, NguCarouselService } from '@ngu/carousel';

@Component({
  selector: 'app-product-advertisement',
  templateUrl: './product-advertisement.component.html',
  styleUrls: ['./product-advertisement.component.css']
})
export class ProductAdvertisementComponent implements OnInit {

  @Input()
  adCategoryNr: number;
  adCategoryTitle: string;

  private carouselToken: string;
  public carouselTileItems: any;
  public carouselTile: NguCarousel;

  constructor(
    private productsService: ProductsService,
    private dataService: DataService,
    private carousel: NguCarouselService
  ) { }

  ngOnInit() {

    //get dataservice to get title text
    this.adCategoryTitle = this.dataService.getSubcategory().filter((item) => item.id == this.adCategoryNr)[0].name;

    var id = {
      id: this.adCategoryNr
    }

    //get productservice to query product example by category
    this.productsService.getAdProducts(id).subscribe(data => {

      this.carouselTileItems = data;

      if(this.carouselTileItems.length > 0){

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

      };

    })

  }

  initDataFn(key: NguCarouselStore) {
    this.carouselToken = key.token;
  };

  moveToSlide() {
    this.carousel.moveToSlide(this.carouselToken, 2, false);
  };

  onClickGotoTop(){
    window.scrollTo(0, 0);
  };

  productNameToUrl(str){
    str = str.replace(/[^a-zA-Z0-9 ]/g, "");
    str = str.replace(/\s+/g, '-');
    str = encodeURIComponent(str);
    return str;
  };
}
