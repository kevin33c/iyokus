import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
//import services
import { ProductsService } from '../../../services/products.service';
import { AuthService } from '../../../services/auth.service';
import { SalesService } from '../../../services/sales.service';
//router to redirect
import { Router } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-preview-product',
  templateUrl: './preview-product.component.html',
  styleUrls: ['./preview-product.component.css']
})
export class PreviewProductComponent implements OnInit {
  product: any;
  number: any;
  seller: any;
  sellerType: string;
  deliveryMethod: string;
  deliveryCost: number;
  selectedDeliveryMethod: string;
  rate: number;
  reviewNumber: number;
  variant1: string[] = [];
  variant2: string[] = [];

  
  constructor(
    public authService: AuthService,
    private productsService: ProductsService,
    private salesService: SalesService,
    private router: Router,
    private toastr: ToastrService,
    private seoService: SeoService,
    private ratingConfig: NgbRatingConfig,
  ) {
    ratingConfig.max = 5;
    ratingConfig.readonly = true;
  }

  ngOnInit() {

    this.seoService.setSectionMetadata('Preview Product');

    //get _id from url
    const id = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
    //add if productID not found then error
    this.productsService.getProduct(id).subscribe(data => {
      //assign product info
      this.product = data;

      if (this.product.deliveryMethod == 0) {
        this.deliveryMethod = 'Meetup Delivery'
      } else if (this.product.deliveryMethod == 1 && this.product.isInternational == false) {
        this.deliveryMethod = 'Postal Delivery'
      } else if (this.product.deliveryMethod == 1 && this.product.isInternational == true) {
        this.deliveryMethod = 'Standard Delivery'
      } else {
        this.deliveryMethod = 'Error!'
      };

      this.selectedDeliveryMethod = this.deliveryMethod;
      this.deliveryCost = this.product.deliveryCost;

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


      if (this.product.success == false) {
        this.toastr.error('Error: please try again later or contact us', '', {
          timeOut: 3000
        });
        return;
      } else {
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

        })
      };
    })
  };

  onChangeDeliveryMethod(x){
    if(x == 'Standard Delivery'){
      this.deliveryCost = this.product.deliveryCost;
    } else if (x == 'Free Delivery'){
      this.deliveryCost = 0;
    } else {
      this.deliveryCost = this.product.deliveryCost;
    }
  }
}
