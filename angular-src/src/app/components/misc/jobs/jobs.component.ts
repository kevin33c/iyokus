import { Component, OnInit } from '@angular/core';

import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {

  constructor(
    private seoService: SeoService
  ) { }

  ngOnInit() {
    
    this.seoService.setSectionMetadata('Jobs at Iyokus');

  }

}
