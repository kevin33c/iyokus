import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { legalRouter } from './legal.router';
import { SharedModule } from '../shared.module'

import { PoliciesComponent } from './policies/policies.component';
import { UsePoliciesComponent } from './use-policies/use-policies.component';

@NgModule({
  declarations: [
    PoliciesComponent,
    UsePoliciesComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    legalRouter,
    SharedModule,

  ],
  providers: [
  ],
})


export class LegalModule { }