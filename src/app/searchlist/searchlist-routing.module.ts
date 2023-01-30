import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchlistPage } from './searchlist.page';

const routes: Routes = [
  {
    path: '',
    component: SearchlistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchlistPageRoutingModule {}
