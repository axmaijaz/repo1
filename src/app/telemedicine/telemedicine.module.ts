import { DpDatePickerModule } from 'ng2-date-picker';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TelemedicineRoutingModule } from './telemedicine-routing.module';
import { TeleChatComponent } from './tele-chat/tele-chat.component';
import { TeleCallComponent } from './tele-call/tele-call.component';
import { SharedModule } from '../shared/shared.module';
import { AnimatedComponent } from '../animated/animated.component';
// import { CounterComponent } from '../counter.component';

@NgModule({
  declarations: [TeleChatComponent, TeleCallComponent, AnimatedComponent],
  imports: [
    CommonModule,
    TelemedicineRoutingModule,
    SharedModule,
    DpDatePickerModule

  ]
})
export class TelemedicineModule { }
