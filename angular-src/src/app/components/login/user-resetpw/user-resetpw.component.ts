import { Component, OnInit } from '@angular/core';

//router to redirect
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

//import service
import { AuthService } from '../../../services/auth.service';
import { SeoService } from '../../../services/seo.service';

//spinner
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-user-resetpw',
  templateUrl: './user-resetpw.component.html',
  styleUrls: ['./user-resetpw.component.css']
})
export class UserResetpwComponent implements OnInit {

  email: String;
  type: String;

  constructor(
    private authService: AuthService,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private toastr: ToastrService,
    private seoService: SeoService
  ) { }

  ngOnInit() {
    this.seoService.setSectionMetadata('Password Assistance');
  };

  onSubmit() {
    this.spinnerService.show();

    const user = {
      email: this.email,
      type: this.type,
      purpose: 'password'
    }

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

        this.toastr.success('We have sent you an email with instruction to help to reset your password', '', {
          timeOut: 3000
        });

        if (this.type == 'user') {
          this.router.navigate(['/login']);
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
    });
  };
  
}
