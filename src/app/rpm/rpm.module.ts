import { ModalsSharedModule } from './../modals-shared/modals-shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RpmRoutingModule } from './rpm-routing.module';
import { RpmDeviceComponent } from './rpm-device/rpm-device.component';
import { SharedModule } from '../shared/shared.module';
// import { ModalityConfigurationComponent } from './modality-configuration/modality-configuration.component';
import { PatientRpmComponent } from './patient-rpm/patient-rpm.component';
import { SystemConfigurationComponent } from './system-configuration/system-configuration.component';
import { DeviceDataSyncComponent } from './device-data-sync/device-data-sync.component';
import { DeviceConfigurationComponent } from './device-configuration/device-configuration.component';
// MDB Angular Pro
import { DatepickerModule, FileInputModule } from 'ng-uikit-pro-standard';
import { RpmDashboardComponent } from './rpm-dashboard/rpm-dashboard.component';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { WavesModule, TableModule } from 'ng-uikit-pro-standard';
import { PatientModalityConfComponent } from './patient-modality-conf/patient-modality-conf.component';
import { DeviceDataComponent } from './device-data/device-data.component';
import { TabsModule } from 'ng-uikit-pro-standard';
import { DeviceOrderComponent } from './device-order/device-order.component';
import { NewDeviceOrderComponent } from './new-device-order/new-device-order.component'
import { EditorModule } from '@tinymce/tinymce-angular';
import { UtilityModule } from '../utility/utility.module';
import { Daterangepicker } from 'ng2-daterangepicker';
import { CheckboxModule } from 'ng-uikit-pro-standard'
import { PatientSharedModule } from 'src/app/patient-shared/patient-shared.module';
import { OrderInventoryLayoutComponent } from './order-inventory-layout/order-inventory-layout.component';
import { AddInventoryComponent } from './add-inventory/add-inventory.component';
import { PatientDetailModule } from '../admin/patient/patient-details/patient-detail/patient-detail.module';
import { FormsModule } from '@angular/forms';
import { RpmInterventionsComponent } from './rpm-interventions/rpm-interventions.component';
import { CustomPatientListingModule } from '../custom-patient-listing/custom-patient-listing.module';

@NgModule({
  declarations: [
    RpmDeviceComponent,
    // ModalityConfigurationComponent,
    PatientRpmComponent, SystemConfigurationComponent, DeviceDataSyncComponent,
    DeviceConfigurationComponent,
    RpmDashboardComponent,
    PatientModalityConfComponent,
    DeviceDataComponent,
    DeviceOrderComponent,
    NewDeviceOrderComponent,
    OrderInventoryLayoutComponent,
    AddInventoryComponent,
    RpmInterventionsComponent
  ],
  imports: [
  SharedModule,
    CommonModule,
    DatepickerModule,
    ModalsSharedModule,
    RpmRoutingModule,
    FileInputModule,
    MalihuScrollbarModule.forRoot(),
    TableModule,
    WavesModule,
    TabsModule,
    EditorModule,
    UtilityModule,
    Daterangepicker,
    CheckboxModule,
    PatientSharedModule,
    PatientDetailModule,
    FormsModule,
    CustomPatientListingModule,
  ]
})
export class RpmModule { }
