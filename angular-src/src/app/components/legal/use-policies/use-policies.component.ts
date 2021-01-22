import { Component, OnInit } from '@angular/core';

import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-use-policies',
  templateUrl: './use-policies.component.html',
  styleUrls: ['./use-policies.component.css']
})
export class UsePoliciesComponent implements OnInit {

  constructor(
    private seoService: SeoService
  ) { }

  ngOnInit() {

    this.seoService.setSectionMetadata('Privacy & Cookies Notices');
    
  }

}
