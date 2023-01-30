import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubscriptionsuccessPageRoutingModule } from './subscriptionsuccess-routing.module';

import { SubscriptionsuccessPage } from './subscriptionsuccess.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubscriptionsuccessPageRoutingModule
  ],
  declarations: [SubscriptionsuccessPage]
})
export class SubscriptionsuccessPageModule {}
