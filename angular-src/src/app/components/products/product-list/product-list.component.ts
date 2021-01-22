import { Component, OnInit } from '@angular/core';

//router to redirect
import { Router, NavigationEnd, ActivatedRoute, Params } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

//import services
import { ProductsService } from '../../../services/products.service';
import { AuthService } from '../../../services/auth.service';
import { SeoService } from '../../../services/seo.service';
import { DataService } from '../../../services/data.service';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: any;
  productsX: any;
  productCount: Number;
  sortLogic: Number = 1;
  category: string;
  subcategory: string;
  rowsOnPage: Number = 10;
  user: any;
  userID: any;
  favourites: any;
  brands: any;
  brand: any = 0;
  p: any;
  //searchType: string;
  searchTarget: any;
  genderSearch: any;
  searchTerms: any;
  searchGenderTerm: any;

  constructor(
    private productsService: ProductsService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private seoService: SeoService,
    private dataService: DataService
  ) { }

  ngOnInit() {

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

    //get gender code (if any)
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.genderSearch = params['g']
    });

    //CHECK if include gender search
    if (this.genderSearch == 0 || this.genderSearch == 1) {
      //gender search
      if (this.genderSearch == 0) {
        this.searchGenderTerm = 'Men';
      } else if (this.genderSearch == 1) {
        this.searchGenderTerm = 'Women';
      }

      //get category code from the url
      var query = decodeURIComponent(this.router.url.substring(this.router.url.lastIndexOf('/') + 1, this.router.url.lastIndexOf('?')));

      //match query with name
      this.searchTarget = this.dataService.getCategory().filter((item) => item.name == query);

      this.searchTerms = this.searchTarget['0'].name;

      var genderSearch = {
        category: this.searchTarget['0'].id,
        gender: this.genderSearch,
        location: JSON.parse(localStorage.getItem('locations'))
      };

      //set tab name to subcategory name
      this.seoService.setProductCategoryMetadata(this.searchTarget['0'].name + ' ' + this.searchGenderTerm);

      this.productsService.searchByGender(genderSearch).subscribe(data => {
        this.products = data;
        this.productsX = data;

        //get return count
        this.productCount = this.products.length;

        if (this.productCount > 0) {
          //get distinct brands
          this.brands = Array.from(new Set(this.products.map(item => item.brand))).sort();
        }
      });


    } else {
      //no gender search
      //get category or subcategory code from the url
      var query = decodeURIComponent(this.router.url.substring(this.router.url.lastIndexOf('/') + 1));

      //get search category or subcategory
      if (window.location.href.indexOf("sub") > -1) {
        //match query with n_name
        this.searchTarget = this.dataService.getSubcategory().filter((item) => item.n_name == query);
        //set tab name to subcategory name
        this.seoService.setProductCategoryMetadata(this.searchTarget['0'].name)

        this.searchTerms = this.searchTarget['0'].name;

        //pass http request
        this.productsService.searchBySubcategory(this.searchTarget['0'].id).subscribe(data => {
          this.products = data;
          this.productsX = data;

          //get return count
          this.productCount = this.products.length;

          if (this.productCount > 0) {
            //get distinct brands
            this.brands = Array.from(new Set(this.products.map(item => item.brand))).sort();
          }
        });

      } else if (window.location.href.indexOf("category") > -1) {
        //match query with name
        this.searchTarget = this.dataService.getCategory().filter((item) => item.name == query);
        //set tab name to category name
        this.seoService.setProductCategoryMetadata(this.searchTarget['0'].name)

        this.searchTerms = this.searchTarget['0'].name;

        //pass http request
        this.productsService.searchByCategory(this.searchTarget['0'].id).subscribe(data => {
          this.products = data;
          this.productsX = data;

          //get return count
          this.productCount = this.products.length;

          if (this.productCount > 0) {
            //get distinct brands
            this.brands = Array.from(new Set(this.products.map(item => item.brand))).sort();
          }

        });

      }
    };


    //if used logged in, then load user favourites
    if (this.authService.loggedIn()) {

      this.authService.getProfile().subscribe(profile => {
        this.user = profile["user"]

        this.userID = this.user._id

        //get all user favourites
        this.getFavourites(this.userID)
      }
      )
    };

  };

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
