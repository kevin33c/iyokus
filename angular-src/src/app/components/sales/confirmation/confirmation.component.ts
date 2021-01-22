import { Component, OnInit } from '@angular/core';
//router to redirect
import { Router, NavigationEnd, ActivatedRoute, Params } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { SalesService } from '../../../services/sales.service';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

  StagingOrder: any;
  IDs: any;
  verificationCode: any;
  number: any;


  constructor(
    private dataService: DataService,
    private salesService: SalesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private seoService: SeoService
  ) { }

  ngOnInit() {

    this.seoService.setSectionMetadata('Order Confirmation');

    //get params from url
    this.activatedRoute.queryParams.subscribe((params: Params) => {

      const IDs = {
        total: params['total'],
        offerID: params['offid'],
        paymentId: params['paymentId'],
      };

      //document tile manipulation
      document.title = 'Order Confirmation #' + params['offid'];

      this.IDs = IDs;

      //move staging order to order

      this.recordPurchase(IDs);

      //delete offer once sales completed
      this.salesService.deleteOffer(IDs.offerID).subscribe(data => {
        if (data["success"]) {
          //console.log('offer deleted')
        } else {

        };
      });
    });

  };

  //record purchase in order and payment
  recordPurchase(IDs) {

    if (this.IDs.paymentId == 'crypto') {

      this.salesService.getStagingOrder(IDs.offerID).subscribe(data => {
        if (data["success"] != false) {
          //get order information from staging order
          this.StagingOrder = data;

          //record order
          const order = {
            offerID: this.StagingOrder.offerID,
          };

          /*****************************************************************************
          * RECORD CRYPTO PAYMENT ORDER
          *****************************************************************************/
          //record order
          this.salesService.recordCryptoOrder(order).subscribe(data => {
            if (data["success"]) {

              //get verification code
              this.verificationCode = data["code"];

              return;

            } else {
              //error in recording payment
              this.newMessage("We are really sorry... You have completed the payment, however it seems that the order has failed to register due to unknown and unexpected error. Don't worry, please contact us at client@iyokus.com with the following order number and we will take care of it: " + this.StagingOrder.offerID);

              this.router.navigate(['/purchase/error']);
              return;
            }
          });


        } else {
          //error in getting staging order
          this.newMessage("We are really sorry... You have completed the payment, however it seems that the order has failed to register due to unknown and unexpected error. Don't worry, please contact us at client@iyokus.com with the following order number and we will take care of it: " + this.StagingOrder.offerID);

          this.router.navigate(['/purchase/error']);

          return;
        }
      });

    } else {

      //get staging order infor
      this.salesService.getStagingOrder(IDs.offerID).subscribe(data => {
        if (data["success"] != false) {

          //get order information from staging order
          this.StagingOrder = data;

          /*****************************************************************************
          * RECORD ORDER
          *****************************************************************************/

          //record order
          const order = {
            offerID: this.StagingOrder.offerID,
          };


          //record order
          this.salesService.recordOrder(order).subscribe(data => {
            if (data["success"]) {
              //get verification code
              this.verificationCode = data["code"];

              return;

            } else {
              //error in recording payment
              this.newMessage("We are really sorry... You have completed the payment, however it seems that the order has failed to register due to unknown and unexpected error. Don't worry, please contact us at client@iyokus.com with the following order number and we will take care of it: " + this.StagingOrder.offerID);

              this.router.navigate(['/purchase/error']);
              return;
            }
          });
          /*****************************************************************************
          * RECORD ORDER
          *****************************************************************************/

        } else {
          //error in getting staging order
          this.newMessage("We are really sorry... You have completed the payment, however it seems that the order has failed to register due to unknown and unexpected error. Don't worry, please contact us at client@iyokus.com with the following order number and we will take care of it: " + this.StagingOrder.offerID);

          this.router.navigate(['/purchase/error']);

          return;
        }
      });
    }
  }



  newMessage(message) {
    this.dataService.changeMessage(message)
  };

}
