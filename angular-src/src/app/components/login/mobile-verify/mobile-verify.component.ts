import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SeoService } from '../../../services/seo.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-mobile-verify',
  templateUrl: './mobile-verify.component.html',
  styleUrls: ['./mobile-verify.component.css']
})
export class MobileVerifyComponent implements OnInit {

  verificationCode: string
  token: any;
  mobile: string;
  prefix: string;
  number: string;
  user: any;


  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private seoService: SeoService
  ) { }

  ngOnInit() {
    this.seoService.setSectionMetadata('Phone Verification');

    this.token = 'JWT ' + this.router.url.substr(this.router.url.lastIndexOf('/') + 1);

    this.authService.getProfileWithToken(this.token).subscribe(data => {
      this.user = data['user'];
      this.mobile = data['user'].mobile;
      this.prefix = this.mobile.substring(0, 2);
      this.number = this.mobile.substring(2, 100);
    })
  }

  onSubmit() {

    const verificationCode = {
      verificationCode: this.verificationCode
    }

    this.authService.verifyMobile(this.token, verificationCode).subscribe(data => {
      if (data["success"]) {

        this.toastr.success('Mobile phone verified successfully', '', {
          timeOut: 3000
        });

        this.router.navigate(['/seller-login'])
        window.scrollTo(0, 0);

      } else {
        this.toastr.warning('Error ocurred: invalid verification code', '', {
          timeOut: 3000
        });
      };
    })
  };

  onClickRequest() {

    const info = {
      id: this.user._id,
      mobile: this.prefix + this.number
    };

    this.authService.requestMobileVerificationCode(info, this.token).subscribe(data => {
      if (data["success"]) {

        this.toastr.success('We have sent you a SMS with the verification code', '', {
          timeOut: 4000
        });

      } else {

        this.toastr.warning('You have recently request a verification code already, please contact us or wait 2 hours to try again', '', {
          timeOut: 5000
        });

      };
    })

    //ADD Update phone

  };
}
