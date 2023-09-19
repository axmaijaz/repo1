import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ToastService } from "ng-uikit-pro-standard";
import { AppUiService } from "src/app/core/app-ui.service";
import { DeviceManagementService } from "src/app/core/device-management.service";
import { SecurityService } from "src/app/core/security/security.service";
import { UserType } from "src/app/Enums/UserType.enum";
import { LazyModalDto } from "src/app/model/AppModels/app.model";
import { HttpResError } from "src/app/model/common/http-response-error";
import {
  DeviceSaleDetailDto,
  PhDeviceInstallmentDto,
} from "src/app/model/Inventory/rpm-inventory.model";
import { SaleTypeEnum } from "src/app/model/rpm/phdevice-pricing.model";

@Component({
  selector: "app-device-sale-detail",
  templateUrl: "./device-sale-detail.component.html",
  styleUrls: ["./device-sale-detail.component.scss"],
})
export class DeviceSaleDetailComponent implements OnInit {
  saleDetailHistory: boolean;
  @Input() deviceId: number;
  waiveOff: boolean;
  waiveOffProgress: boolean;
  deviceSaleDetails: DeviceSaleDetailDto[] = [];
  SaleTypeEnumObj = SaleTypeEnum;
  isAppAdmin: boolean;
  savingTrackingInfo: boolean;
  lastSaleId: number;
  alreadyHasTrackingId: boolean;

  constructor(
    private deviceManagementService: DeviceManagementService,
    private securityService: SecurityService,
    private toaster: ToastService,
    private route: ActivatedRoute,
    private appUi: AppUiService
  ) {}

  ngOnInit(): void {
    if (!this.deviceId) {
      this.deviceId = +this.route.snapshot.queryParamMap.get("deviceId");
    }
    if (this.securityService.securityObject.userType === UserType.AppAdmin) {
      this.isAppAdmin = true;
    }
    this.deviceManagementService.loadSaleDetailsDevice.subscribe((id: number) => {
      this.deviceId = id;
      this.GetSalesByDeviceId();
    })
    this.GetSalesByDeviceId();
  }
  getDeviceDetails(deviceId) {
    this.deviceId = deviceId;
    this.GetSalesByDeviceId();
  }
  SaveTrackingId(item: DeviceSaleDetailDto) {
    if (!item.trackingId) {
      this.toaster.warning(`Please enter tracking id`)
      return;
    }
    this.savingTrackingInfo = true;
    this.deviceManagementService.EditSaleTrackingId(item.id, item.trackingId).subscribe(
      (res: any) => {
        this.savingTrackingInfo = false;
        this.toaster.success(`Tracking info saved `)

      },
      (error: HttpResError) => {
        this.savingTrackingInfo = false;
        this.toaster.error(error.message, error.error);
      }
    );
  }
  GetSalesByDeviceId() {
    this.saleDetailHistory = true;
    this.deviceManagementService.GetSalesByDeviceId(this.deviceId).subscribe(
      (res: DeviceSaleDetailDto[]) => {
        if (res?.length) {
          this.deviceSaleDetails = res.reverse();
          const latestSale = this.deviceSaleDetails[0]
          this.lastSaleId = latestSale.id
          this.alreadyHasTrackingId = latestSale.trackingId ? true : false;
        }

        this.saleDetailHistory = false;
      },
      (err: HttpResError) => {
        this.saleDetailHistory = false;
        this.toaster.error(err.error);
      }
    );
  }
  ConfirmWaveOff(installment: PhDeviceInstallmentDto) {
    const modalDto = new LazyModalDto();
    modalDto.Title = "WaiveOff";
    modalDto.Text = "Do you want to WaiveOff this Installment?";
    modalDto.callBack = this.WaiveOffInstallment;
    modalDto.rejectCallBack = () => {
      installment.isWaivedOff = false;
    };
    modalDto.data = installment;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  WaiveOffInstallment = (installment: PhDeviceInstallmentDto) => {
    this.waiveOffProgress = true;
    this.deviceManagementService
      .WaiveOffInstallment(installment.id, installment.isWaivedOff)
      .subscribe(
        (res: DeviceSaleDetailDto) => {
          const sale = this.deviceSaleDetails.find(
            (x) => x.id === installment.phDeviceSaleId
          );
          if (sale) {
            Object.assign(sale, res);
          }
          this.toaster.success(
            `Waveoff ${installment.isWaivedOff ? "Applied" : "Removed"}`
          );
          this.waiveOffProgress = false;
        },
        (err: HttpResError) => {
          this.waiveOffProgress = false;
          this.toaster.error(err.error);
        }
      );
  };
}
