import { Component, OnInit } from '@angular/core';

import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-instruction-seller',
  templateUrl: './instruction-seller.component.html',
  styleUrls: ['./instruction-seller.component.css']
})
export class InstructionSellerComponent implements OnInit {

  constructor(
    private seoService: SeoService,
  ) { }

  ngOnInit() {

    this.seoService.setSectionMetadata('How to Sell with Iyokus');

  }

}
