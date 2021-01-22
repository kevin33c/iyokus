import { Component, OnInit } from '@angular/core';

//router to redirect
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

//import services
import { ProductsService } from '../../../services/products.service';
import { RecommendationService } from '../../../services/recommendation.service';
import { AuthService } from '../../../services/auth.service';
import { SeoService } from '../../../services/seo.service';


@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent implements OnInit {

  products: any;
  productsX: any;
  keyword: String;
  productCount: Number;
  sortLogic: Number = 1;
  rowsOnPage: Number = 10;
  user: any;
  userID: any;
  favourites: any;
  brands: any;
  brand: any = 0;
  productFound: boolean = true;

  //recommendation
  keySearched: any;
  //recommendation

  constructor(
    private recommendationService: RecommendationService,
    private productsService: ProductsService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private seoService: SeoService
  ) { }

  ngOnInit() {
    //get url query
    const query = this.router.url.substr(this.router.url.lastIndexOf('?') + 1);

    //get keyword from url
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.keyword = params['key'];

      //document metadata manipulation
      this.seoService.setSectionMetadata(this.keyword);

    });

    /*Re-render page when changing url params*/
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.router.navigated = false;
        window.scrollTo(0, 0);
      }
    });
    /*Re-render page when changing url params*/


    //pass http request
    this.productsService.searchProductByKeyword(query).subscribe(data => {
      this.products = data
      this.productsX = data;

      //get return count
      this.productCount = this.products.length;

      this.recommedationStategy(this.keyword, this.productCount);

      if (this.productCount > 0) {

        //get distinct brands
        this.brands = Array.from(new Set(this.products.map(item => item.brand))).sort();

        //add search
        const search = {
          keyword: this.keyword,
          count: this.productCount
        };

        //record searches
        this.productsService.addSearch(search).subscribe(data => {

        });
      } else {
        this.productFound = false;
      };
    });

    if (this.authService.loggedIn()) {

      this.authService.getProfile().subscribe(profile => {
        this.user = profile["user"]

        this.userID = this.user._id

        //get all user favourites
        this.getFavourites(this.userID)
      }
      )
    };
  }

  onChangeSort() {
    //sort lowest price first
    if (this.sortLogic == 2) {
      this.products.sort(function (a, b) {
        return a.listed_price - b.listed_price;
      });
      //sort highest price first
    } else if (this.sortLogic == 3) {
      this.products.sort(function (a, b) {
        return b.listed_price - a.listed_price;
      });
      //sort date newest first
    } else if (this.sortLogic == 6) {
      this.products.sort(function (a, b) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      //sort date oldest first
    } else if (this.sortLogic == 7) {
      this.products.sort(function (a, b) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
      //sort by relevance
    } else if (this.sortLogic == 1) {
      this.products.sort(function (a, b) {
        return b.relevance - a.relevance;
      });
    }
  };


  onChangeBrandFilter() {

    if (this.brand === '0') {
      this.products = this.productsX;
    } else {
      this.products = this.productsX.filter(
        x => x.brand === this.brand);
    };

  };


  soldOut(quantity: number) {
    if (quantity > 0) {
      return false
    } else {
      return true
    }
  };

  goTop() {
    window.scrollTo(0, 0);
  };


  recommedationStategy(key, count) {

    ///////////////////////RECOMMENDATION STRATEGY///////////////////////
    //only save search if result found
    //console.log(count);

    if (count > 0) {
      //get category in localstorage
      this.keySearched = this.recommendationService.getSearchedKey();

      if (this.keySearched === null) {
        //if empty array
        this.keySearched = [key];

        this.recommendationService.storeSeached(this.keySearched);

      } else {
        //if recommendation array already exist
        if (this.keySearched.length < 5) {

          this.keySearched.unshift(key)

          //stored viewed category in localstorage
          this.recommendationService.storeSeached(this.keySearched);

        } else {
          //when array is full (max 5)
          //delete last one
          this.keySearched.pop();

          //add to front
          this.keySearched.unshift(key)

          //stored viewed category in localstorage
          this.recommendationService.storeSeached(this.keySearched);
        }

      }
    }
    ///////////////////////RECOMMENDATION STRATEGY///////////////////////
  };

  onClickAddFaourite(product) {

    const productinfo = {

      userID: this.userID,
      productID: product._id,
      sellerID: product.sellerID,
      name: product.name,
      brand: product.brand,
      image_Main: product.image_Main

    }

    this.productsService.addProductAsFavourite(productinfo).subscribe(data => {
      if (data["success"]) {
        this.toastr.success('Added to My Favourites', '', {
          timeOut: 3000
        });
        //get all user favourites
        this.getFavourites(this.userID)
      } else {
        this.toastr.error('Error: please try again later or contact us', '', {
          timeOut: 3000
        });
      }
    });
  };


  onClickRemoveFavourite(id) {
    const user = {
      userID: this.userID
    };

    this.productsService.deleteFavourite(id, user).subscribe(data => {
      if (data["success"]) {
        this.toastr.info('Removed from My Favourites', '', {
          timeOut: 3000
        });
        //get all user favourites
        this.getFavourites(this.userID)
      } else {
        this.toastr.error('Error: please try again later or contact us', '', {
          timeOut: 3000
        });
      }
    });

  };


  getFavourites(id) {
    this.productsService.getFavouritesByID(id).subscribe(data => {
      this.favourites = data;
    });
  };

  checkIfFavourite(productID) {
    if (this.favourites) {
      var searchTerm = productID;
      var results = this.favourites.filter(function (favourite) {
        return favourite.productID.indexOf(searchTerm) > -1;
      });

      if (results.length > 0) {
        //console.log("True");
        return true;
      } else {
        //console.log("False");
        return false;
      }
    }
    //console.log(results);
  };


  productNameToUrl(str){
    str = str.replace(/[^a-zA-Z0-9 ]/g, "");
    str = str.replace(/\s+/g, '-');
    str = encodeURIComponent(str);
    return str;
  };
}
