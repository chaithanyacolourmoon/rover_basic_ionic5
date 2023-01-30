import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentfailurePage } from './paymentfailure.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentfailurePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentfailurePageRoutingModule {}
