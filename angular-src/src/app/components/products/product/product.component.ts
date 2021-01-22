import { Component, OnInit } from '@angular/core';
import { v4 as uuid } from 'uuid';
//router to redirect
import { Router, NavigationEnd } from '@angular/router';
//spinner
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';

//import services
import { ProductsService } from '../../../services/products.service';
import { AuthService } from '../../../services/auth.service';
import { SalesService } from '../../../services/sales.service';
import { RecommendationService } from '../../../services/recommendation.service';
import { SeoService } from '../../../services/seo.service';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../../services/data.service';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  uuID: String = uuid();
  product: any;
  imgs: String[];
  user: any;
  seller: any;
  sellerType: string;
  userID: String;
  bid: number;
  bidEnabled: Boolean;
  expireDate: Date;
  previousBidDetails: any;
  userType: String;
  discount: number;
  bidConfirmed: Boolean = false;
  offers: any;
  soldOut: Boolean = false;
  quantity: number = 1;
  number: any;
  deliveryMethod: string;
  deliveryCost: number;
  selectedDeliveryMethod: string;
  rate: number;
  reviewNumber: number;
  variant1: string[] = [];
  variant2: string[] = [];
  today = new Date();
  estimatedDeliveryDateLowerBound: Date;
  estimatedDeliveryDateUpperBound: Date;
  description: any;
  category: any;
  subcategory: any;
  categoryTag: any;
  subcategoryTag: any;
  categoryRef: any;
  subcategoryRef: any;

  //recommendation
  recCategory: any;
  recSubcategory: any;
  //recommendation

  favourites: any;
  quantityAvailable: any;

  constructor(
    private recommendationService: RecommendationService,
    private productsService: ProductsService,
    public authService: AuthService,
    private salesService: SalesService,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private toastr: ToastrService,
    private seoService: SeoService,
    private ratingConfig: NgbRatingConfig,
    private dataService: DataService
  ) {
    ratingConfig.max = 5;
    ratingConfig.readonly = true;
  }

  ngOnInit() {

    /*Re-render page when changing url params*/
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.router.navigated = false;
        window.scrollTo(0, 0);
      };
    });
    /*Re-render page when changing url params*/

    //get url query
    const query = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);

    //pass http request to get product information
    this.productsService.searchPublishedProduct(query).subscribe(data => {
      this.product = data

      this.category = this.dataService.getCategory().filter((item) => item.id == this.product.category);
      this.subcategory = this.dataService.getSubcategory().filter((item) => item.id == this.product.subcategory);

      this.categoryTag = this.category[0].name;
      this.subcategoryTag = this.subcategory[0].name;

      this.categoryRef = this.category[0].name;
      this.subcategoryRef = this.subcategory[0].n_name;

      this.variant1 = this.product.variant1[0];
      this.variant2 = this.product.variant2[0];

      //console.log(this.product.description);

      this.description = this.product.description.replace(/<img/g, '<img class="col-md-12"');
      //this.description = this.description.replace(/style="width:.*px;"/g, '');
      this.description = this.description.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');


      //this.description = this.description.replace(/<p><img/g, '<img');
      //this.description = this.description.replace(/\/<p><img/g, '/>');

      //console.log(this.description);


      //document metadata manipulation
      this.seoService.setMetadata(this.product.name, this.product.image_Main, this.product.tags, this.product.description);

      //construct imgs array
      this.imgs = [this.product.image_Main, this.product.image_1, this.product.image_2, this.product.image_3];
      //delete undefined path from array
      this.imgs = this.imgs.filter(function (e) { return e });

      if (this.product.deliveryMethod == 0) {
        this.deliveryMethod = 'Meetup Delivery'
      } else if (this.product.deliveryMethod == 1 && this.product.isInternational == false) {
        this.deliveryMethod = 'Postal Delivery'
        //this.estimatedDeliveryDateLowerBound = this.addDays(this.today, 3);
        //this.estimatedDeliveryDateUpperBound = this.addDays(this.today, 5);
      } else if (this.product.deliveryMethod == 1 && this.product.isInternational == true) {
        this.deliveryMethod = 'Standard Delivery'
        this.estimatedDeliveryDateLowerBound = this.addDays(this.today, 20);
        this.estimatedDeliveryDateUpperBound = this.addDays(this.today, 40);
      } else {
        this.deliveryMethod = 'Error!'
      };

      this.selectedDeliveryMethod = this.deliveryMethod;
      this.deliveryCost = this.product.deliveryCost;

      //get seller info
      this.authService.getSellerProfile(this.product.sellerID).subscribe(data => {
        this.seller = data;
        if (this.seller.type == 'seller') {
          this.sellerType = 'an Individual';
        } else if (this.seller.type == 'business') {
          this.sellerType = 'a Professional';
        } else {
          this.sellerType = 'an Individual';
        }

      });

      ///////////////////////RECOMMENDATION STRATEGY///////////////////////
      //get category in localstorage
      this.recCategory = this.recommendationService.getViewedCategory();
      this.recSubcategory = this.recommendationService.getViewedSubcategory();

      if (this.recCategory === null || this.recSubcategory === null) {
        //if empty array
        this.recCategory = [this.product.category];
        this.recSubcategory = [this.product.subcategory];

        this.recommendationService.storeViewedCategory(this.recCategory, this.recSubcategory);

      } else {
        //if recommendation array already exist
        if (this.recCategory.length < 5 || this.recSubcategory.length < 5) {

          this.recCategory.unshift(this.product.category);
          this.recSubcategory.unshift(this.product.subcategory);

          //stored viewed category in localstorage
          this.recommendationService.storeViewedCategory(this.recCategory, this.recSubcategory);

        } else {
          //when array is full (max 5)
          //delete last one
          this.recCategory.pop();
          this.recSubcategory.pop();
          //add to front
          this.recCategory.unshift(this.product.category)
          this.recSubcategory.unshift(this.product.subcategory)

          //stored viewed category in localstorage
          this.recommendationService.storeViewedCategory(this.recCategory, this.recSubcategory);
        };
      };
      ///////////////////////RECOMMENDATION STRATEGY///////////////////////


      ///////////////////////Get product quantity///////////////////////
      //1. adjust quantity to buy pending on quantity available
      //check if product already sold out
      if (this.product.quantity < 1) {
        //if equal to 10 then set display sold out
        this.soldOut = true;
      } else if (this.product.quantity >= 10) {
        //if more or equal to 10 then set quantity available to purchase 10
        var N = 10;
        //this.quantityAvailable = Array.from({ length: N }, (v, k) => k + 1);
        this.quantityAvailable = 10;
      } else {
        //if between 1 and 10 then set quantity available to purchase quantity
        var N = Number(this.product.quantity);
        //this.quantityAvailable = Array.from({ length: N }, (v, k) => k + 1);
        this.quantityAvailable = this.product.quantity;
      };
      ///////////////////////Get product quantity///////////////////////



      //check if user loggedin
      if (this.authService.loggedIn()) {
        //get User Id from localstorage
        this.authService.getProfile().subscribe(profile => {

          this.user = profile["user"];
          this.userID = this.user._id;
          this.userType = this.user.type;

          //check for previous bid
          const verify = {
            userID: this.userID,
            productID: this.product._id
          };

          //get all user favourites
          this.getFavourites(this.userID);

          //check if previous bid exists
          this.salesService.checkPreviousBid(verify).subscribe(data => {
            if (this.userType == "user") {
              if (!data["exists"]) {
                this.bidEnabled = true;
              } else {
                this.bidEnabled = false;
                this.previousBidDetails = data["bid"]
              };
            };
          });

          var productView = {
            userID: this.userID,
            productID: this.product.productID,
            category: this.product.category,
            subcategory: this.product.subcategory
          }
          
          //increase product view count
          this.productsService.increaseViewCount(productView).subscribe(data => { });

        });

      } else {
        var productView2 = {
          userID: 'Unidentified',
          productID: this.product.productID,
          category: this.product.category,
          subcategory: this.product.subcategory
        }
        //increase product view count
        this.productsService.increaseViewCount(productView2).subscribe(data => { });
      }
      

      //get review statistics
      this.salesService.getReviewStats(this.product.sellerID).subscribe(data => {
        if (data["success"]) {

          var reviewStats = data["data"];

          this.rate = reviewStats.average;
          this.reviewNumber = reviewStats.count;

        } else {

          //seller rating
          this.rate = 0;
          this.reviewNumber = 0;
        }
      });


    });
  };



  onSubmitEvaluateBid() {
    this.discount = (this.product.listed_price - this.bid) / this.product.listed_price;
  };


  //add quantity based value and counter offers
  async onClickSubmitBid() {

    this.spinnerService.show();

    const bid = {
      productID: this.product._id,
      bid: this.bid.toFixed(2),
      bid_quantity: this.quantity,
      variant1: this.variant1,
      variant2: this.variant2,
    };

    //not really needed
    await delay(3000);

    this.salesService.evaluateBid(bid).subscribe(data => {

      if (data["success"] == true) {

        this.router.navigate(['/purchase/bidconfirmation', data["id"]]);
        this.spinnerService.hide();

      } else {
        this.spinnerService.hide();
        this.toastr.error('Error: please try again later or contact us', '', {
          timeOut: 3000
        });

      };
    });

  };


  onClickAddFaourite(product) {

    const productinfo = {

      userID: this.userID,
      productID: product._id,
      sellerID: product.sellerID,
      name: product.name,
      brand: product.brand,
      image_Main: product.image_Main

    };

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

  onChangeDeliveryMethod(x) {
    if (x == 'Standard Delivery') {
      this.deliveryCost = this.product.deliveryCost;
      this.estimatedDeliveryDateLowerBound = this.addDays(this.today, 20);
      this.estimatedDeliveryDateUpperBound = this.addDays(this.today, 40);
    } else if (x == 'Free Delivery') {
      this.deliveryCost = 0;
      this.estimatedDeliveryDateLowerBound = this.addDays(this.today, 30);
      this.estimatedDeliveryDateUpperBound = this.addDays(this.today, 50);
    } else {
      this.deliveryCost = this.product.deliveryCost;
    }
  }

  addQty() {
    if (this.quantity >= this.quantityAvailable) {
      return;
    } else {
      this.quantity = this.quantity + 1;
    }
  }

  substractQty() {
    if (this.quantity == 1) {
      return;
    } else {
      this.quantity = this.quantity - 1;
    }
  }

  addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }


};


function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
};