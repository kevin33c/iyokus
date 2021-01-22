import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../../services/websocket.service'
import { SeoService } from '../../../services/seo.service';
import { AuthService } from '../../../services/auth.service';
//router to redirect
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {

  conversations: any;
  conversationsX: any = [];
  myType: String;

  constructor(
    private websocketService: WebsocketService,
    private seoService: SeoService,
    private router: Router,
    private authService: AuthService,
  ) {
    this.websocketService.newMessageReceived().subscribe(data => {

      //get conversations
      this.websocketService.getConversations().subscribe(data => {

        this.conversations = data['conversations'];

        //transform the object to array
        for (var i = 0; i < this.conversations.length; i++) {
          this.conversationsX.push(this.conversations[i][0]);
        };


      });
    })
  }

  ngOnInit() {

    this.seoService.setSectionMetadata('Messenger');

    //get profile info
    this.authService.getProfile().subscribe(data => {

      this.myType = data['user'].type;

      //get conversations
      this.websocketService.getConversations().subscribe(data => {

        this.conversations = data['conversations'];
        
      });

      //this.websocketService.join(data['user'].id);
      this.websocketService.join('iyokus main');

    });

  };

  checkRead(conversation){
    if(this.myType == 'user'){
      return conversation.userRead;
    } else {
      return conversation.sellerRead;
    }
  }


  previewMessage(message) {

    if (message.length > 70) {
      return message.substring(0, 70) + '...';
    } else {
      return message;
    };

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
