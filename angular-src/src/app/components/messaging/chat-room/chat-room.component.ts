import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../../services/websocket.service'
import { SeoService } from '../../../services/seo.service';
import { AuthService } from '../../../services/auth.service';
//router to redirect
import { Router, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SalesService } from '../../../services/sales.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {

  conversationId: any;
  messages: any;
  composedMessage: string;
  myType: string;
  myID: string;
  order: any;


  constructor(
    private websocketService: WebsocketService,
    private seoService: SeoService,
    private router: Router,
    private salesService: SalesService,
    private toastr: ToastrService,
    private authService: AuthService,
  ) {
    this.websocketService.newMessageReceived().subscribe(data => {

      this.websocketService.getConversation(this.conversationId).subscribe(data => {
        if (data['success']) {
          this.messages = data['conversation'];

        } else {
          //console.log(data);
        }
      });
    })
  };


  ngOnInit() {

    this.seoService.setSectionMetadata('Messenger');

    //get url query
    this.conversationId = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);

    //get profile info
    this.authService.getProfile().subscribe(data => {
      this.myType = data['user'].type;
      this.myID = data['user']._id;
      //get conversation
      this.websocketService.getConversation(this.conversationId).subscribe(data => {
        if (data['success']) {

          this.messages = data['conversation'];

        } else {
          this.toastr.error('Error occured: please try again later', '', {
            timeOut: 3000
          });
        }
      });

      if (this.myType == 'user') {
        this.salesService.getOrderEx(this.conversationId).subscribe(data => {
          if (data['success']) {
            this.order = data['data'];
          }
        })
      } else {
        this.salesService.getOrder(this.conversationId).subscribe(data => {
          if (data['success']) {
            this.order = data['data'];
          }
        })
      };

    });

    this.websocketService.join(this.conversationId);



  };



  sendMessage() {

    if (this.composedMessage === '' || this.composedMessage === undefined || this.composedMessage === null) {
      return;
    };

    if (this.myType == 'user') {
      var counterPartyID = this.order.sellerID;
    } else {
      var counterPartyID = this.order.userID;
    };

    var msg = {
      composedMessage: this.composedMessage,
      counterPartyID: counterPartyID
    };

    this.websocketService.addToConversation(this.conversationId, msg).subscribe(data => {
      if (data['success']) {
        this.websocketService.sendMessage(this.conversationId);
        //reset variable
        this.composedMessage = undefined;
      } else {
        //reset variable
        this.composedMessage = undefined;

        this.toastr.error('Error occured: please try again later', '', {
          timeOut: 3000
        });
      }

    });

  };


  formatDate(date) {

    var today = new Date();
    var t = new Date(date);

    var timeDiff = t.getTime() - today.getTime();

    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (diffDays == 0) {

      return 'Today';

    } else if (diffDays == -1) {

      return 'Yesterday';

    } else {

      var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
      ];

      var day = t.getDate();
      var monthIndex = t.getMonth();

      return monthNames[monthIndex] + ' ' + day;

    }
  };

}
