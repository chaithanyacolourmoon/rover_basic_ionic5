import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileaddaddressPage } from './profileaddaddress.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileaddaddressPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileaddaddressPageRoutingModule {}
