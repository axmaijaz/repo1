import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BhiPatientListComponent } from './bhi-patient-list/bhi-patient-list.component';
import { BhiAddEncountersComponent } from './bhi-add-encounters/bhi-add-encounters.component';

const routes: Routes = [
  { path: '', redirectTo: 'bhiPatients', pathMatch: 'full' },
  { path: 'bhiPatients', component: BhiPatientListComponent },
  { path: 'bhiEncounters/:id', component: BhiAddEncountersComponent , data: { showPatientLayout: true },
    // children: [
    //   {path: '', redirectTo: 'tools', pathMatch: 'full' },
    //   {path: 'tools', loadChildren: () => import('../screening-tools/screening-tools.module').then(m => m.ScreeningToolsModule)},
    // ]

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BhiMainRoutingModule { }
