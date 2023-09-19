import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ManageMrComponent } from "./manage-mr/manage-mr.component";

const routes: Routes = [
    { path: '', redirectTo: 'mradmin', pathMatch: 'full' },
    { path: 'mradmin', component: ManageMrComponent , children: [
      { path: '', loadChildren: () => import('../monthly-review/mrsetup/mrsetup.module').then(m => m.MRSetupModule)},
    ]},

  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class MrAdminRoutingModule {

  }
