import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HealthGuideLinesComponent } from './health-guide-lines/health-guide-lines.component';


const routes: Routes = [
  // {path: "guide-line", component: HealthGuideLinesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MobileHealthGuideRoutingModule { }
