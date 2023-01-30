import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CmcontactPage } from './cmcontact.page';

const routes: Routes = [
  {
    path: '',
    component: CmcontactPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CmcontactPageRoutingModule {}
