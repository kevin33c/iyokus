import { Component, OnInit } from '@angular/core';
//router to redirect
import { Router, NavigationEnd, ActivatedRoute, Params } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

//import services
import { ProductsService } from '../../../services/products.service';
import { AuthService } from '../../../services/auth.service';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-user-favourite',
  templateUrl: './user-favourite.component.html',
  styleUrls: ['./user-favourite.component.css']
})
export class UserFavouriteComponent implements OnInit {

  products: any;
  productCount: Number;
  sortLogic: Number = 1;
  category: String;
  subcategory: String;
  rowsOnPage: Number = 10;
  user: any;
  userID: any;
  favourites: any;
  p: any;


  constructor(
    private productsService: ProductsService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private seoService: SeoService
  ) { }

  ngOnInit() {
    
    this.seoService.setSectionMetadata('My Favourites');

    
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

  onClickRemoveFavourite(id) {
    const user = {
      userID: this.userID
    };

    this.productsService.deleteFavourite(id, user).subscribe(data => {
      if (data["success"]) {
        this.toastr.info('Item removed from Favourites List', '', {
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

  productNameToUrl(str){
    str = str.replace(/[^a-zA-Z0-9 ]/g, "");
    str = str.replace(/\s+/g, '-');
    str = encodeURIComponent(str);
    return str;
  };
}
