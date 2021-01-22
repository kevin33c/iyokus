import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../services/seo.service';


@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.css']
})
export class PoliciesComponent implements OnInit {

  domain: string

  public ngxScrollToDestination: string;

  constructor(
    private seoService: SeoService,
  ) {}

  ngOnInit() {
    
    this.seoService.setSectionMetadata('Conditions of Sale');

    this.domain = window.location.hostname;

  }

}
