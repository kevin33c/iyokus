import { Component, OnInit } from '@angular/core';
//router to redirect
import { Router, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

//import services
import { ProductsService } from '../../../services/products.service';
import { AuthService } from '../../../services/auth.service';
import { SeoService } from '../../../services/seo.service';
import { SalesService } from '../../../services/sales.service';

@Component({
  selector: 'app-product-seller',
  templateUrl: './product-seller.component.html',
  styleUrls: ['./product-seller.component.css']
})
export class ProductSellerComponent implements OnInit {

  sellerID: string;
  seller: any;
  sellerType: string;
  rate: number;
  reviewNumber: number;
  products: any;
  favourites: any;
  user: any;
  userID: any;
  p: any;

  constructor(
    private productsService: ProductsService,
    public authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private seoService: SeoService,
    private ratingConfig: NgbRatingConfig,
    private salesService: SalesService,
  ) {
    ratingConfig.max = 5;
    ratingConfig.readonly = true;
  }

  ngOnInit() {

    //get url query
    this.sellerID = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);



    //get seller info
    this.authService.getSellerProfile(this.sellerID).subscribe(data => {
      this.seller = data;

      if (this.seller.type == 'seller') {
        this.sellerType = 'an Individual';
      } else if (this.seller.type == 'business') {
        this.sellerType = 'a Professional';
      }

      //document metadata manipulation
      this.seoService.setSectionMetadata('Seller Profile ' + this.seller.name);

    });

    //get seller reviews
    this.salesService.getReviewStats(this.sellerID).subscribe(data => {
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


    //get product by seller
    this.productsService.getProductbySeller(this.sellerID).subscribe(data => {
      if (data["success"]) {

        this.products = data['data'];

      } else {

        this.toastr.error('Error: please try again later or contact us', '', {
          timeOut: 3000
        });

      }
    });


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

  }

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
