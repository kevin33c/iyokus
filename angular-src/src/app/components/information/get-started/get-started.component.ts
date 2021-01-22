import { Component, OnInit } from '@angular/core';

import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html',
  styleUrls: ['./get-started.component.css']
})
export class GetStartedComponent implements OnInit {

  constructor(
    private seoService: SeoService
  ) { }

  ngOnInit() {

    this.seoService.setSectionMetadata('Get Started Buyer');

  }

}
