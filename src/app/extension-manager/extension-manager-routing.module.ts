import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExtClientsDetailComponent } from './ext-clients-detail/ext-clients-detail.component';
import { LaucnchAppComponent } from './laucnch-app/laucnch-app.component';


const routes: Routes = [
  {path: '', component: ExtClientsDetailComponent},
  {path: 'launch', component: LaucnchAppComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class ExtensionManagerRoutingModule { }
