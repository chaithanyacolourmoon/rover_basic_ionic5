import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RefundpolicyPage } from './refundpolicy.page';

const routes: Routes = [
  {
    path: '',
    component: RefundpolicyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RefundpolicyPageRoutingModule {}
