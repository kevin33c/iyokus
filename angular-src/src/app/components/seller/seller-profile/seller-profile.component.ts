import { Component, OnInit } from '@angular/core';

//router to redirect
import { Router } from '@angular/router';

//import service
import { AuthService } from '../../../services/auth.service';
import { SeoService } from '../../../services/seo.service';


@Component({
  selector: 'app-seller-profile',
  templateUrl: './seller-profile.component.html',
  styleUrls: ['./seller-profile.component.css']
})
export class SellerProfileComponent implements OnInit {
  user: Object;

  
  constructor(
    private authService: AuthService,
    private router: Router,
    private seoService: SeoService
  ) { }

  ngOnInit() {

    this.seoService.setSectionMetadata('My Profile');

    this.authService.getProfile().subscribe(profile => {
      this.user = profile["user"];
      //console.log (profile.user);
    },
     err => {
       //console.log(err);
       return false;
     });
  }

}
