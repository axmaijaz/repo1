import { SystemConfigurationComponent } from './system-configuration/system-configuration.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '../shared/page-not-found/page-not-found.component';
import { RpmDeviceComponent } from './rpm-device/rpm-device.component';
import { MainLayoutComponent } from '../Main/main-layout/main-layout.component';
import { AuthGuard } from '../core/guards/auth.guard';
// import { ModalityConfigurationComponent } from './modality-configuration/modality-configuration.component';
import { PatientRpmComponent } from './patient-rpm/patient-rpm.component';
import { DeviceDataSyncComponent } from './device-data-sync/device-data-sync.component';
import { DeviceConfigurationComponent } from './device-configuration/device-configuration.component';
import { PatientModalityConfComponent } from './patient-modality-conf/patient-modality-conf.component';
import { DeviceDataComponent } from './device-data/device-data.component';
import { DeviceOrderComponent } from './device-order/device-order.component';
import { NewDeviceOrderComponent } from './new-device-order/new-device-order.component';
import { HealthGuideLinesComponent } from '../mobile-health-guide/health-guide-lines/health-guide-lines.component';
import { ServiceConfigGuard } from '../core/guards/service-config.guard';
import { OrderInventoryLayoutComponent } from './order-inventory-layout/order-inventory-layout.component';
import { AddInventoryComponent } from './add-inventory/add-inventory.component';
import { PatientSummaryGuard } from '../core/guards/patient-summary.guard';
// import { RpmDashboardComponent } from './rpm-dashboard/rpm-dashboard.component';

const routes: Routes = [

  // {
  //   path: '',
  //   component: MainLayoutComponent,
  //   canActivate: [AuthGuard],
  //   data: { claimType: 'IsAuthenticated' },
  //   children: [
      { path: '', redirectTo: 'patients', pathMatch: 'full' },
      { path: 'rpmDevice', component: RpmDeviceComponent },
      // { path: 'rpmDashboard', component: RpmDashboardComponent},
      { path: 'modalityConfiguration', component: PatientModalityConfComponent },
      { path: 'devicesdata', component: DeviceDataComponent },
      { path: 'modalityConfiguration/:id', component: DeviceConfigurationComponent, data: { showPatientLayout: true} },
      // { path: 'modalityConfiguration1/:id', component: ModalityConfigurationComponent, data: { showPatientLayout: true} },
      { path: 'systemConfiguration/:id' , component: SystemConfigurationComponent, data: { showPatientLayout: true} },
      { path: 'deviceSync' , component: DeviceDataSyncComponent},
      { path: 'device-order' , component: DeviceOrderComponent},
      { path: 'new-device-order' , component: NewDeviceOrderComponent},
      { path: 'add-inventory' , component: AddInventoryComponent},
      {path: "guide-line", component: HealthGuideLinesComponent},
      {path: "order-inventory", component: OrderInventoryLayoutComponent},

  //   ]
  // },
  { path: 'PatientRpm/:id' , component: PatientRpmComponent , canActivate: [PatientSummaryGuard, ServiceConfigGuard], data: { showPatientLayout: true, serviceType:"RPM" },
    // children: [
    //   // { path: '', redirectTo: 'dexcom', pathMatch: 'full' },
    //   { path: 'dexcom', loadChildren: () => import('../dexcom/dexcom.module').then(m => m.DexcomModule)},
    // ]

  },
  { path: 'patients', loadChildren: () => import('./rpm-main/rpm-main.module').then(m => m.RpmMainModule)},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RpmRoutingModule { }
