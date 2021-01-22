import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SalesService } from '../../../services/sales.service';
import { Router } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { DataService } from '../../../services/data.service';
import { ScriptService } from '../../../services/script.service';
import { ToastrService } from 'ngx-toastr';
//spinner
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  order: any;
  offerID: String;
  productName: string;
  paypalLink: any;
  stripeToken: any;
  stripeEmail: any;
  deliveryMethod: any;
  productID: any;
  currency: string;
  acceptPolicy: boolean = true;
  acceptPolicyCoinbase: boolean = true;

  message: any;

  constructor(
    private dataService: DataService,
    private router: Router,
    private salesService: SalesService,
    private location: Location,
    private spinnerService: Ng4LoadingSpinnerService,
    private scriptService: ScriptService,
    private toastr: ToastrService,
    private seoService: SeoService
  ) { }

  ngOnInit() {

    this.seoService.setSectionMetadata('Payment');

    //load Stripe script
    this.scriptService.loadScript('https://checkout.stripe.com/checkout.js');

    this.dataService.currentMessage.subscribe(message => {
      this.order = message;
      if (this.order == undefined || this.order == null) {

        this.toastr.error('Error: please try again by selecting your delivery', '', {
          timeOut: 5000
        });

        this.backClicked();

        return;

      } else {

        this.deliveryMethod = this.order.deliveryMethod;
        this.productID = this.order.productID;
        this.productName = this.order.productName;
        this.currency = this.order.currency;

      };
    });

  };

  backClicked() {
    this.location.back();
  };

  acceptPoliciesStripe() {
    this.acceptPolicy = !this.acceptPolicy;
  }

  acceptPoliciesCoinbase() {
    this.acceptPolicyCoinbase = !this.acceptPolicyCoinbase;
  }


  //STRIPE
  openCheckout() {
    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_live_6xGzehWHFQKhXkkyDvbh8Sk1',
      locale: 'auto', //locale: 'auto',
      //zipCode: true,
      token: token => {
        this.stripeExecute(token.id, token.email);
      }
    });

    handler.open({
      name: 'Iyokus',
      currency: this.currency,
      description: this.order.productName + ' ' + this.order.variant1 + ' ' + this.order.variant2,
      amount: this.order.totalPrice * 100
    })
  };

  stripeExecute(token, email) {

    const order = {
      //payment details
      stripeToken: token,
      stripeEmail: email,
      stripeAmount: this.order.totalPrice * 100,
      //additional record details
      description: this.order.productName,
      type: 'Stripe',
      sellerID: this.order.sellerID,
      userID: this.order.userID,
      offerID: this.order.offerID,
      productID: this.order.productID,
      currency: "gbp",
      amount: this.order.totalPrice
    };

    this.spinnerService.show();

    this.salesService.stripePay(order).subscribe(data => {
      if (data["success"]) {

        this.spinnerService.hide();
        this.router.navigate(['/purchase/confirmation'],
          {
            queryParams:
            {
              total: this.order.totalPrice,
              offid: this.order.offerID,
              paymentId: order.stripeToken,
            }
          });
      } else {
        //stripe payment failed to execute
        this.spinnerService.hide();
        this.newMessage("We're really sorry... an unexpected and unknown error ocurred, don't worry you haven't paid yet. Please try again or contact us if the issue persists.");
        this.router.navigate(['/purchase/error']);
      }
    });
  };


  cryptoPay() {

    const order = {
      name: this.order.productName.substring(0, 99),
      description: this.order.productID,
      productID: this.order.productID,
      amount: this.order.totalPrice,
      offerID: this.order.offerID,
      userID: this.order.userID,
      successRedirect: `/purchase/confirmation?total=${this.order.totalPrice}&offid=${this.order.offerID}&paymentId=crypto`
    };


    this.salesService.coinbasePay(order).subscribe(data => {
      
      if (data["success"]) {
        //navigate to external coinbase payment url
        window.location.href = data["payload"];
      } else {
        //stripe payment failed to execute
        this.spinnerService.hide();
        this.newMessage("We're really sorry... an unexpected and unknown error ocurred, don't worry you haven't paid yet. Please try again or contact us if the issue persists.");
        this.router.navigate(['/purchase/error']);
      }
    });

  };


  newMessage(message) {
    this.dataService.changeMessage(message);
  };

  productNameToUrl(str){
    str = str.replace(/[^a-zA-Z0-9 ]/g, "");
    str = str.replace(/\s+/g, '-');
    str = encodeURIComponent(str);
    return str;
  };

}
