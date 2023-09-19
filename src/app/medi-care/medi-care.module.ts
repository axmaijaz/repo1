import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MediCareRoutingModule } from './medi-care-routing.module';
import { EOBComponent } from './eob/eob.component';
import { SharedModule } from '../shared/shared.module';
import { MedicareEobComponent } from './medicare-eob/medicare-eob.component';
import { ParticalHealthComponent } from './partical-health/partical-health.component';
import { FormsModule } from '@angular/forms';
import { PatientSharedModule } from '../patient-shared/patient-shared.module';
import { EOBV2Component } from './eobv2/eobv2.component';
import { BBCCDAComponent } from './bb-ccda/bb-ccda.component';
import { SharedPipesModule } from '../shared-pipes/shared-pipes.module';

@NgModule({
  declarations: [EOBComponent, MedicareEobComponent, ParticalHealthComponent, EOBV2Component, BBCCDAComponent],
  imports: [
    CommonModule,
    FormsModule,
    PatientSharedModule,
    MediCareRoutingModule,
    SharedModule,
    SharedPipesModule
  ]
})
export class MediCareModule { }
