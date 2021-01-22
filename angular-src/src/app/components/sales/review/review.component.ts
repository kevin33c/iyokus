import { Component, OnInit } from '@angular/core';

//router to redirect
import { Router, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { SalesService } from '../../../services/sales.service';
import { SeoService } from '../../../services/seo.service';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { l } from '@angular/core/src/render3';


@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  offerID: string;
  rate: any;
  comment: string;
  order: any;

  constructor(
    private salesService: SalesService,
    private router: Router,
    private toastr: ToastrService,
    private seoService: SeoService,
    private ratingConfig: NgbRatingConfig,
  ) {
    ratingConfig.max = 5;
    ratingConfig.readonly = false;
  }

  ngOnInit() {

    //get url query
    this.offerID = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);

    //document metadata manipulation
    this.seoService.setSectionMetadata('Rate Seller');

    //get order info IF = complete continue, else go to /
    this.salesService.getOrderEx(this.offerID).subscribe(data => {

      if (data['success']) {
        this.order = data['data'];

        if (this.order.orderStatus != 2) {
          this.toastr.error('You can only rate the seller once the order has been completed', '', {
            timeOut: 4000
          });
          //route to home page
          this.router.navigate(['/']);
        }
      }
    })

  }

  onSubmit() {
    //check if rate equal NaN
    if (isNaN(parseFloat(this.rate))) {

      this.toastr.error('Please select a rating to continue', '', {
        timeOut: 3000
      });

      return;
    };

    var review = {
      offerID: this.offerID,
      stars: this.rate,
      comment: this.comment
    };

    this.salesService.reviewSeller(review).subscribe(data => {
      if (data["success"]) {

        this.toastr.success('Your rating has been successfully recorded', '', {
          timeOut: 4000
        });

        //route to home page
        this.router.navigate(['/']);

      } else {

        this.toastr.error(data["msg"], '', {
          timeOut: 3000
        });

        //route to home page
        this.router.navigate(['/']);
      }
    });

  }
}
