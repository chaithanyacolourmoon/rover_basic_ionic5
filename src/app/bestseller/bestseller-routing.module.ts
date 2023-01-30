import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BestsellerPage } from './bestseller.page';

const routes: Routes = [
  {
    path: '',
    component: BestsellerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BestsellerPageRoutingModule {}
