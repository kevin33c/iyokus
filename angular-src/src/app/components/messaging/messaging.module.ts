import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../components/shared.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ChatListComponent } from './chat-list/chat-list.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { messagingRouter } from './messaging.router';

import { UserService } from '../../services/user.service';
import { SalesService } from '../../services/sales.service';

@NgModule({
  declarations: [ 
    ChatRoomComponent, 
    ChatListComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    messagingRouter,
  ],
  providers: [
    UserService,
    SalesService,
  ],
})

export class MessagingModule {}