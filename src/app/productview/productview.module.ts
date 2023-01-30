import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductviewPageRoutingModule } from './productview-routing.module';

import { ProductviewPage } from './productview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductviewPageRoutingModule
  ],
  declarations: [ProductviewPage]
})
export class ProductviewPageModule {}
