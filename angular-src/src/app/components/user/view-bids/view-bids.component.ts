import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../../services/sales.service';
import { AuthService } from '../../../services/auth.service';
import { SeoService } from '../../../services/seo.service';
//router to redirect
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-bids',
  templateUrl: './view-bids.component.html',
  styleUrls: ['./view-bids.component.css']
})
export class ViewBidsComponent implements OnInit {

  user: any;
  userID: String;
  offers: any;


  constructor(
    private salesService: SalesService,
    private authService: AuthService,
    private router: Router,
    private seoService: SeoService
  ) { }

  ngOnInit() {

    this.seoService.setSectionMetadata('My Offers');

    if (this.authService.loggedIn()) {
      //get User Id from localstorage
      this.authService.getProfile().subscribe(profile => {

        this.user = profile["user"];
        this.userID = this.user._id;

        this.salesService.getOffersByUserID(this.userID).subscribe(data => {
          this.offers = data
          //console.log(this.offers);
        });
      }
      );
    }
  };

  onClickAcceptOffer(uuID, productID) {
    this.salesService.acceptOffer(uuID).subscribe(data => {
      if (data["success"]) {
        this.router.navigate(['/purchase/selectaddress'], { queryParams: { ord_id: uuID, prod_id: productID } });
      } else {
        //console.log(data)
      }
    });
  };

  onClickRejectOffer(uuID) {
    this.salesService.rejectOffer(uuID).subscribe(data => {
      if (data["success"]) {
      } else {
        //console.log(data)
      }
    });
  };

  productNameToUrl(str){
    str = str.replace(/[^a-zA-Z0-9 ]/g, "");
    str = str.replace(/\s+/g, '-');
    str = encodeURIComponent(str);
    return str;
  };

}
