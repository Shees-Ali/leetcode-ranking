import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RankingListPage } from './ranking-list.page';


const routes: Routes = [{ path: '', component:RankingListPage}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RankingListRoutingModule { }
