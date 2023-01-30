import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddcashPage } from './addcash.page';

const routes: Routes = [
  {
    path: '',
    component: AddcashPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddcashPageRoutingModule {}
