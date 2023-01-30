import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaplocationPageRoutingModule } from './maplocation-routing.module';

import { MaplocationPage } from './maplocation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaplocationPageRoutingModule
  ],
  declarations: [MaplocationPage]
})
export class MaplocationPageModule {}
