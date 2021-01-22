import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
//router to redirect
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SeoService } from '../../../services/seo.service';
import { SalesService } from '../../../services/sales.service';

@Component({
  selector: 'app-bid',
  templateUrl: './bid.component.html',
  styleUrls: ['./bid.component.css']
})
export class BidComponent implements OnInit {

  offer: any;
  discount: Number;
  number: any;

  constructor(
    private salesService: SalesService,
    private router: Router,
    private location: Location,
    private toastr: ToastrService,
    private seoService: SeoService,
  ) { }

  ngOnInit() {

    this.seoService.setSectionMetadata('Bids and Offers');

    //get url query
    const id = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
    //pass http request
    this.salesService.getValidOffer(id).subscribe(data => {
      if (data['success'] == false) {

        this.toastr.error('Error: please try again later or contact us.', '', {
          timeOut: 3000
        });

        this.backClicked();

      } else {

        this.offer = data;

        //calculate discount
        this.discount = (this.offer.listed_price - this.offer.value) / this.offer.listed_price;

      };

    });
  };


  onClickAcceptOffer() {

    this.salesService.acceptOffer(this.offer.uuID).subscribe(data => {
      if (data["success"]) {

        this.router.navigate(['/purchase/selectaddress'], { queryParams: { ord_id: this.offer.uuID, prod_id: this.offer.productID } });

      } else {

        this.toastr.error('Error: please try again later or contact us.', '', {
          timeOut: 3000
        });

      };
    });

  };

  onClickRejectOffer() {

    this.salesService.rejectOffer(this.offer.uuID).subscribe(data => {
      if (data["success"]) {

        this.backClicked()

      } else {

        this.toastr.error('Error: please try again later or contact us.', '', {
          timeOut: 3000
        });

      }
    });

  };

  backClicked() {

    this.location.back();

  };
}
