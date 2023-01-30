import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileaddaddressPageRoutingModule } from './profileaddaddress-routing.module';

import { ProfileaddaddressPage } from './profileaddaddress.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileaddaddressPageRoutingModule
  ],
  declarations: [ProfileaddaddressPage]
})
export class ProfileaddaddressPageModule {}
