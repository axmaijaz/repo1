import { SharedPipesModule } from 'src/app/shared-pipes/shared-pipes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RpmInventoryRoutingModule } from './rpm-inventory-routing.module';
import { RpmInventoryListComponent } from './rpm-inventory-list/rpm-inventory-list.component';
import { DatepickerModule, FileInputModule, TableModule, TabsModule, WavesModule } from 'ng-uikit-pro-standard';
import { ModalsSharedModule } from 'src/app/modals-shared/modals-shared.module';
import { RpmRoutingModule } from '../rpm-routing.module';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { RpmDeviceIssueComponent } from './rpm-device-issue/rpm-device-issue.component';
import { RpmDeviceReturnComponent } from './rpm-device-return/rpm-device-return.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RpmInventoryDetailComponent } from './rpm-inventory-detail/rpm-inventory-detail.component';
import { RpmDeviceTransferComponent } from './rpm-device-transfer/rpm-device-transfer.component';
import { RpmDeviceHistoryComponent } from './rpm-device-history/rpm-device-history.component';
import { SaleDeviceComponent } from './sale-device/sale-device.component';
import { DeviceSaleDetailComponent } from './device-sale-detail/device-sale-detail.component';
import { RpmDeviceDisposeComponent } from './rpm-device-dispose/rpm-device-dispose.component';
import { DeviceRequestListComponent } from './device-request-list/device-request-list.component';
import { Daterangepicker } from 'ng2-daterangepicker';
import { SharedDirectivesModule } from 'src/app/shared/shared-directives/shared-directives.module';


@NgModule({
  declarations: [RpmInventoryListComponent, RpmDeviceIssueComponent, RpmDeviceReturnComponent, RpmInventoryDetailComponent, RpmDeviceTransferComponent, RpmDeviceHistoryComponent, SaleDeviceComponent, DeviceSaleDetailComponent, RpmDeviceDisposeComponent, DeviceRequestListComponent,],
  imports: [
    CommonModule,
    RpmInventoryRoutingModule,
    DatepickerModule,
    ModalsSharedModule,
    RpmRoutingModule,
    FileInputModule,
    SharedPipesModule,
    SharedDirectivesModule,
    MalihuScrollbarModule.forRoot(),
    TableModule,
    WavesModule,
    TabsModule,
    SharedModule,
    NgxDatatableModule,
    Daterangepicker,
  ]
})
export class RpmInventoryModule { }
