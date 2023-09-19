import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AwvReportFormComponent } from './awv-report-form/awv-report-form.component';
import { HumanaFormDetailComponent } from './humana-form-detail/humana-form-detail.component';
import { PrimeWestFormComponent } from './prime-west-form/prime-west-form.component';


const routes: Routes = [
  {path: 'humana', component: HumanaFormDetailComponent},
  {path: 'primeWest', component: PrimeWestFormComponent},
  {path: 'awvReport', component: AwvReportFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HumanaFormRoutingModule { }
