import { Component, OnInit } from '@angular/core';

//router to redirect
import { Router, NavigationEnd } from '@angular/router';
//spinner
import { ToastrService } from 'ngx-toastr';

//import angular forms
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

//import services
import { ProductsService } from '../../../services/products.service';
import { AuthService } from '../../../services/auth.service';
import { SalesService } from '../../../services/sales.service';
import { SeoService } from '../../../services/seo.service';
import { WebsocketService } from '../../../services/websocket.service'

@Component({
  selector: 'app-seller-order',
  templateUrl: './seller-order.component.html',
  styleUrls: ['./seller-order.component.css']
})
export class SellerOrderComponent implements OnInit {


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
  disableCodeInput: boolean = true;
  composedMessage: string;
  conversationExists: boolean;
  delCompany: string;
  delRef: string;
  reason: string;
  claimMessage: string;
  claimPossible: boolean;
  today = new Date();


  constructor(
    private productsService: ProductsService,
    public authService: AuthService,
    private salesService: SalesService,
    private router: Router,
    private toastr: ToastrService,
    private seoService: SeoService,
    private websocketService: WebsocketService,
  ) { }

  ngOnInit() {

    //get url query
    this.offerID = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);

    //document metadata manipulation
    this.seoService.setSectionMetadata('Order Details ' + this.offerID);

    //get seller info
    this.salesService.getOrder(this.offerID).subscribe(data => {
      if (data['success']) {

        this.order = data['data'];

        //connnect to socket io iyokus main room
        this.websocketService.join("iyokus main");
        //default msg
        this.composedMessage = 'Hello, thank for your order for: "' + this.order.productName + '"! Where and when would it be best for you to meet to receive the item?'


        //check if previous conversation exists
        this.websocketService.checkConversation(this.order.offerID).subscribe(data => {

          if (data["success"]) {

            this.conversationExists = true

          } else {

            this.conversationExists = false

          }
        });


        //get product information
        this.productsService.searchPublishedProductEx(this.order.productID).subscribe(data => {
          this.product = data

          if (this.product.type == 0) {

            this.productType = 'Used';

          } else if (this.product.type == 1) {

            this.productType = 'New';

          };

          this.claimDateChecker();

        });

        //get seller info
        this.authService.getSellerProfile(this.order.sellerID).subscribe(data => {
          this.seller = data;
        });


        if (this.order.orderStatus == 0) {

          this.orderStatus = 'Open';
          this.disableCodeInput = false;

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

        this.authService.getEmail(this.order.userID).subscribe(data => {
          if (data['success']) {

            this.userEmail = data['data'];

          }
        });

      } else {

        this.toastr.error('Error: please try again later or contact us', '', {
          timeOut: 3000
        });

      };

    });
  };


  onSubmit() {

    if (this.paymentCode === null || this.paymentCode === undefined || this.paymentCode.length < 6) {

      this.toastr.error("Invalid payment code", '', {
        timeOut: 3000
      });

      return;
    };

    var payload = {
      offerID: this.offerID,
      paymentCode: this.paymentCode
    };

    //get seller info
    this.salesService.fulfilment(payload).subscribe(data => {
      if (data['success']) {

        this.toastr.success("Order completed!", '', {
          timeOut: 5000
        });

        this.router.navigate(['/business/orders']);

      } else {

        this.toastr.error(data['msg'], '', {
          timeOut: 3000
        });

      }
    });
  };


  claimDateChecker() {
    if (
      this.order.orderStatus == 3
      && this.today <= this.addDays(this.order.lastEditDate, 7)
    ) {
      this.claimPossible = true;
      return;
    }
    this.claimPossible = false;
    return;
  }

  claim() {

    var claim = {
      sellerID: this.order.sellerID,
      offerID: this.offerID,
      reason: this.reason,
      comment: this.claimMessage,
    }

    this.salesService.claim(claim).subscribe(data => {
      if (data["success"]) {

        this.toastr.info('Claim sent', '', {
          timeOut: 5000
        })

        this.router.navigate(['/business/orders']);

      } else {
        this.toastr.error('Error: please try again later or contact us', '', {
          timeOut: 3000
        })
      }
    })
  }


  onClickChangeStatusToDispatched() {

    var payload = {
      offerID: this.offerID,
      delCompany: this.delCompany,
      delRef: this.delRef,
    };

    this.salesService.fulfilmentEx(payload).subscribe(data => {
      if (data["success"]) {

        this.toastr.info('Change status changed to "Dispatched"', '', {
          timeOut: 5000
        });

        this.router.navigate(['/business/orders']);

      } else {
        this.toastr.error('Error: please try again later or contact us', '', {
          timeOut: 3000
        });
      }
    }
    );
  };


  contactUser() {

    if (this.composedMessage === '' || this.composedMessage === undefined || this.composedMessage === null) {
      return;
    };


    var msg = {
      composedMessage: this.composedMessage,
      offerID: this.order.offerID,
    };

    this.websocketService.createConversation(this.order.userID, msg).subscribe(data => {
      if (data["success"]) {

        //send composedMessage to socket io iyokus main room
        this.websocketService.sendMessage("iyokus main");

        this.toastr.info('Conversation initiated', '', {
          timeOut: 5000
        });

        this.router.navigate(['/messenger', this.order.offerID]);

      } else {

        this.toastr.error('Error: please try again later or contact us', '', {
          timeOut: 3000
        });
      }
    });
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
