import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MysubscriptionPage } from './mysubscription.page';

const routes: Routes = [
  {
    path: '',
    component: MysubscriptionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MysubscriptionPageRoutingModule {}
