import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

import { SeoService } from '../../../services/seo.service';

//import angular forms
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-user-address',
  templateUrl: './user-address.component.html',
  styleUrls: ['./user-address.component.css']
})

export class UserAddressComponent implements OnInit {

  userID: String;
  name: String;
  country: String = 'GB';
  postcode: String;
  address1: String;
  address2: String;
  city: String;
  region: String;
  phone: String;

  user: any;
  addresses: any;
  address: any;

  fullname: String;

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
    private authService: AuthService,
    private userService: UserService,
    private toastr: ToastrService,
    private seoService: SeoService
  ) {

  }

  ngOnInit() {
    this.seoService.setSectionMetadata('My Address');

    //get data from db
    this.renderData();
  }


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
      phone: this.phone
    }

    //upload product information to db
    this.userService.uploadAddress(address).subscribe(data => {
      if (data["success"]) {
        //refresh data
        this.renderData();
        this.toastr.success('Address added', '', {
          timeOut: 3000
        });
      } else {
        this.onFailed();
      }
    })
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
  }

  onDeleteRequest(_id) {

    const id = _id

    this.userService.deleteAddress(id).subscribe(data => {

      if (data["success"]) {
        //refresh data
        this.renderData();
        this.toastr.info('Address deleted', '', {
          timeOut: 3000
        });
      } else {
        this.onFailed();
      }
    })

  }

  async renderData() {
    
    delay(1000);

    this.authService.getProfile().subscribe(profile => {
      this.user = profile["user"]

      this.userID = this.user._id

      this.userService.getAddressView(this.userID).subscribe(data => {
        if (data["success"] == false) {
          
          return this.addresses = undefined;

        } else {

          return this.addresses = data;

        };
      });
    });
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
      phone: this.phone
    };

    //upload product information to db
    this.userService.editAddress(UpdatedAddress).subscribe(data => {
      if (data["success"]) {
        //refresh data
        this.renderData();
        this.toastr.info('Address edited', '', {
          timeOut: 3000
        });
      } else {
        this.onFailed();
      }
    });

  };

  onClickSetDefault(_id) {
    this.userService.defaultAddress(_id).subscribe(data => {
      if (data["success"]) {
        //refresh data
        this.renderData();
        this.toastr.info('Default address selected', '', {
          timeOut: 3000
        });
      } else {
        this.onFailed();
      }
    });
  };

  onFailed() {
    this.toastr.error('Error: please try again later or contact us', '', {
      timeOut: 3000
    });
  }

}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}