import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ToastService } from "ng-uikit-pro-standard";
import { DeviceManagementService } from "src/app/core/device-management.service";
import {
  PHDeviceHistoryActionType,
  PHDeviceStatus,
} from "src/app/Enums/phDevice.enum";
import { HttpResError } from "src/app/model/common/http-response-error";
import { PHDeviceHistoryDto, RpmPHDeviceListDto } from "src/app/model/Inventory/rpm-inventory.model";

@Component({
  selector: "app-rpm-device-history",
  templateUrl: "./rpm-device-history.component.html",
  styleUrls: ["./rpm-device-history.component.scss"],
})
export class RpmDeviceHistoryComponent implements OnInit {
  deviceHistoryLog: PHDeviceHistoryDto[] = [];
  phDeviceHistoryActionTypeEnum = PHDeviceHistoryActionType;
  phDeviceStatusEnum = PHDeviceStatus;
  loadingDeviceHistory: boolean;
  @Output() LoadPhDeviceHistory: EventEmitter<any> = new EventEmitter<any>();
  detailsObject: any;
  detailsObjects: any;
  selectedDevice = new RpmPHDeviceListDto();
  constructor(
    private deviceManagementService: DeviceManagementService,
    private toaster: ToastService
  ) {}

  ngOnInit() {
     
    
  }
  getPhDeviceHistory(device: RpmPHDeviceListDto) {
    if (device) {
      this.loadingDeviceHistory = true;
      this.selectedDevice.model
      this.selectedDevice =  device;
      this.deviceManagementService.GetPhDeviceHistory(device.id).subscribe(
        (res: any) => {
          this.deviceHistoryLog = res;
          this.loadingDeviceHistory = false;
          this.detailsObject = this.deviceHistoryLog[0];

        },
        (err: HttpResError) => {
          this.loadingDeviceHistory = false;
          this.toaster.error(err.error);
        }
      );
    }

  }
}
