import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RpmInventoryDetailComponent } from './rpm-inventory-detail/rpm-inventory-detail.component';
import { RpmDeviceIssueComponent } from './rpm-device-issue/rpm-device-issue.component';
import { RpmDeviceReturnComponent } from './rpm-device-return/rpm-device-return.component';
import { RpmInventoryListComponent } from './rpm-inventory-list/rpm-inventory-list.component';
import { RpmDeviceTransferComponent } from './rpm-device-transfer/rpm-device-transfer.component';
import { RpmDeviceHistoryComponent } from './rpm-device-history/rpm-device-history.component';
import { DeviceSaleDetailComponent } from './device-sale-detail/device-sale-detail.component';
import { RpmDeviceDisposeComponent } from './rpm-device-dispose/rpm-device-dispose.component';
import { DeviceRequestListComponent } from './device-request-list/device-request-list.component';


const routes: Routes = [
  { path: 'inventory-list' , component: RpmInventoryListComponent},
  { path: 'device-issue' , component: RpmDeviceIssueComponent},
  { path: 'device-return' , component: RpmDeviceReturnComponent},
  { path: 'inventory-detail' , component: RpmInventoryDetailComponent},
  { path: 'device-transfer' , component: RpmDeviceTransferComponent},
  { path: 'device-history' , component: RpmDeviceHistoryComponent},
  { path: 'device-sale-detail' , component: DeviceSaleDetailComponent},
  { path: 'device-dispose' , component: RpmDeviceDisposeComponent},
  { path: 'device-request' , component: DeviceRequestListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RpmInventoryRoutingModule { }
