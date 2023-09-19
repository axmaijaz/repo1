import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PcmEncounterListComponent } from './pcm-encounter-list/pcm-encounter-list.component';
import { PcmMeasuresComponent } from './pcm-measures/pcm-measures.component';

const routes: Routes = [

      { path: '', redirectTo: 'encounters', pathMatch: 'full' },
      { path: 'encounters/:id', component: PcmEncounterListComponent , data: { showPatientLayout: true} },
      { path: 'measures/:id', component: PcmMeasuresComponent , data: { showPatientLayout: true} },
      { path: 'pcmAlcohol/:id', loadChildren: () => import('../pcm-main/pcm-alcohol/pcm-alcohol.module').then(m => m.PcmAlcoholModule), data: { showPatientLayout: true } },
      { path: 'gPcm/:id', loadChildren: () => import('../pcm-main/pcm-alcohol/pcm-alcohol.module').then(m => m.PcmAlcoholModule), data: { showPatientLayout: true } },
      { path: 'pcmDepression/:id', loadChildren: () => import('../pcm-main/pcm-depression/pcm-depression.module').then(m => m.PcmDepressionModule), data: { showPatientLayout: true } },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PcmMainRoutingModule { }
