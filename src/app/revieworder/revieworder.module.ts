import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RevieworderPageRoutingModule } from './revieworder-routing.module';

import { RevieworderPage } from './revieworder.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RevieworderPageRoutingModule
  ],
  declarations: [RevieworderPage]
})
export class RevieworderPageModule {}
