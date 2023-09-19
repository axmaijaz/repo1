import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AwDetailComponent } from './aw-detail/aw-detail.component';
import { PageNotFoundComponent } from '../shared/page-not-found/page-not-found.component';

const routes: Routes = [
  // { path: '', redirectTo: 'detail', pathMatch: 'full' },
  { path: '', component: AwDetailComponent , data: { showPatientLayout: true } },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnualWellnessRoutingModule { }
