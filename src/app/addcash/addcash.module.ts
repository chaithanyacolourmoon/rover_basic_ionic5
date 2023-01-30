import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddcashPageRoutingModule } from './addcash-routing.module';

import { AddcashPage } from './addcash.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddcashPageRoutingModule
  ],
  declarations: [AddcashPage]
})
export class AddcashPageModule {}
