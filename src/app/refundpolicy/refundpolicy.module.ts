import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RefundpolicyPageRoutingModule } from './refundpolicy-routing.module';

import { RefundpolicyPage } from './refundpolicy.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RefundpolicyPageRoutingModule
  ],
  declarations: [RefundpolicyPage]
})
export class RefundpolicyPageModule {}
