import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../../services/sales.service';
import { SeoService } from '../../../services/seo.service';
import { ToastrService } from 'ngx-toastr';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-seller-finance',
  templateUrl: './seller-finance.component.html',
  styleUrls: ['./seller-finance.component.css']
})
export class SellerFinanceComponent implements OnInit {

  fulfilments: any;

  fromDate: any;
  toDate: any;
  today: any;
  number: any;
  totalPayment: number;
  totalTransactionFees: number;
  totalIyokusFees: number;
  totalVAT: number;
  totalPayout: number;

  constructor(
    private seoService: SeoService,
    private salesService: SalesService,
    private toastr: ToastrService,
    private calendar: NgbCalendar,
  ) { }

  ngOnInit() {
    this.seoService.setSectionMetadata('My Finance');

    this.today = this.calendar.getToday();
    this.fromDate = this.calendar.getPrev(this.today, 'm', 3);
    this.toDate = this.today;

    var date = {
      fromDate: new Date(this.fromDate),
      toDate: new Date(this.toDate)
    };

    this.salesService.getFulfilments(date).subscribe(data => {
      if (data["success"]) {

        this.fulfilments = data["data"];

        this.totalPayment = this.sum(this.fulfilments, 'totalPrice');
        this.totalTransactionFees = this.sum(this.fulfilments, 'transactionFee');
        this.totalIyokusFees = this.sum(this.fulfilments, 'iyokusFee');
        this.totalVAT = this.sum(this.fulfilments, 'feeVAT', 'transactionVAT');
        this.totalPayout = this.sum(this.fulfilments, 'sellerPayout');

        //filter for totalpayout pending vs completed

      } else {

        this.toastr.error('Error: please try again later or contact us', '', {
          timeOut: 3000
        });

      };
    });

  }

  closeFix(event, datePicker) {
    if (event.target.offsetParent == null)
      datePicker.close();
    else if (event.target.offsetParent.nodeName != "NGB-DATEPICKER")
      datePicker.close();
  }

  onRefresh() {


    var date = {
      fromDate: this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day,
      toDate: this.toDate.year + '-' + this.toDate.month + '-' + this.toDate.day,
    };

    this.salesService.getFulfilments(date).subscribe(data => {
      if (data["success"]) {

        this.fulfilments = data["data"];

        this.totalPayment = this.sum(this.fulfilments, 'totalPrice');
        this.totalTransactionFees = this.sum(this.fulfilments, 'transactionFee');
        this.totalIyokusFees = this.sum(this.fulfilments, 'iyokusFee');
        this.totalVAT = this.sum(this.fulfilments, 'feeVAT');
        this.totalPayout = this.sum(this.fulfilments, 'sellerPayout');


      } else {

        this.toastr.error('Error: please try again later or contact us', '', {
          timeOut: 3000
        });

      };
    });

  };

  sum(items, prop, prop2?) {
    return items.reduce(function (a, b) {
      if (prop2) {
        return a + b[prop] + b[prop2];
      } else {
        return a + b[prop];
      }
    }, 0);
  };



}
