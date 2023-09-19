import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '../shared/page-not-found/page-not-found.component';
import { ExceptionListComponent } from './exception-list/exception-list.component';
import { FrontEndExceptionsComponent } from './front-end-exceptions/front-end-exceptions.component';
import { HangeFireComponent } from './hange-fire/hange-fire.component';


const routes: Routes = [
  { path: 'exceptions', component: ExceptionListComponent },
  { path: 'client-exceptions', component: FrontEndExceptionsComponent },
  { path: 'hangFire', component: HangeFireComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApiExcepLoggingRoutingModule { }
