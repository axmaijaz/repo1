import { FacilityEmrIntigrationConfigComponent } from './facility-emr-intigration-config/facility-emr-intigration-config.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CptConfigrationComponent } from './cpt-configration/cpt-configration.component';
import { InvoicesConfigrationComponent } from './invoices-configration/invoices-configration.component';
import { CptVerificationComponent } from './cpt-verification/cpt-verification.component';
import { FacilityGlobalConfLayoutComponent } from './facility-global-conf-layout/facility-global-conf-layout.component';
import { SingleFacilityConfLayoutComponent } from './single-facility-conf-layout/single-facility-conf-layout.component';
import { PhDevicePricingComponent } from './ph-device-pricing/ph-device-pricing.component';
import { ServicesConfigComponent } from './services-config/services-config.component';
import { AwvFormConfigComponent } from './awv-form-config/awv-form-config.component';
import { ChronicDiseasesComponent } from './chronic-diseases/chronic-diseases.component';
import { RpmNotificationComponent } from './rpm-notification/rpm-notification.component';


const routes: Routes = [
  {
    path: 'global', component: FacilityGlobalConfLayoutComponent,
    children: [
      {path: '', redirectTo: 'cpt-configration', pathMatch: 'full'},
      { path: 'insightsadmin', loadChildren: () => import('../patient-insights/patient-insights.module').then(m => m.PatientInsightsModule) },
      { path: 'cpt-configration', component: CptConfigrationComponent },
      // { path: 'invoices-configration', component: InvoicesConfigrationComponent },
      { path: 'verification', component: CptVerificationComponent },
      { path: 'phdevices', component: PhDevicePricingComponent },
    ]
  },
  {
    path: 'facility',data: {isConfigRoute: true} , component: SingleFacilityConfLayoutComponent,
    children: [
      // {path: '', redirectTo: 'cpt-configration', pathMatch: 'full'},
      { path: 'invoices-configration/:facilityId', component: InvoicesConfigrationComponent },
      { path: 'phdevices/:facilityId', component: PhDevicePricingComponent },
      { path: 'modules/:facilityId', component: ServicesConfigComponent },
      { path: 'AWVSetting/:facilityId', component: AwvFormConfigComponent },
      { path: 'EmrConfig/:facilityId', component: FacilityEmrIntigrationConfigComponent },
      { path: 'service', loadChildren: () => import('../organization/org.module').then(m => m.OrgModule) },
    ]
  },
  { path: 'cpt-configration', component: CptConfigrationComponent },
  { path: 'rpm-notification', component: RpmNotificationComponent },
  // { path: 'invoices-configration', component: InvoicesConfigrationComponent },
  { path: 'invoices-configration/:facilityId', component: InvoicesConfigrationComponent },
  { path: 'verification', component: CptVerificationComponent },
  { path: 'chronicDiseases', component: ChronicDiseasesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
