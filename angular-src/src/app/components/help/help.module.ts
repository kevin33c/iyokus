import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../components/shared.module';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';


import { helpRouter } from './help.router';
import { HelpCenterComponent } from './help-center/help-center.component';

@NgModule({
  declarations: [ 
  HelpCenterComponent,
],
  imports: [
    RouterModule,
    CommonModule,
    SharedModule,
    helpRouter,
    ScrollToModule.forRoot(),
  ],
  providers: [
    
  ],
})

export class HelpModule {}