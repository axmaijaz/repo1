import { RpmService } from 'src/app/core/rpm.service';
import { AppUiService } from './../../core/app-ui.service';
import { Location } from '@angular/common';
import { PatientsService } from './../../core/Patient/patients.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { SmartMeterService } from 'src/app/core/smart-meter.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { CustomerType, SMOrderStatus } from 'src/app/Enums/smartMeter.enum';
import { SMOrderDetailLine, SMOrderDetailsRes, SMOrderListDto } from 'src/app/model/smartMeter.model';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';

@Component({
  selector: 'app-device-order',
  templateUrl: './device-order.component.html',
  styleUrls: ['./device-order.component.scss']
})
export class DeviceOrderComponent implements OnInit {
  @ViewChild("orderReceiveConfirmModal") orderReceiveConfirmModal: ModalDirective;
  facilityId: any;
  gettingSMOrders: boolean;
  ordersList: SMOrderListDto[] = [];
  orderStatusEnum = SMOrderStatus;
  searchOrdersStr = '';
  isDeletingOrder: boolean;
  gettingDetails: boolean;
  orderDetailObj = new SMOrderDetailsRes();
  preserverOrder = new SMOrderListDto();
  cpT99453: boolean;
  alreadyPendingBillingMsg: string;
  CustomerTypeEnum = CustomerType;
  gettingClaimDetail: boolean;
  trackingNumberList = [];
  receivingOrder: boolean;
  showOnlyValidLines = false;

  constructor(private toaster: ToastService, private appUi: AppUiService, private patientService: PatientsService, private smService: SmartMeterService,
    private facilityService: FacilityService, private rpmService: RpmService, private securityService: SecurityService, private location: Location) { }

  ngOnInit(): void {
    this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    if (!this.facilityId) {
      this.facilityId = 0;
    }
    this.getOrdersList();
  }
  openTracking(tNumber){
    window.open(`https://www.ups.com/track?loc=en_US&tracknum=${tNumber}&requester=WT/trackdetails`, "_blank");
  }
  getOrdersList() {
    this.gettingSMOrders = true;
    this.smService.GetSMOrders(this.searchOrdersStr, this.facilityId)
      .subscribe(
        (res: SMOrderListDto[]) => {
          res.forEach((order) => {
            if(order.orderStatus == 0 || order.orderStatus == 5 || order.orderStatus == 6){
              order['status'] = 'In Process';
            }
            if(order.orderStatus == 1){
              order['status'] = 'Open';
            }
            if(order.orderStatus == 2){
              order['status'] = 'Shipped';
            }
            if(order.orderStatus == 3 || order.orderStatus == 4 || order.orderStatus == 7){
              order['status'] = 'Closed';
            }
            if(order.orderStatus == 8 || order.orderStatus == 9){
              order['status'] = 'Problem';
            }
          })
          this.ordersList = res;

          this.gettingSMOrders = false;
        },
        (err: HttpResError) => {
          this.toaster.error(err.message);
          this.gettingSMOrders = false;
        }
      );
  }
  openConfirmModal(data: any) {
    const modalDto = new LazyModalDto();
    modalDto.Title = 'Cancel Order';
    modalDto.Text = 'Are you sure that you want to cancel this order.';
    modalDto.callBack = this.CancelSMOrder;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  CancelSMOrder = (order: SMOrderListDto) => {
    this.isDeletingOrder = true;
    this.smService.CancelSMOrder(order.orderNumber)
    .subscribe(
      (res: any) => {
          this.isDeletingOrder = false;
          const oder = this.ordersList.find(x => x.orderNumber === order.orderNumber);
          if (oder) {
            oder.orderStatus = this.orderStatusEnum.Cancelled;
          }
        },
        (error: HttpResError) => {
          this.isDeletingOrder = false;
          this.toaster.error(error.error, "Can not Cancel order from this button call technical support of Smart Meter");
          // console.log(error);
        }
      );
  }
  openChangeStatusConfirmModal(data: any) {
    // const modalDto = new LazyModalDto();
    // modalDto.Title = 'Order Recieved';
    // modalDto.Text = 'Do you want to mark this order as Received ?';
    // modalDto.callBack = this.ReceiveOrder;
    // modalDto.data = data;
    // this.appUi.openLazyConfrimModal(modalDto);
    this.cpT99453 = false;
    this.alreadyPendingBillingMsg = '';
    this.orderReceiveConfirmModal.show();
    this.preserverOrder = data;
    if (this.preserverOrder.customerType === CustomerType.Patient) {
      this.CheckUnbilledDeviceConfigClaim(this.preserverOrder.customerId);
    }
  }
  CheckUnbilledDeviceConfigClaim(patientId: number) {
    this.gettingClaimDetail = true;
    this.rpmService.CheckUnbilledDeviceConfigClaim(patientId)
    .subscribe(
      (res: any) => {
          this.alreadyPendingBillingMsg = res.message;
          if (!res.message) {
            this.cpT99453 = true;
          }
          this.gettingClaimDetail = false;
        },
        (error: HttpResError) => {
          this.gettingClaimDetail = false;
          this.toaster.error(error.message, error.error);
        }
      );
  }
  
  ConfirmAddDeviceToInventory(line: SMOrderDetailLine) {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Add Device";
    modalDto.Text = "Do you want to add this device to Inventory?";
    modalDto.callBack = this.ReceiveOrder;
    modalDto.data = line;
    this.appUi.openLazyConfrimModal(modalDto);
  }

  ReceiveOrder = (line: SMOrderDetailLine) => {
    this.receivingOrder = true;
    let markAsClosed = false;
    const serialsCount = this.orderDetailObj?.order?.lines?.filter(x => x.serial_number)?.length || 0;
    const addedInventoryCount = this.orderDetailObj?.order?.lines?.filter(x => x.addedToInventory)?.length || 0;
    if (serialsCount === (addedInventoryCount + 1)) {
      markAsClosed = true
    }
    this.smService.ReceiveOrder(this.preserverOrder.orderNumber, this.cpT99453, line, markAsClosed)
    .subscribe(
      (res: any) => {
          this.receivingOrder = false;
          const oder = this.ordersList.find(x => x.orderNumber === this.preserverOrder.orderNumber);
          if (oder && markAsClosed) {
            oder.orderStatus = this.orderStatusEnum.Closed;
          }
          this.orderReceiveConfirmModal.hide();
          this.toaster.success('Device added successfully')
          line.addedToInventory = true;
          this.orderDetailObj.order['oStatus'] = 'Closed';
        },
        (error: HttpResError) => {
          this.receivingOrder = false;
          this.toaster.error(error.message, error.error);
          // console.log(error);
        }
      );
  }
  ChangeOrderStatus = (order: SMOrderListDto) => {
    this.isDeletingOrder = true;
    this.smService.ChangeOrderStatus(order.orderNumber, SMOrderStatus.Closed)
    .subscribe(
      (res: any) => {
          this.isDeletingOrder = false;
          const oder = this.ordersList.find(x => x.orderNumber === order.orderNumber);
          if (oder) {
            oder.orderStatus = this.orderStatusEnum.Closed;
          }
        },
        (error: HttpResError) => {
          this.isDeletingOrder = false;
          this.toaster.error(error.message, error.error);
          // console.log(error);
        }
      );
  }
  GetOrderDetails(order: SMOrderListDto, modal: ModalDirective) {
    Object.assign(this.preserverOrder, order);
    this.orderDetailObj = new SMOrderDetailsRes();
    this.trackingNumberList = [];
    this.gettingDetails = true;
    modal.show();
    this.smService.GetOrderDetails(order.orderNumber)
    .subscribe(
      (res: SMOrderDetailsRes) => {
        this.orderDetailObj = res;
        this.orderDetailObj.order['oStatus'] = this.orderStatusEnum[order.orderStatus];
        if(this.orderDetailObj?.order?.tracking_number){
           this.trackingNumberList = this.orderDetailObj.order.tracking_number.split(',');
        }
        },
        (error: HttpResError) => {
          this.gettingDetails = false;
          this.toaster.error(error.message, error.error);
          // console.log(error);
        }
      );
  }
  navigateBack() {
    this.location.back();
  }

}
