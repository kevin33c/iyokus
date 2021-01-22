import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../services/seo.service';

//router to redirect
import { Router } from '@angular/router';

//import service
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: Object;


  constructor(
    private authService: AuthService,
    private router: Router,
    private seoService: SeoService
  ) { }

  ngOnInit() {
    this.seoService.setSectionMetadata('My Profile');
  }

}
