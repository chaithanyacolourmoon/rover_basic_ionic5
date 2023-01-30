import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditaddressPageRoutingModule } from './editaddress-routing.module';

import { EditaddressPage } from './editaddress.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EditaddressPageRoutingModule
  ],
  declarations: [EditaddressPage]
})
export class EditaddressPageModule { }
