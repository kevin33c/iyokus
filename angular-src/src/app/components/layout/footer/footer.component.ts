import { Component, OnInit } from '@angular/core';

//import service
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  
  year: any;

  constructor(
    public authService: AuthService,
  ) { }

  ngOnInit() {
    this.year = (new Date()).getFullYear();
  }

  onClickNavigate(url) {
    window.open(url, "_blank");
  }

}
