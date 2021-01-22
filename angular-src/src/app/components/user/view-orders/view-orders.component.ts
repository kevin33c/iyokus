import { Component, OnInit } from '@angular/core';

import { SalesService } from '../../../services/sales.service';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.css']
})
export class ViewOrdersComponent implements OnInit {

  products: any;
  view: string = 'All';
  filteredProducts: any;
  rowsOnPage: Number = 10;
  p: any;

  constructor(
    private salesService: SalesService,
    private seoService: SeoService
  ) { }

  ngOnInit() {

    this.seoService.setSectionMetadata('My Orders');

    this.salesService.getOrderByUserID().subscribe(data => {
      if (data["success"] != false) {
        this.products = data;
        this.filteredProducts = this.products;
        //set orders filter as default
        this.onChangeFilter(this.view);

      } else {

      }
    }
    );
  };

  onChangeFilter(status) {
    if(status === 'All'){
      this.filteredProducts = this.products
    } else {
      this.filteredProducts = this.products.filter(function (el) {
        return (Number(el.orderStatus) == Number(status));
      });
    };
  };

  goTop() {
    window.scrollTo(0, 0);
  };

  productNameToUrl(str){
    str = str.replace(/[^a-zA-Z0-9 ]/g, "");
    str = str.replace(/\s+/g, '-');
    str = encodeURIComponent(str);
    return str;
  };
}
