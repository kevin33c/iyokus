import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
//router to redirect
import { Router } from '@angular/router';

//import services
import { ValidateService } from '../../../services/validate.service';
import { AuthService } from '../../../services/auth.service';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-user-changepw',
  templateUrl: './user-changepw.component.html',
  styleUrls: ['./user-changepw.component.css']
})
export class UserChangepwComponent implements OnInit {

  password: String;
  password2: String;

  constructor(
    private authService: AuthService,
    private validateService: ValidateService,
    private router: Router,
    private toastr: ToastrService,
    private seoService: SeoService
  ) { }

  ngOnInit() {
    this.seoService.setSectionMetadata('Reset Password');
  };

  onSubmit() {

    if (!this.validateService.passwordMatch(this.password, this.password2)) {
      this.toastr.warning('Passwords do not match', '', {
        timeOut: 3000
      });
      return false;
    };

    const token = 'JWT ' + this.router.url.substr(this.router.url.lastIndexOf('/') + 1);

    const password = {
      password: this.password
    };

    //edit email
    this.authService.editPassword(password, token).subscribe(data => {
      if (data["success"]) {
        this.toastr.success('Password changed', '', {
          timeOut: 3000
        });
        if(data["type"] == 'user'){
          this.router.navigate(['/'])
        } else if (data["type"] == 'seller' || data["type"] == 'seller'){
          this.router.navigate(['/seller-login']);
        }
      } else {
        this.toastr.error('Error: please try again later or contact us if error persists', '', {
          timeOut: 3000
        });
      }
    });

  }

}
