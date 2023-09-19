import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeleChatComponent } from './tele-chat/tele-chat.component';
import { TeleCallComponent } from './tele-call/tele-call.component';

const routes: Routes = [
  { path: '', redirectTo: 'teleChat', pathMatch: 'full' },
  { path: 'teleChat', component: TeleChatComponent },
  { path: 'vCall', component: TeleCallComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TelemedicineRoutingModule { }
