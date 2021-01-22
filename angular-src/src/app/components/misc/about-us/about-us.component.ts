import { Component, OnInit } from '@angular/core';

import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  constructor(
    private seoService: SeoService
  ) { }

  ngOnInit() {    
    this.seoService.setSectionMetadata('About Us');
  }

}
