import { Component, OnInit } from '@angular/core';
//router to redirect
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { SeoService } from '../../../services/seo.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-verify',
  templateUrl: './user-verify.component.html',
  styleUrls: ['./user-verify.component.css']
})
export class UserVerifyComponent implements OnInit {

  verified: Boolean = false
  type: String;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private seoService: SeoService
  ) { }

  ngOnInit() {
    this.seoService.setSectionMetadata('Email Verification');

    const token = 'JWT ' + this.router.url.substr(this.router.url.lastIndexOf('/') + 1);

    this.authService.verifyUser(token).subscribe(data => {
      if (data["success"]){
        this.verified = true;
        this.type = data["type"];
      } else {
        this.verified = false;
        this.toastr.warning('Your verification key may have expired, please request a new verification email', '', {
          timeOut: 3000
        });
      };
    })
  }

  onClickNavigate(){
    if(this.type == 'user'){
      this.router.navigate(['/login']);
    } else if (this.type == 'seller' || this.type == 'business'){
      this.router.navigate(['/seller-login']);
    }
  }

}
