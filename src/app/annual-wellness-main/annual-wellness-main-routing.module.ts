import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AwLayoutComponent } from './aw-layout/aw-layout.component';
import { AwPatientTabComponent } from './aw-patient-tab/aw-patient-tab.component';
import { AwPhysicianTabComponent } from './aw-physician-tab/aw-physician-tab.component';
import { AwEncountersListComponent } from './aw-encounters-list/aw-encounters-list.component';
import { AwSupplementComponent } from './aw-supplement/aw-supplement.component';
import { TwoCHeaderFooterComponent } from '../public-shared/two-cheader-footer/two-cheader-footer.component';
import { AnnualWellnessDashboardComponent } from './annual-wellness-dashboard/annual-wellness-dashboard.component';

const routes: Routes = [
  // { path: '', redirectTo: 'AWMain', pathMatch: 'full' },
  { path: 'dashboard', component: AnnualWellnessDashboardComponent },
  {
    path: 'AWMain/:id/:awId', component: AwLayoutComponent, data: { showPatientLayout: true }, children: [
      { path: '', redirectTo: 'awPatient', pathMatch: 'full' },
      { path: 'awPatient', component: AwPatientTabComponent },
      { path: 'awPhysician', component: AwPhysicianTabComponent },
      { path: 'awProvider', loadChildren: () => import('../annual-wellness/annual-wellness.module').then(m => m.AnnualWellnessModule) },
      { path: 'awSupplement', component: AwSupplementComponent },
      { path: 'awForm', loadChildren: () => import('./humana-form/humana-form.module').then(m => m.HumanaFormModule) },
      // { path: 'accounts', loadChildren: () => import(`../annual-wellness/annual-wellness.module`).then(m => m.AnnualWellnessModule) },
    ]
  },
  { path: 'awEncounters/:id', component: AwEncountersListComponent, data: { showPatientLayout: true } },
  // { path: 'awPatient/:id/:awId', component:  AwPatientTabComponent}
  {
    path: 'awPatient', component: TwoCHeaderFooterComponent,
    children: [
      { path: ':id/:awId', component: AwPatientTabComponent, data: { patientForm: true } }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnualWellnessMainRoutingModule { }
