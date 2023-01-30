import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddreviewPage } from './addreview.page';

const routes: Routes = [
  {
    path: '',
    component: AddreviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddreviewPageRoutingModule {}
