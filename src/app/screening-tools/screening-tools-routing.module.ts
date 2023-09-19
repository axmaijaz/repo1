import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllScreeningToolsComponent } from './all-screening-tools/all-screening-tools.component';
import { Dast20Component } from './dast20/dast20.component';
import { Gad7Component } from './gad7/gad7.component';
import { Phq9Component } from './phq9/phq9.component';
import { WsasComponent } from './wsas/wsas.component';


const routes: Routes = [
  { path: '', redirectTo: 'gad7', pathMatch: 'full' },
  { path: 'gad7', component: Gad7Component },
  { path: 'dast20', component: Dast20Component },
  { path: 'wsas', component: WsasComponent },
  { path: 'phq9', component: Phq9Component },
  { path: 'all-screening-tools', component: AllScreeningToolsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScreeningToolsRoutingModule { }
