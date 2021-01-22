import { Routes, RouterModule } from '@angular/router';


import { ChatRoomComponent } from './chat-room/chat-room.component';
import { ChatListComponent } from './chat-list/chat-list.component';

const MESSAGING_ROUTER: Routes = [
  {
    path: '',
    component: ChatListComponent
  },
  {
    path: ':id',
    component: ChatRoomComponent
  },

];

export const messagingRouter = RouterModule.forChild(MESSAGING_ROUTER);