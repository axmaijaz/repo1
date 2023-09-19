import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UesrInfoRoutingModule } from './uesr-info-routing.module';
import { MdbSharedModule } from '../mdb-shared/mdb-shared.module';
import { FacilityUserProfileComponent } from './facility-user-profile/facility-user-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { QRCodeModule } from 'angularx-qrcode';
import { NgSelectModule } from '@ng-select/ng-select';
export let options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  declarations: [FacilityUserProfileComponent],
  imports: [
    NgxMaskModule.forRoot(options),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UesrInfoRoutingModule,
    MdbSharedModule,
    QRCodeModule,
    NgSelectModule,
  ]
})
export class UesrInfoModule { }
