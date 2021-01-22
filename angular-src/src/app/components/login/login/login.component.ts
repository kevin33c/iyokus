import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../services/seo.service';

//router to redirect
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

//import service
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: String;
  password: String;
  type: String;
  url: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private seoService: SeoService,
  ) { }

  ngOnInit() {
    
    this.seoService.setSectionMetadata('Iyokus Sign In');
  }

  onLoginSubmit() {
    const user = {
      email: this.email,
      password: this.password,
      type: "user"
    }

    this.authService.authenticateUser(user).subscribe(data => {

      if (data["success"]) {
        //save data in local storage
        this.authService.storeUserData(data["token"], data["user"])
        this.toastr.success('Signed in successfully', '', {
          timeOut: 3000
        });
        this.router.navigate(['/']);
      } else {
        this.toastr.error(data["msg"], '', {
          timeOut: 3000
        });
        this.router.navigate(['/login']);
      }
    });
  };
}



