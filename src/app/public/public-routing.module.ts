import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoadingViewComponent } from './loading-view/loading-view.component';
import { SuccessPageComponent } from './success-page/success-page.component';


const routes: Routes = [
  {path: '', component: SuccessPageComponent},
  {path: 'loading', component: LoadingViewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
