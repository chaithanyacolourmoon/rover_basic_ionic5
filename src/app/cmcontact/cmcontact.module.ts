import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CmcontactPageRoutingModule } from './cmcontact-routing.module';

import { CmcontactPage } from './cmcontact.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CmcontactPageRoutingModule
  ],
  declarations: [CmcontactPage]
})
export class CmcontactPageModule {}
