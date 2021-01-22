import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';


@Component({
  selector: 'app-payment-error',
  templateUrl: './payment-error.component.html',
  styleUrls: ['./payment-error.component.css']
})
export class PaymentErrorComponent implements OnInit {

  errorMsg: any;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.currentMessage.subscribe(message => {
      this.errorMsg = message
    }
    );
  }

}
