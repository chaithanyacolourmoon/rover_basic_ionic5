import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpecialtagPageRoutingModule } from './specialtag-routing.module';

import { SpecialtagPage } from './specialtag.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpecialtagPageRoutingModule
  ],
  declarations: [SpecialtagPage]
})
export class SpecialtagPageModule {}
