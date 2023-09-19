import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { ModalDirective, ToastService } from "ng-uikit-pro-standard";
import { AppUiService } from "src/app/core/app-ui.service";
import { DeviceManagementService } from "src/app/core/device-management.service";
import { LazyModalDto } from "src/app/model/AppModels/app.model";
import { HttpResError } from "src/app/model/common/http-response-error";
import { RpmPHDeviceListDto } from "src/app/model/Inventory/rpm-inventory.model";
import { PatientDto } from "src/app/model/Patient/patient.model";
import { DeviceSaleDetailComponent } from "../device-sale-detail/device-sale-detail.component";

@Component({
  selector: "app-rpm-device-dispose",
  templateUrl: "./rpm-device-dispose.component.html",
  styleUrls: ["./rpm-device-dispose.component.scss"],
})
export class RpmDeviceDisposeComponent implements OnInit {
  @Output() ReloadInventory: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("disposeDeviceModal") disposeDeviceModal: ModalDirective;
  // @ViewChild("DeviceSaleDetailsCMPRef") DeviceSaleDetailsCMPRef: DeviceSaleDetailComponent;
  selectedDevice = new RpmPHDeviceListDto();
  deviceDisposing: boolean;
  selectedDeviceId: number;

  constructor(
    private deviceManagementService: DeviceManagementService,
    private toaster: ToastService,
    private appUiService: AppUiService
  ) {}

  ngOnInit() {
  }
  getSaleDetails() {
    this.deviceManagementService.loadSaleDetailsDevice.next(this.selectedDevice.id);
  }
  markDeviceDisposed() {
    this.deviceDisposing = true;
    this.deviceManagementService
      .MarkDeviceDisposed(this.selectedDevice.id)
      .subscribe(
        (res: any) => {
          this.disposeDeviceModal.hide();
          this.toaster.success("Device Disposed Successfully.");
          this.ReloadInventory.next();
          this.deviceDisposing = false;
        },
        (err: HttpResError) => {
          this.toaster.error(err.error);
          this.deviceDisposing = false;
        }
      );
  }
  openConfirmModal() {
    const modalDto1 = new LazyModalDto();
    modalDto1.Title = 'Confirmation';
    modalDto1.Text =
      `The device ${this.selectedDevice.serialNo} will be disposed. Do you want to proceed?`;
    modalDto1.callBack = this.callBackBhi;
    modalDto1.rejectCallBack = this.rejectCallBackBhi;
    this.appUiService.openLazyConfrimModal(modalDto1);
}
rejectCallBackBhi = () => {
}
callBackBhi = (row) => {
  this.markDeviceDisposed();
}
}
