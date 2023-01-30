import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpecialtagPage } from './specialtag.page';

const routes: Routes = [
  {
    path: '',
    component: SpecialtagPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpecialtagPageRoutingModule {}
