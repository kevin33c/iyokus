import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../../services/sales.service';
import { SeoService } from '../../../services/seo.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-seller-orders',
  templateUrl: './seller-orders.component.html',
  styleUrls: ['./seller-orders.component.css']
})
export class SellerOrdersComponent implements OnInit {

  products: any;
  product: any;
  view: string = '0';
  filteredProducts: any;
  userEmail: any;
  rowsOnPage: Number = 10;
  p: any;

  constructor(
    private salesService: SalesService,
    private seoService: SeoService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {

    this.seoService.setSectionMetadata('My Orders');

    this.render()
  };


  render() {
    this.salesService.getOrderBySellerID().subscribe(data => {
      if (data["success"] != false) {

        this.products = data;
        this.filteredProducts = this.products
        this.onChangeFilter(this.view)
        
      } else {

        this.toastr.error('Error: please try again later or contact us', '', {
          timeOut: 3000
        });

      };
    });
  };

  onChangeFilter(status) {
    if (status === 'All') {
      this.filteredProducts = this.products
    } else {
      this.filteredProducts = this.products.filter(function (el) {
        return (Number(el.orderStatus) == Number(status));
      });
    }
  };

  goTop(){
    window.scrollTo(0, 0);
  };

  productNameToUrl(str){
    str = str.replace(/[^a-zA-Z0-9 ]/g, "");
    str = str.replace(/\s+/g, '-');
    str = encodeURIComponent(str);
    return str;
  };
}
