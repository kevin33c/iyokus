import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { SalesService } from '../../../services/sales.service';
import { ProductsService } from '../../../services/products.service';
import { SeoService } from '../../../services/seo.service';
import { DataService } from '../../../services/data.service';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-choose-address',
  templateUrl: './choose-address.component.html',
  styleUrls: ['./choose-address.component.css']
})
export class ChooseAddressComponent implements OnInit {

  user: any;
  addresses: any;
  offerID: String;
  productID: String;
  productName: String;
  image_Main: String;
  storedAddressAvailable: boolean = false;
  deliveryMethod: number;

  order: any;
  //order
  price: number;
  quantity: number;
  deliveryAddress: any;
  sellerID: any;
  userID: any;
  currency: String = "gbp";
  //order

  offer: any;
  product: any;
  query: String;
  address: any;

  name: String;
  country: String;
  postcode: String;
  address1: String;
  address2: String;
  city: String;
  region: String;
  phone: String;
  fullname: String;
  variant1: string;
  variant2: string;
  deliveryCost: number;
  selectedDeliveryMethod: string;

  //form
  form = new FormGroup({
    fullname: new FormControl('', Validators.minLength(2)),
    country: new FormControl({ value: '', disabled: true }, Validators.minLength(2)),
    postCode: new FormControl('', Validators.minLength(1)),
    address1: new FormControl('', Validators.minLength(2)),
    address2: new FormControl(''),
    city: new FormControl('', Validators.required),
    region: new FormControl('', Validators.required),
    phone: new FormControl('')
  });


  constructor(
    private dataService: DataService,
    private productsService: ProductsService,
    private salesService: SalesService,
    private authService: AuthService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private location: Location,
    private seoService: SeoService
  ) { }

  ngOnInit() {

    this.seoService.setSectionMetadata('Delivery');

    //get all params from url
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.productID = params['prod_id'];
      this.offerID = params['ord_id'];
      this.quantity = params['ord_qty'];
      this.variant1 = params['var1'];
      this.variant2 = params['var2'];
      this.deliveryCost = Number(params['del']);
    });


    //get product information! and check for product availability before continuing
    this.productsService.searchPublishedProduct(this.productID).subscribe(data => {

      if (data['success'] != false) {

        this.product = data;
        this.deliveryMethod = this.product.deliveryMethod;


        /****CHECK IF PRODUCT STILL VALID!!!!!****/
        if (this.quantity > this.product.quantity) {
          this.toastr.error('Error: the product seems to be out of stock', '', {
            timeOut: 5000
          });

          return this.backClicked();
        };
        /****CHECK IF PRODUCT STILL VALID!!!!!****/

        /****UNLESS THERE IS A VALID OFFER ALWAYS USE LISTED PRICE AND SELECTED QUANTITY****/
        this.salesService.getValidOffer(this.offerID).subscribe(data => {
          this.offer = data;

          //if offer exist AND valid the get offer values
          if (this.offer.uuID) {

            /****CHECK IF PRODUCT STILL VALID!!!!!****/
            if (this.offer.offer_quantity > this.product.quantity) {
              this.toastr.error('Error: the product seems to be out of stock', '', {
                timeOut: 5000
              });

              this.backClicked();
            };
            /****CHECK IF PRODUCT STILL VALID!!!!!****/

            this.offerID = this.offer.uuID
            this.sellerID = this.offer.sellerID
            this.price = this.offer.value;
            this.quantity = this.offer.offer_quantity;
            this.productName = this.offer.productName;
            this.image_Main = this.offer.image_Main;

            this.variant1 = this.offer.variant1;
            this.variant2 = this.offer.variant2;
            this.deliveryCost = Number(this.product.deliveryCost);


            if (this.deliveryCost > 0) {
              this.selectedDeliveryMethod = 'Standard Delivery'
            } else if (this.deliveryCost == 0) {
              this.selectedDeliveryMethod = 'Free Delivery'
            } else {
              this.selectedDeliveryMethod = 'Error!'
            };

          } else {

            //get product info IF not offers
            this.sellerID = this.product.sellerID
            this.price = this.product.listed_price;
            this.productName = this.product.name;
            this.image_Main = this.product.image_Main;


            if (this.deliveryCost > 0) {
              this.selectedDeliveryMethod = 'Standard Delivery'
            } else if (this.deliveryCost == 0) {
              this.selectedDeliveryMethod = 'Free Delivery'
            } else {
              this.selectedDeliveryMethod = 'Error!'
            };

          };
        });




      } else {

        this.toastr.error('Error: please try again later or contact us', '', {
          timeOut: 5000
        });

        this.backClicked();

      };
    });


    //get profile
    this.authService.getProfile().subscribe(data => {

      //get u id
      this.user = data["user"];

      this.userID = this.user._id;


      this.userService.getAddressView(this.userID).subscribe(data => {
        if (data["success"] == false) {

          //update available address flag
          this.storedAddressAvailable = false;

        } else {

          //get all recorded addresses
          this.addresses = data;
          //get default address
          this.deliveryAddress = this.addresses[0];
          //update available address flag
          this.storedAddressAvailable = true;

        };
      });
    });

  };


  /************************ADDRESS MANAGEMENT************************/
  onClickAdd() {
    const address = {
      userID: this.user._id,
      type: "user",
      fullname: this.name,
      country: this.country,
      postCode: this.postcode,
      address1: this.address1,
      address2: this.address2,
      city: this.city,
      region: this.region,
      phone: this.phone,
    };

    //upload product information to db
    this.userService.uploadAddress(address).subscribe(data => {
      if (data["success"]) {
        //refresh data
        this.renderData();
        this.deliveryAddress = address;

        window.scrollTo(0, 0);

        this.toastr.success('Address added', '', {
          timeOut: 3000
        });
      } else {
        this.toastr.error('Error: please try again later or contact us', '', {
          timeOut: 3000
        });
      };
    });
  };

  getData(address) {
    this.address = address;

    this.form.get("fullname").setValue(this.address.fullname);
    this.form.get("country").setValue(this.address.country);
    this.form.get("postCode").setValue(this.address.postCode);
    this.form.get("address1").setValue(this.address.address1);
    this.form.get("address2").setValue(this.address.address2);
    this.form.get("city").setValue(this.address.city);
    this.form.get("region").setValue(this.address.region);
    this.form.get("phone").setValue(this.address.phone);

  };

  onClickUpdate(_id) {

    const UpdatedAddress = {
      _id: _id,
      fullname: this.fullname,
      country: this.country,
      postCode: this.postcode,
      address1: this.address1,
      address2: this.address2,
      city: this.city,
      region: this.region,
      phone: this.phone,
    };

    //upload product information to db
    this.userService.editAddress(UpdatedAddress).subscribe(data => {
      if (data["success"]) {
        //refresh data
        this.renderData();
        window.scrollTo(0, 0);

        this.toastr.info('Address edited', '', {
          timeOut: 3000
        });
      } else {
        this.toastr.error('Error: please try again later or contact us', '', {
          timeOut: 3000
        });
      };
    });
  };


  onClickSelectAddress(address) {
    this.deliveryAddress = address;
  };


  renderData() {

    this.userService.getAddressView(this.userID).subscribe(data => {
      if (data["success"] == false) {

        //update available address flag
        this.storedAddressAvailable = false;

      } else {

        //get all recorded addresses
        this.addresses = data;
        //get default address
        this.deliveryAddress = this.addresses[0];
        //update available address flag
        this.storedAddressAvailable = true;

      };
    });
  };

  /************************ADDRESS MANAGEMENT END************************/

  onClickSelectDeliveryMethod() {
    if (this.selectedDeliveryMethod == 'Free Delivery') {
      this.deliveryCost = 0;
    } else if (this.selectedDeliveryMethod == 'Standard Delivery') {
      this.deliveryCost = this.product.deliveryCost;
    }
  };

  /************************CREATE STAGING ORDER************************/
  //create temp order
  onClickCreateOrder() {

    if (this.deliveryMethod == 1) {

      var order = {
        //IDs
        offerID: this.offerID,
        productID: this.productID,
        sellerID: this.sellerID,
        userID: this.userID,
        deliveryMethod: this.deliveryMethod,
        //delivery address inf
        ProductType: this.product.type,
        name: this.deliveryAddress.fullname,
        country: this.deliveryAddress.country,
        postCode: this.deliveryAddress.postCode,
        address1: this.deliveryAddress.address1,
        address2: this.deliveryAddress.address2,
        city: this.deliveryAddress.city,
        region: this.deliveryAddress.region,
        phone: this.deliveryAddress.phone,
        //offer infor
        productName: this.productName,
        image_Main: this.image_Main,
        currency: this.currency,
        price: this.price,
        quantity: this.quantity,
        deliveryFee: this.deliveryCost,
        variant1: this.variant1,
        variant2: this.variant2,
        
        isInternational: this.product.isInternational,
        /*
        isReferenced: this.product.isReferenced,
        referenceURL: this.product.referenceURL,
        referenceID: this.product.referenceID,
        */
        totalPrice: this.round((this.price * this.quantity) + this.deliveryCost, 2)
      };

    } else if (this.deliveryMethod == 0) {

      var order = {
        //IDs
        offerID: this.offerID,
        productID: this.productID,
        sellerID: this.sellerID,
        userID: this.userID,
        deliveryMethod: this.deliveryMethod,
        //delivery address as null if meeting delivery
        ProductType: this.product.type,
        name: null,
        country: null,
        postCode: null,
        address1: null,
        address2: null,
        city: null,
        region: null,
        phone: null,
        //offer infor
        productName: this.productName,
        image_Main: this.image_Main,
        currency: this.currency,
        price: this.price,
        quantity: this.quantity,
        deliveryFee: 0,
        variant1: this.variant1,
        variant2: this.variant2,
        
        isInternational: this.product.isInternational,
        /*
        isReferenced: this.product.isReferenced,
        referenceURL: this.product.referenceURL,
        referenceID: this.product.referenceID,
        */
        totalPrice: this.round((this.price * this.quantity), 2)
      };

    };

    //PASS INFO TO PAYMENT
    this.newMessage(order);

    //record staging order
    this.salesService.recordStagingOrder(order).subscribe(data => {
      if (data["success"]) {

        return;

      } else {

        this.toastr.error('Error: please try again later or contact us', '', {
          timeOut: 5000
        });

        this.backClicked();

      };
    });
  };

  /************************CREATE STAGING ORDER************************/


  backClicked() {
    this.location.back();
  };

  newMessage(message) {
    this.dataService.changeMessage(message);
  };


  round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  };

  productNameToUrl(str){
    str = str.replace(/[^a-zA-Z0-9 ]/g, "");
    str = str.replace(/\s+/g, '-');
    str = encodeURIComponent(str);
    return str;
  };

}


