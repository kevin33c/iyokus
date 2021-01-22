import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
//router to redirect
import { Router } from '@angular/router';


//spinner
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { Regions } from '../../../models/regions';

//import services
import { ValidateService } from '../../../services/validate.service';
import { AuthService } from '../../../services/auth.service';
import { SeoService } from '../../../services/seo.service';
import { DataService } from '../../../services/data.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-seller-signup',
  templateUrl: './seller-signup.component.html',
  styleUrls: ['./seller-signup.component.css']
})
export class SellerSignupComponent implements OnInit {
  name: String;
  firstname: String;
  lastname: String;
  email: String;
  email2: String;
  password: String;
  password2: String;
  type: String = 'seller';
  mobile: string;
  countryCode: string;
  location: string[] = [];

  //business signup
  businessName: string;
  businessEmail: string;
  composedMessage: string;


  //ckeditor
  ckeConfig: any;

  regionsList: Regions[];
  regions: string[];

  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private seoService: SeoService,
    private spinnerService: Ng4LoadingSpinnerService,
    private dataService: DataService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    
    this.seoService.setSectionMetadata('Register Iyokus Seller Account');

    this.regionsList = this.dataService.getRegions();

    this.regions = this.getName(this.regionsList);
  }

  getName(data) {
    var standardName = [];
    for (var i = 0; i < data.length; i++) {
      standardName.push(data[i].standardName);
    }
    return standardName;
  };

  onItemAdded(a) {
    this.location.push(a.display)
  };

  onItemRemoved(a) {
    for (var i = this.location.length - 1; i >= 0; i--) {
      if (this.location[i] === a.display) {
        this.location.splice(i, 1);
      }
    }
  };


  onBusinessRegisterSubmit(){
    const business = {
      businessName: this.businessName,
      businessEmail: this.businessEmail,
      composedMessage: this.composedMessage
    };

    this.userService.businessSignUp(business).subscribe(data => {
      if (data["success"]) {

        this.toastr.success("Thanks for your interest, we'll be touch very soon", '', {
          timeOut: 5000
        });

        this.router.navigate(['/'])

      } else {
        this.toastr.error('Error occured: please try again later', '', {
          timeOut: 3000
        });
      }
    })
  };


  onRegisterSubmit() {
    
    const user = {
      name: this.name,
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      password: this.password,
      mobile: this.countryCode + this.mobile,
      location: this.location,
      type: this.type,
    };

    //validate
    if (!this.validateService.validateRegister(user)) {
      this.toastr.warning('Please fill in all the required information', '', {
        timeOut: 3000
      });
      return false;
    };

    if (this.countryCode == undefined) {
      this.toastr.warning('Please select a country prefix for your mobile phone number', '', {
        timeOut: 3000
      });
      return false;
    };

    if (!this.validateService.validateEmail(user.email)) {
      this.toastr.warning('Please enter a valid email', '', {
        timeOut: 3000
      });
      return false;
    };

    if (!this.validateService.emailMatch(this.email, this.email2)) {
      this.toastr.warning('Emails do not match', '', {
        timeOut: 3000
      });
      return false;
    };

    if (!this.validateService.passwordMatch(this.password, this.password2)) {
      this.toastr.warning('Passwords do not match', '', {
        timeOut: 3000
      });
      return false;
    };


    this.spinnerService.show();

    //http register user
    this.authService.registerUser(user).subscribe(data => {
      
      window.scrollTo(0, 0);
      this.spinnerService.hide();

      if (data["success"]) {

        var token = data["tempToken"];

        this.toastr.success('We have sent you an verification request to your email, please check your inbox', '', {
          timeOut: 3000
        });

        this.router.navigate(['/security/mobileverification', token]);


      } else {

        this.toastr.error('Error: email/account already registered', '', {
          timeOut: 3000
        });
        this.router.navigate(['/seller-signup'])

      };
    });
  };

  onSelectCountryCode(countryCode) {
    this.countryCode = countryCode;
  }
}
