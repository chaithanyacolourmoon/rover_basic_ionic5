import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RevieworderPage } from './revieworder.page';

const routes: Routes = [
  {
    path: '',
    component: RevieworderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RevieworderPageRoutingModule {}
