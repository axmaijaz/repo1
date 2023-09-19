import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FacilityUserProfileComponent } from './facility-user-profile/facility-user-profile.component';

const routes: Routes = [
  // { path: "", redirectTo: "patients", pathMatch: "full" },
  { path: "info", component: FacilityUserProfileComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class UesrInfoRoutingModule {
}
