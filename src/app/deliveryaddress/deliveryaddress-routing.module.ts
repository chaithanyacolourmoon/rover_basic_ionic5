import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeliveryaddressPage } from './deliveryaddress.page';

const routes: Routes = [
  {
    path: '',
    component: DeliveryaddressPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeliveryaddressPageRoutingModule {}
