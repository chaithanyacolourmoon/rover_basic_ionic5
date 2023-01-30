import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeliveryslotsPageRoutingModule } from './deliveryslots-routing.module';

import { DeliveryslotsPage } from './deliveryslots.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeliveryslotsPageRoutingModule
  ],
  declarations: [DeliveryslotsPage]
})
export class DeliveryslotsPageModule {}
