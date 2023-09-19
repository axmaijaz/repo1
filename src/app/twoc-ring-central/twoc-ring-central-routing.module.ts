import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RcCallsMsgComponent } from './rc-calls-msg/rc-calls-msg.component';


const routes: Routes = [
  {path: '', component: RcCallsMsgComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TwocRingCentralRoutingModule { }
