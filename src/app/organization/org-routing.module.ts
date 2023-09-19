import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationsComponent } from './organizations/organizations.component';
import { FacilityComponent } from './facility/facility.component';
import { FacilitUsersComponent } from './facility-users/facility-users.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { InvoicePreviewComponent } from '../accounts/invoice-preview/invoice-preview.component';
import { ServiceProjectionComponent } from './service-projection/service-projection.component';

const routes: Routes = [
  { path: 'organizations', component: OrganizationsComponent },
  { path: 'Facilities', component: FacilityComponent },
  { path: 'Facilities/:OrgId', component: FacilityComponent },
  { path: 'facilityUsers', component: FacilitUsersComponent, canActivate: [AuthGuard], data: { claimType: ['IsFacilityUser'] } },
  { path: 'facilityUsers/:facilityId/:OrgId', component: FacilitUsersComponent },
  { path: 'facilityInvoices/:facilityId', component: InvoicePreviewComponent },
  { path: 'serviceProjection', component: ServiceProjectionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrgRoutingModule { }
