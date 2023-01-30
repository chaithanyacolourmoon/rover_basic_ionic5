import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeliveryaddressPageRoutingModule } from './deliveryaddress-routing.module';

import { DeliveryaddressPage } from './deliveryaddress.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeliveryaddressPageRoutingModule
  ],
  declarations: [DeliveryaddressPage]
})
export class DeliveryaddressPageModule {}
