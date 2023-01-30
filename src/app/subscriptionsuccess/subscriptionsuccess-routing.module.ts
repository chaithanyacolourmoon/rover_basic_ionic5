import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubscriptionsuccessPage } from './subscriptionsuccess.page';

const routes: Routes = [
  {
    path: '',
    component: SubscriptionsuccessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscriptionsuccessPageRoutingModule {}
