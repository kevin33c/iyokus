import { Component, OnInit } from '@angular/core';

import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  constructor(
    private seoService: SeoService
  ) { }

  ngOnInit() {
    this.seoService.setSectionMetadata('Page not Found');
  }

}
