import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaplocationPage } from './maplocation.page';

const routes: Routes = [
  {
    path: '',
    component: MaplocationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaplocationPageRoutingModule {}
