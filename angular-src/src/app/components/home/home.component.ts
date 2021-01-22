import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';

//import service
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./style.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('openModal') openModal: ElementRef;

  user: Object;
  ipAddress: any;
  location: any;
  welcomeNeeded: boolean;

  constructor(
    private seoService: SeoService,
    public authService: AuthService,
  ) {
    this.location = JSON.parse(localStorage.getItem('locations'));

    //check if logged in
    if (this.authService.loggedIn()) {
      if (this.location == null || this.location == undefined || this.location.length == 0) {

        this.location = 'You are viewing all the products on sale, but remember not all could be delivered to your location';

      } else {

        this.location = 'You are viewing all the products with delivery possible in ' + this.location;

      }
    }
  }

  ngOnInit() {
    //document metadata manipulation
    this.seoService.setSectionMetadata('Iyokus.com: Pay What You Feel to Pay');

    /*
    this.welcomeNeeded = JSON.parse(localStorage.getItem('iy-welc-msg'));

    if (this.welcomeNeeded == null || this.welcomeNeeded == undefined) {
      
      //set welcome modal to viewed
      localStorage.setItem('iy-welc-msg', 'true');

      //open modal
      this.openModal.nativeElement.click();

    }
    */

  }

}




