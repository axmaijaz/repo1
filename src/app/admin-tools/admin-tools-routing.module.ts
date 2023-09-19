import { AdminIntellisenseComponent } from './admin-intellisense/admin-intellisense.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageAppAnnouncementComponent } from './manage-app-announcement/manage-app-announcement.component';


const routes: Routes = [
  {path: 'phrases' , component: AdminIntellisenseComponent},
  {path: 'manageAppAnnouncement' , component: ManageAppAnnouncementComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminToolsRoutingModule { }
