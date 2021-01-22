import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../services/seo.service';

//router to redirect
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-help-center',
  templateUrl: './help-center.component.html',
  styleUrls: ['./help-center.component.css']
})
export class HelpCenterComponent implements OnInit {

  article: string;
  centerView: boolean;

  constructor(
    private router: Router,
    private seoService: SeoService,
  ) { }

  ngOnInit() {

    this.seoService.setSectionMetadata('Help Center');
    
    /*Re-render page when changing url params*/
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.router.navigated = false;
        window.scrollTo(0, 0);
      }
    });
    /*Re-render page when changing url params*/


    //get article number
    this.article = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);

    if (this.article == 'center') {
      this.centerView = true;
    } else {
      this.centerView = false;
    }

  }

}
