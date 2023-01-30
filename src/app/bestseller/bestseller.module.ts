import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BestsellerPageRoutingModule } from './bestseller-routing.module';

import { BestsellerPage } from './bestseller.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BestsellerPageRoutingModule
  ],
  declarations: [BestsellerPage]
})
export class BestsellerPageModule {}
