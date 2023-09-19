import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CptConfigrationComponent } from './cpt-configration/cpt-configration.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CptVerificationComponent } from './cpt-verification/cpt-verification.component';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { InvoicesConfigrationComponent } from './invoices-configration/invoices-configration.component';
import { FacilityGlobalConfLayoutComponent } from './facility-global-conf-layout/facility-global-conf-layout.component';
import { SingleFacilityConfLayoutComponent } from './single-facility-conf-layout/single-facility-conf-layout.component';
import { PhDevicePricingComponent } from './ph-device-pricing/ph-device-pricing.component';
import { ServicesConfigComponent } from './services-config/services-config.component';
import { AwvFormConfigComponent } from './awv-form-config/awv-form-config.component';
import { ChronicDiseasesComponent } from './chronic-diseases/chronic-diseases.component';
import { FacilityEmrIntigrationConfigComponent } from './facility-emr-intigration-config/facility-emr-intigration-config.component';
import { SharedDirectivesModule } from '../shared/shared-directives/shared-directives.module';
import { RpmNotificationComponent } from './rpm-notification/rpm-notification.component';


@NgModule({
  declarations: [CptConfigrationComponent, InvoicesConfigrationComponent, CptVerificationComponent, FacilityGlobalConfLayoutComponent, SingleFacilityConfLayoutComponent, PhDevicePricingComponent, ServicesConfigComponent, AwvFormConfigComponent, ChronicDiseasesComponent, FacilityEmrIntigrationConfigComponent, RpmNotificationComponent],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    SharedModule,
    SharedDirectivesModule
  ]
})
export class ConfigurationModule { }
