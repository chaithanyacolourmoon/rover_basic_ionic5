import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MysubscriptionPageRoutingModule } from './mysubscription-routing.module';

import { MysubscriptionPage } from './mysubscription.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MysubscriptionPageRoutingModule
  ],
  declarations: [MysubscriptionPage]
})
export class MysubscriptionPageModule {}
