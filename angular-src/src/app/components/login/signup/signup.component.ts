import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SeoService } from '../../../services/seo.service';
//router to redirect
import { Router } from '@angular/router';

//spinner
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

//import services
import { ValidateService } from '../../../services/validate.service';
import { AuthService } from '../../../services/auth.service';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  name: String;
  email: String;
  email2: String;
  password: String;
  password2: String;
  type: String;

  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private toastr: ToastrService,
    private seoService: SeoService,
    //private dataService: DataService,
  ) { }

  ngOnInit() {

    this.seoService.setSectionMetadata('Register Iyokus Account');

  };

  onRegisterSubmit() {

    const user = {
      name: this.name,
      email: this.email,
      password: this.password,
      type: "user",
    }

    //validate
    if (!this.validateService.validateRegister(user)) {
      this.toastr.warning('Please fill in all the required information', '', {
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

        this.toastr.success('We have sent you an verification request to your email, please verify before sign in', '', {
          timeOut: 3000
        });

        this.router.navigate(['/login']);

      } else {
        this.toastr.error('Error: email/account already registered', '', {
          timeOut: 3000
        });

        this.router.navigate(['/signup']);

      };
    })
  };

}
