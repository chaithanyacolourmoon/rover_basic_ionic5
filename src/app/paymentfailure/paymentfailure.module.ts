import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentfailurePageRoutingModule } from './paymentfailure-routing.module';

import { PaymentfailurePage } from './paymentfailure.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentfailurePageRoutingModule
  ],
  declarations: [PaymentfailurePage]
})
export class PaymentfailurePageModule {}
