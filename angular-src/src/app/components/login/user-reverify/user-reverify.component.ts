import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
//router to redirect
import { Router } from '@angular/router';

//import service
import { AuthService } from '../../../services/auth.service';
import { SeoService } from '../../../services/seo.service';

//spinner
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-user-reverify',
  templateUrl: './user-reverify.component.html',
  styleUrls: ['./user-reverify.component.css']
})
export class UserReverifyComponent implements OnInit {

  email: String;
  type: String;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private seoService: SeoService
  ) { }

  ngOnInit() {
    this.seoService.setSectionMetadata('Email Verification Assistance');
  };

  onSubmit() {

    this.spinnerService.show();

    const user = {
      email: this.email,
      type: this.type,
      purpose: 'email'
    };

    if (this.type == undefined) {
      this.toastr.warning('Please select your user type', '', {
        timeOut: 3000
      });
      this.spinnerService.hide();
      return false;
    };


    this.authService.getTempToken(user).subscribe(data => {
      
      this.spinnerService.hide();

      if (data["success"]) {

        this.toastr.success('We have sent you a verification email, please check your inbox', '', {
          timeOut: 3000
        });
        
        if (this.type == 'user') {
          this.router.navigate(['/']);
          window.scrollTo(0, 0);
        } else if (this.type == 'seller' || this.type == 'business') {
          this.router.navigate(['/seller-login']);
          window.scrollTo(0, 0);
        };

      } else {

        this.toastr.error('Error: we could not identify your account, please contact us', '', {
          timeOut: 3000
        });

      };
    })
  };
};
