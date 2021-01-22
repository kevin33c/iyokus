import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
//import service
import { AuthService } from '../../../services/auth.service';
import { ValidateService } from '../../../services/validate.service';
import { SeoService } from '../../../services/seo.service';
import { DataService } from '../../../services/data.service';
import { Regions } from '../../../models/regions';
//router to redirect
import { Router } from '@angular/router';
//import angular forms
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';


@Component({
  selector: 'app-seller-edit',
  templateUrl: './seller-edit.component.html',
  styleUrls: ['./seller-edit.component.css']
})
export class SellerEditComponent implements OnInit {

  userName: String;
  email: String;
  email2: String;
  password: String;
  password2: String;
  user: any;
  location: String[] = [];
  regionsList: Regions[];
  regions: string[];
  bankName: string;

  //payment information
  firstName: string;
  lastName: string;
  //birthDay: any;
  country: string = 'GB';
  postCode: string;
  address1: string;
  address2: string;
  city: string;
  region: string;
  iban: string = 'n/a';
  sortCode: string;
  sortCodeField1: string;
  sortCodeField2: string;
  sortCodeField3: string;
  accountNumber: string;

  payment: any;

  //form
  form = new FormGroup({
    userName: new FormControl('', Validators.minLength(2)),
    email: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    prefix: new FormControl('', Validators.required),
    mobile: new FormControl('', Validators.required),
  });


  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private toastr: ToastrService,
    private seoService: SeoService,
    private dataService: DataService,
    private router: Router,
  ) { }

  ngOnInit() {

    //metadata manipulation
    this.seoService.setSectionMetadata('Edit Profile Information');

    //use data service to query all ESRegions
    this.regionsList = this.dataService.getRegions();

    //get only the name attribute of ESRegions
    this.regions = this.getName(this.regionsList);

    //render page
    this.renderPage()

  };

  //get all the Name attribute from data service ESRegions
  getName(data) {
    var standardName = [];
    for (var i = 0; i < data.length; i++) {
      standardName.push(data[i].standardName);
    }
    return standardName;
  };

  //add item to location list
  onItemAdded(a) {
    this.location.push(a.display)
  };

  //remove item from location list
  onItemRemoved(a) {
    //if removing a pre-existing item then select as it is
    if (a.length > 1) {
      var x = a
    } else {
      //if removing a new item then select the .display attribute
      var x = a.display
    }
    //remove item from array
    for (var i = this.location.length - 1; i >= 0; i--) {
      if (this.location[i] === x) {
        this.location.splice(i, 1);
      }
    }
  };


  //add payment information
  onClickAddPaymentInfo() {

    var paymentInfo = {
      id: this.user._id,
      firstName: this.firstName,
      lastName: this.lastName,
      //birthDay: this.birthDay,
      country: this.country,
      postCode: this.postCode,
      address1: this.address1,
      address2: this.address2,
      city: this.city,
      region: this.region,
      bankName: this.bankName,
      sortCode: this.sortCodeField1 + this.sortCodeField2 + this.sortCodeField3,
      accountNumber: this.accountNumber,
      iban: this.iban,
    };

    
    //http call to edit location
    this.authService.addPayment(paymentInfo).subscribe(data => {
      if (data["success"]) {

        this.toastr.success('Payout account information recorded', '', {
          timeOut: 3000
        });

        //navigate to add product
        this.router.navigate(['business/addproduct']);

      } else {
        this.onError()
        window.scrollTo(0, 0);
      }
    })
  };


  //edit location
  onClickEditLocation() {
    //if location array is empty
    if (this.location.length == 0) {

      this.toastr.warning('Please select at least 1 location', '', {
        timeOut: 3000
      });

    } else {
      //if location(s) selected

      //define location
      const location = {
        location: this.location
      };

      //http call to edit location
      this.authService.editLocation(location).subscribe(data => {
        if (data["success"]) {
          this.toastr.success('Your city changed', '', {
            timeOut: 3000
          });

          //save to localstorage
          //localStorage.setItem('locations', JSON.stringify(this.location));

          //re-render page
          this.renderPage();

        } else {
          this.onError()
          window.scrollTo(0, 0);
        }
      })
    };
  };


  onClickEditPassword() {
    if (!this.validateService.passwordMatch(this.password, this.password2)) {
      this.toastr.warning('Passwords do not match', '', {
        timeOut: 3000
      });
      window.scrollTo(0, 0);
      return false;
    }

    const password = {
      password: this.password
    };
    //edit email
    this.authService.editPassword(password).subscribe(data => {
      if (data["success"]) {
        this.toastr.success('Password changed', '', {
          timeOut: 3000
        });
      } else {
        this.onError();
        window.scrollTo(0, 0);
      }
    });

  };


  onClickDisactivateAccount() {

    this.authService.disactivateUser().subscribe(data => {
      if (data["success"]) {

        this.toastr.success('Account Deleted', '', {
          timeOut: 5000
        });

        this.authService.logout();

        this.router.navigate(['/']);

      } else {

        this.onError()
        window.scrollTo(0, 0);

      }
    });

  }


  renderPage() {
    this.authService.getProfile().subscribe(profile => {
      this.user = profile["user"];

      this.location = this.user.location;

      if (this.user.paymentInfoAvailable == true) {

        this.authService.getPayment().subscribe(data => {
          if (data["success"]) {

            this.payment = data["data"][0];

          } else {

            this.onError()
            window.scrollTo(0, 0);

          }
        });

      }

      //pre-fill form
      this.form.get("userName").setValue(this.user.name);
      this.form.get("email").setValue(this.user.email);
      this.form.get("firstName").setValue(this.user.firstname);
      this.form.get("lastName").setValue(this.user.lastname);
      //extract 2 first digits as prefix
      this.form.get("prefix").setValue(this.user.mobile.substring(2, 0));
      //extract from the 2nd and end of the number as mobile number
      this.form.get("mobile").setValue(this.user.mobile.substring(20, 2));
    },
      err => {
        //console.log(err);
        return false;
      });
  };

  onError() {
    this.toastr.error('Error: please try again later or contact us', '', {
      timeOut: 3000
    });
  };
}
