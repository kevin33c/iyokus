import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
//router to redirect
import { Router } from '@angular/router';

//import service
import { AuthService } from '../../../services/auth.service';
import { SeoService } from '../../../services/seo.service';


@Component({
  selector: 'app-seller-login',
  templateUrl: './seller-login.component.html',
  styleUrls: ['./seller-login.component.css']
})
export class SellerLoginComponent implements OnInit {
  email: String;
  password: String;
  type: String;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private seoService: SeoService
  ) { }

  ngOnInit() {
    
    this.seoService.setSectionMetadata('Seller Sign In');
    
  }

  onLoginSubmit() {
    const user = {
      email: this.email,
      password: this.password,
      type: ["seller", "business"]
    }

    this.authService.authenticateUser(user).subscribe(data => {


      if (data["success"] == false) {

        this.toastr.error(data["msg"], '', {
          timeOut: 3000
        });

        return
      };

      if (data["mobile"] == false) {

        var token = data["tempToken"]

        this.toastr.warning('Please verify your phone number before signing in', '', {
          timeOut: 3000
        });

        this.router.navigate(['/security/mobileverification', token]);
        window.scrollTo(0, 0);

        return
      };


      if (data["success"]) {
        //same data in local storage
        this.authService.storeUserData(data["token"], data["user"])
        this.toastr.success('Signed in successfully', '', {
          timeOut: 3000
        });
        this.router.navigate(['/'])
        window.scrollTo(0, 0);

      };

    });

  };

}
