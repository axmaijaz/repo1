import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommunicationsListComponent } from './communications-list/communications-list.component';
import { CommunicationDetailComponent } from './communication-detail/communication-detail.component';
import { CommunicationLayoutComponent } from './communication-layout/communication-layout.component';
import { NewBulkCommunicationComponent } from './new-bulk-communication/new-bulk-communication.component';
import { CommunicationTemplatesComponent } from './communication-templates/communication-templates.component';


const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: CommunicationsListComponent },
  { path: 'detail', component: CommunicationDetailComponent },
  { path: 'layout', component: CommunicationLayoutComponent },
  { path: 'bulk-communication', component: NewBulkCommunicationComponent },
  { path: 'manage-template', component: CommunicationTemplatesComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientCommunicationRoutingModule { }
