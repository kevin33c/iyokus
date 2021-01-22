import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
//router to redirect
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';

//import service
import { ProductsService } from '../../../services/products.service';
import { DataService } from '../../../services/data.service';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css']
})
export class ViewProductsComponent implements OnInit {

  page: number = 1;
  user: Object;
  products: any;
  sellerID: String;
  status: String;
  images: String[];
  sortLogic: Number = 6;
  rowsOnPage: Number = 10;
  //p: any;
  productFound: boolean;
  p: any;

  view: String = "All";

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private productsService: ProductsService,
    public dataService: DataService,
    private seoService: SeoService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.seoService.setSectionMetadata('My Products');
    //parse page number
    this.parsePageParam();
    //refresh data
    this.renderData();
  };

  renderData() {
    const status = {
      status: this.view
    }
    this.productsService.getProductsView(status).subscribe(data => {
      this.products = data;

      if (this.products.success == false) {
        this.toastr.error('Error: please try again later or contact us', '', {
          timeOut: 3000
        });
        this.router.navigate(['/']);
        return;

      } else if (this.products.found == false) {
        this.productFound = false;
      } else {
        this.productFound = true;
      }
    })
  };

  onClickPublish(_id) {
    const id = _id;
    this.productsService.publishProduct(id).subscribe(data => {
      if (data["success"]) {
        //refresh data
        this.renderData();
        this.toastr.success('Product Published', '', {
          timeOut: 3000
        });
      } else {
        this.toastr.error('Error: please try again later or contact us', '', {
          timeOut: 3000
        });
      }
    })
  };

  onClickTakeDown(_id) {
    const id = _id;
    this.productsService.takeDownProduct(id).subscribe(data => {
      if (data["success"]) {
        //refresh data
        this.renderData();
        this.toastr.warning('Product Inactivated', '', {
          timeOut: 3000
        });
      } else {
        this.toastr.error('Error: please try again later or contact us', '', {
          timeOut: 3000
        });
      }
    })
  };

  onDeleteRequest(id, name) {

    this.productsService.getProductToDelete(id).subscribe(data => {
      if (data["success"]) {
        this.toastr.info(name + ' deleted', '', {
          timeOut: 3000
        });
        //refresh data
        this.renderData();

      } else {
        this.toastr.error('Error: please try again later or contact us', '', {
          timeOut: 3000
        });
      }
    })
  };

  onChangeSort() {
    //sort lowest price first
    if (this.sortLogic == 2) {
      this.products.sort(function (a, b) {
        return a.listed_price - b.listed_price;
      });
      //sort highest price first
    } else if (this.sortLogic == 3) {
      this.products.sort(function (a, b) {
        return b.listed_price - a.listed_price;
      });
      //sort date newest first
    } else if (this.sortLogic == 6) {
      this.products.sort(function (a, b) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      //sort date oldest first
    } else if (this.sortLogic == 7) {
      this.products.sort(function (a, b) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
    }
  };

  goTop() {
    window.scrollTo(0, 0);
  };


  newMessage(message) {
    this.dataService.changeMessage(message);
  }


  changePage(p) {
    this.page = p;
    //nagivate to search page
    this.router.navigate(['/business/viewproduct'], { queryParams: { page: p } });
  }

  parsePageParam() {
    //get keyword from url
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.page = params['page'];
    });
  }

}





