import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HealthScoreListComponent } from './health-score-list/health-score-list.component';
import { HealthScoreFormComponent } from './health-score-form/health-score-form.component';


const routes: Routes = [
  {path: 'list' , component: HealthScoreListComponent},
  {path: 'form' , component: HealthScoreFormComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HealthScoreRoutingModule { }
