import { Component, OnInit } from '@angular/core';
//router to redirect
import { Router, NavigationEnd } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

//import services
import { ProductsService } from '../../../services/products.service';
import { AuthService } from '../../../services/auth.service';
import { SalesService } from '../../../services/sales.service';
import { SeoService } from '../../../services/seo.service';


@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.css']
})
export class ViewOrderComponent implements OnInit {

  offerID: string;
  order: any;
  userEmail: string;
  paymentCode: string;
  product: any;
  orderStatus: String;
  seller: any;
  productType: string;
  deliveryFee: any;
  number: any;
  post: boolean;
  composedMessage: string;
  reason: string;
  claimReason: string;
  refundPossible: boolean;
  claimPossible: boolean;
  refundPossibleText: string;
  today = new Date();
  reviewExist: boolean;


  constructor(
    private productsService: ProductsService,
    public authService: AuthService,
    private salesService: SalesService,
    private router: Router,
    private seoService: SeoService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {

    //get url query
    this.offerID = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);

    //document metadata manipulation
    this.seoService.setSectionMetadata('Order Details ' + this.offerID);

    //get seller info
    this.salesService.getOrderEx(this.offerID).subscribe(data => {
      if (data['success']) {

        this.order = data['data'];

        if (this.order.deliveryMethod == 0) {
          this.claimReason = 'After 2 days of the order, the seller has not contacted me to arrange a delivery';
        } else if (this.order.deliveryMethod == 1) {
          this.claimReason = 'It has been longer than the delivery time described and I have not received the order yet.';
        }


        //get product information
        this.productsService.searchPublishedProductEx(this.order.productID).subscribe(data => {
          this.product = data

          if (this.product.type == 0) {

            this.productType = 'Used';

          } else if (this.product.type == 1) {

            this.productType = 'New';

          };

          //check if review exists
          var ID = {
            offerID: this.offerID
          }

          this.salesService.checkReview(ID).subscribe(data => {

            if (data["success"]) {

              this.reviewExist = true;

            } else if (!data["success"]) {

              this.reviewExist = false;

            }

            this.refundDateChecker();
            this.claimDateChecker();
          });



        });



        //get seller info
        this.authService.getSellerProfile(this.order.sellerID).subscribe(data => {
          this.seller = data;
        });


        if (this.order.orderStatus == 0) {

          this.orderStatus = 'Open';

        } else if (this.order.orderStatus == 1) {

          this.orderStatus = 'Dispatched';

        } else if (this.order.orderStatus == 2) {

          this.orderStatus = 'Completed';

        } else if (this.order.orderStatus == 3) {

          this.orderStatus = 'Cancelled';

        };


        if (this.order.deliveryFee === null || this.order.deliveryFee === undefined || this.order.deliveryFee === 0) {
          this.post = false;
          this.deliveryFee = 'FREE';
        } else {
          this.post = true;
        };


      } else {

        this.toastr.error('Error: please try again later or contact us', '', {
          timeOut: 3000
        });

      };

    });
  };


  refund() {

    var payload = {
      offerID: this.offerID,
      reason: this.reason,
    }

    this.salesService.refund(payload).subscribe(data => {
      if (data["success"]) {

        this.toastr.info('Return request sent', '', {
          timeOut: 5000
        })

        this.router.navigate(['/user/yourorders']);

      } else {
        this.toastr.error('Error: please try again later or contact us', '', {
          timeOut: 3000
        })
      }
    })
  }


  claim() {

    var claim = {
      sellerID: this.order.sellerID,
      offerID: this.offerID,
      reason: this.claimReason,
      comment: this.composedMessage,
    }

    this.salesService.claim(claim).subscribe(data => {
      if (data["success"]) {

        this.toastr.info('Claim sent', '', {
          timeOut: 5000
        })

        this.router.navigate(['/user/yourorders']);

      } else {
        this.toastr.error('Error: please try again later or contact us', '', {
          timeOut: 3000
        })
      }
    })
  }

  claimDateChecker() {
    //if meeting delivery
    if (this.order.deliveryMethod == 0
      && this.order.orderStatus == 0
    ) {
      this.claimPossible = true;
      return;
    }

    //if post delivery
    if (this.order.deliveryMethod == 1
      && (this.order.orderStatus == 1 || this.order.orderStatus == 0)
    ) {
      this.claimPossible = true;
      return;
    }

    this.claimPossible = false;
    return;

  }

  refundDateChecker() {
    //used
    if (this.product.type == 0) {
      //0 -> meeting delivery 1-> post delivery
      //0 Order Received -> 1 Dispatched -> 2 Completed -> 3 cancelled/refunded
      if (
        this.order.deliveryMethod == 1
        && this.order.orderStatus == 1
        && this.today <= this.addDays(this.order.lastEditDate, 4)
        && this.today >= this.addDays(this.order.lastEditDate, 3)
        && !this.reviewExist
      ) {
        this.refundPossible = true;
        return;
      } else if (
        this.order.deliveryMethod == 0
        && this.order.orderStatus == 2
        && this.today <= this.addDays(this.order.lastEditDate, 1)
        && !this.reviewExist
      ) {
        this.refundPossible = true;
        return;
      } else {
        this.refundPossible = false; //false
        return;
      }
    }

    //new
    if (this.product.type == 1) {
      if (
        this.order.deliveryMethod == 0
        && this.order.orderStatus == 2
        && this.today <= this.addDays(this.order.lastEditDate, 14)
        && !this.reviewExist
      ) {
        this.refundPossible = true;
        return;
      } else if (
        this.order.deliveryMethod == 1
        && this.order.orderStatus == 2
        //&& this.today <= this.addDays(this.order.lastEditDate, 17)
        //&& this.today >= this.addDays(this.order.lastEditDate, 3)
        //&& !this.reviewExist
      ) {
        this.refundPossible = true;
        return;
      } else {
        this.refundPossible = false; //false
        return;
      }

    }

  };

  addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  productNameToUrl(str){
    str = str.replace(/[^a-zA-Z0-9 ]/g, "");
    str = str.replace(/\s+/g, '-');
    str = encodeURIComponent(str);
    return str;
  };

}
