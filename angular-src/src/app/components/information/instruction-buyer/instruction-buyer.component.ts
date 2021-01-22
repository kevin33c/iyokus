import { Component, OnInit } from '@angular/core';

import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-instruction-buyer',
  templateUrl: './instruction-buyer.component.html',
  styleUrls: ['./instruction-buyer.component.css']
})
export class InstructionBuyerComponent implements OnInit {


  constructor(
    private seoService: SeoService,
  ) {

   }

  ngOnInit() {

    this.seoService.setSectionMetadata('How to Buy with Iyokus');

  }

}
