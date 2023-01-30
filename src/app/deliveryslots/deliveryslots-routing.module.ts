import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeliveryslotsPage } from './deliveryslots.page';

const routes: Routes = [
  {
    path: '',
    component: DeliveryslotsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeliveryslotsPageRoutingModule {}
