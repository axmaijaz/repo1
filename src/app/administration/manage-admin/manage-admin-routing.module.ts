import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminUsersListComponent } from "../admin-users-list/admin-users-list.component";
import { SearchPatientsComponent } from "../search-patients/search-patients.component";

const routes: Routes = [
  { path: "", redirectTo: "users", pathMatch: "full" },
  { path: "users", component: AdminUsersListComponent },
  { path: "searchPatients", component: SearchPatientsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageAdminRoutingModule {}
