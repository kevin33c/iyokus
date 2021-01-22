import { Component, OnInit } from '@angular/core';

import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./style.scss']
})
export class FaqComponent implements OnInit {

  constructor(
    private seoService: SeoService
  ) { }

  ngOnInit() {
    this.seoService.setSectionMetadata('FAQ');
  }

}
