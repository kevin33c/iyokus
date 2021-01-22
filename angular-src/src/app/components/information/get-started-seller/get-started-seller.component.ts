import { Component, OnInit } from '@angular/core';

import { SeoService } from '../../../services/seo.service';


@Component({
  selector: 'app-get-started-seller',
  templateUrl: './get-started-seller.component.html',
  styleUrls: ['./get-started-seller.component.css']
})
export class GetStartedSellerComponent implements OnInit {

  constructor(
    private seoService: SeoService
  ) { }

  ngOnInit() {
    
    this.seoService.setSectionMetadata('Get Started Seller');
    
  }

}
