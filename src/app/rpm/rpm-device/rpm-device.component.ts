import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  EventEmitter,
  OnDestroy
} from "@angular/core";
import { HttpResError } from "src/app/model/common/http-response-error";
import {
  ToastService,
  UploadFile,
  UploadInput,
  humanizeBytes,
  UploadOutput,
  ModalDirective
} from "ng-uikit-pro-standard";
import { DeviceManagementService } from "src/app/core/device-management.service";
import {
  AdminDevicesListDto,
  DeviceInventoryListDto,
  AddDeviceDto,
  DevicesSerialNosDto,
  IssueDevicesDto,
  DeviceInvetoryidDto
} from "src/app/model/deviceModels/device.model";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { VendorDto, ModalityDto } from "src/app/model/rpm.model";
import { RpmService } from "src/app/core/rpm.service";
import {
  FacilityDto,
  OrganizationDto
} from "src/app/model/Facility/facility.model";
import { FacilityService } from "src/app/core/facility/facility.service";
import { FormControl, NgForm } from "@angular/forms";
import { SubSink } from "src/app/SubSink";

@Component({
  selector: "app-rpm-device",
  templateUrl: "./rpm-device.component.html",
  styleUrls: ["./rpm-device.component.scss"]
})
export class RpmDeviceComponent implements OnInit, OnDestroy {
  // @ViewChild('deviceName') deviceName: ElementRef;
  // @ViewChild('selectDevice') selectDevice: ElementRef;
  // @ViewChild('deviceVendorId') deviceVendorId: ElementRef;
  // @ViewChild('modalityId') modalityId: ElementRef;
  // @ViewChild('price') price: ElementRef;
  // @ViewChild('imagePath') imagePath: ElementRef;
  // @ViewChild('description') description: ElementRef;
  // @ViewChild('serialno') serialno: ElementRef;
  @ViewChild("issueDeviceModal") issueDeviceModal: ModalDirective;
  @ViewChild("deviceVendorId") deviceVendorId: ElementRef;
  @ViewChild("serialno") serialno: ElementRef;
  @ViewChild("f2") form: any;
  private subs = new SubSink();
  model: any = {};
  // f2: NgForm;
  organizationId: number;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  showFileName: any;
  issuingDevice: boolean;
  imageFileExtension : boolean;
  constructor(
    private rpmDevice: DeviceManagementService,
    private toaster: ToastService,
    private rpmService: RpmService,
    private facilityService: FacilityService
  ) {
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }
  isLoading = false;
  // checked: boolean;
  addingNew = true;
  addDeviceDto = new AddDeviceDto();
  serialNumberstring = "";
  selectedDevice = new AdminDevicesListDto();
  selectedDeviceforIssue = new DeviceInventoryListDto();
  deviceSerialNos: any;
  serialNos = new Array<DeviceInvetoryidDto>();
  filterDeviceLIstDto = new FilterDeviceLIstDto();
  // = {
  //   CompanyId: 0,
  //   ModalityId: 0
  // };
  vendorList = new Array<VendorDto>();
  filterVendor = new VendorDto();
  modalitiesList = new Array<ModalityDto>();
  adminDeviceList = new Array<AdminDevicesListDto>();
  allDevicesList = new Array<AdminDevicesListDto>();
  DevicesList = new Array<AdminDevicesListDto>();
  adminDeviceListTemp = new Array<AdminDevicesListDto>();
  adminInventoryList = new Array<DeviceInventoryListDto>();
  inventoryTemp = new Array<DeviceInventoryListDto>();
  facilityList = new Array<FacilityDto>();
  selectedFacilityID: number;
  selectedSerialNos = new Array<any>();
  organizationList = new Array<OrganizationDto>();
  selectedOrganization = new OrganizationDto();
  issueDevicesDto = new IssueDevicesDto();
  deviceInventoryIds = new Array<DeviceInvetoryidDto>();
  @ViewChild(DatatableComponent) table: DatatableComponent;
  public notificationScroll = {
    axis: "y",
    theme: "dark-3",
    scrollInertia: 2,
    scrollButtons: { enable: true },
    autoHideScrollbar: true,
    scrollbarPosition: "outside",

  };
  ngOnInit() {
    this.getInventoryList();
    this.getDevicesList();
    this.GetDeviceVendors();
    this.GetModalities();
    this.getOrganizations();
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  GetDeviceVendors() {
    this.isLoading = true;
    this.subs.sink = this.rpmDevice.GetDeviceVendors().subscribe(
      (res: any) => {
        this.isLoading = false;
        this.vendorList = res;
      },
      (error: HttpResError) => {
        this.toaster.error(error.message, error.error);
        this.isLoading = false;
      }
    );
  }
  GetModalities() {
    this.isLoading = true;
    this.subs.sink = this.rpmDevice.GetModalities().subscribe(
      (res: any) => {
        this.isLoading = false;
        this.modalitiesList = res;
      },
      (error: HttpResError) => {
        this.toaster.error(error.message, error.error);
        this.isLoading = false;
      }
    );
  }
  getInventoryList() {
    this.isLoading = true;
    this.subs.sink = this.rpmDevice.GetDeviceInventorybyId(0).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.adminInventoryList = res;
        this.inventoryTemp = res;
      },
      (error: HttpResError) => {
        this.toaster.error(error.message, error.error);
        this.isLoading = false;
      }
    );
  }
  getDevicesList() {
    this.isLoading = true;
    this.subs.sink = this.rpmDevice.GetHealthCareDevices(0).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.adminDeviceList = res;
        this.allDevicesList = res;
        // this.DevicesList= res;
        this.adminDeviceList = this.adminDeviceList.filter(
          d => d.isActive === true
        );
        this.adminDeviceListTemp = this.adminDeviceList;
      },
      (error: HttpResError) => {
        this.toaster.error(error.message, error.error);
        this.isLoading = false;
      }
    );
  }
  filterDeviceSerials(selectData: DeviceInventoryListDto) {
    if (selectData) {
      // console.log(this.selectedDeviceforIssue);
      this.deviceSerialNos = this.adminDeviceListTemp.find(function(serial) {
        return serial.id === selectData.deviceId;
      });
      this.serialNos = this.deviceSerialNos.deviceInventory;
    }
  }
  issueDevices() {
    this.issuingDevice = true;
    if (this.selectedSerialNos.length === 0) {
      window.alert("At least one serial no must be selected");
      return;
    }
    this.issueDevicesDto.deviceInventoryId = this.selectedSerialNos;
    this.issueDevicesDto.facilityId = this.selectedFacilityID;
    this.subs.sink = this.rpmDevice
      .AddIssueDevices(this.issueDevicesDto)
      .subscribe(
        res => {
          this.issuingDevice = false;
          this.toaster.success("Device issued successfully");
          this.selectedSerialNos = new Array<any>();
          this.selectedFacilityID = null;
          this.getDevicesList();
          this.getInventoryList();
          this.issueDeviceModal.hide();
        },
        err => {
          this.issuingDevice = false;
          this.toaster.success("Error saving data.");
        }
      );
  }
  checkedDevices(checked: any, items: any) {
    if (checked) {
      this.selectedSerialNos.push(items);
    } else {
      this.selectedSerialNos = this.selectedSerialNos.filter(
        item => item !== items
      );
    }
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.inventoryTemp.filter(function(d) {
      // const temp = this.temp.filter(function(d) {
      return d.deviceName.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.adminInventoryList = temp;
    // this.adminDeviceList = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  selectedDeviceChanged() {
    if (this.selectedDevice) {
      this.addDeviceDto.id = this.selectedDevice.id;
      this.addDeviceDto.deviceName = this.selectedDevice.deviceName;
      this.addDeviceDto.price = this.selectedDevice.price;
      this.addDeviceDto.imagePath = this.selectedDevice.imagePath;
      this.addDeviceDto.description = this.selectedDevice.description;
      this.addDeviceDto.deviceVendorId = this.selectedDevice.deviceVendorId;
      this.addDeviceDto.modalityId = this.selectedDevice.modalityId;
      if (this.selectedDevice.modalityId) {
        this.addDeviceDto.modalityId = this.selectedDevice.modalityId;
      }
    } else {
      // this.addDeviceDto = new AddDeviceDto();
      this.addDeviceDto.id = 0;
      this.addDeviceDto.deviceName = "";
      this.addDeviceDto.price = 0;
      this.addDeviceDto.imagePath = "";
      this.addDeviceDto.description = "";
      this.addDeviceDto.deviceVendorId = 0;
      this.addDeviceDto.modalityId = 0;
    }
  }
  SubmitDevice() {
    // const tempArr = this.serialNumberstring.split(",");
    // if (tempArr) {
    //   tempArr.forEach(element => {
    //     this.addDeviceDto.serialNumber.push(element);
    //   });
    // }
    this.addDeviceDto.serialNumber = this.serialNumberstring;
    this.isLoading = true;
    this.subs.sink = this.rpmDevice
      .AddHealthCareDevice(this.addDeviceDto)
      .subscribe(
        (res: any) => {
          if (this.addDeviceDto.id === 0) {
            this.addDeviceDto = new AddDeviceDto();
          }
          this.isLoading = false;
          this.serialNumberstring = "";
          this.getDevicesList();
          this.toaster.success(res);
          this.selectedDevice = new AdminDevicesListDto();
          this.resetAddDevice();
          this.getInventoryList();
        },
        (error: HttpResError) => {
          this.toaster.error(error.message, error.error);
          this.isLoading = false;
        }
      );
  }
  resetAddDevice() {
    this.addDeviceDto = new AddDeviceDto();
  }
  resetSelectedDevice() {
    this.selectedDevice = new AdminDevicesListDto();
  }
  deviceStatusChanged(event, item: AdminDevicesListDto) {
    event = event.srcElement.checked;
    this.subs.sink = this.rpmService
      .UpdateDeviceStatus(item.id, event)
      .subscribe(
        res => {
          if (event) {
            this.toaster.success("Device Is Activated Successfully");
          } else {
            this.toaster.warning("Device Is DeActivated");
          }
          // console.log(this.devicesList);
        },
        (error: HttpResError) => {
          this.toaster.error(error.message, error.error);
        }
      );
  }
  getOrganizations() {
    this.isLoading = true;
    this.subs.sink = this.facilityService.getorganizationList().subscribe(
      (res: any) => {
        this.isLoading = false;
        this.organizationList = res;
      },
      (error: HttpResError) => {
        this.isLoading = true;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  getFacilitiesbyOrgId() {
    if (!this.organizationId) {
      return;
    }
    this.facilityList = [];
    this.isLoading = true;
    this.subs.sink = this.facilityService
      .getFacilityByOrgId(this.organizationId)
      .subscribe(
        (res: any) => {
          this.isLoading = false;
          if (res) {
            this.facilityList = res;
          }
        },
        error => {
          this.toaster.error(error.message, error.error || error.error);
          this.isLoading = false;
          // console.log(error);
        }
      );
  }
  filterDevicesStock() {
    if (this.filterVendor) {
      this.adminInventoryList = this.inventoryTemp.filter(
        x => x.deviceVendorId === this.filterVendor.id
      );
    } else {
      this.adminInventoryList = this.inventoryTemp;
    }
  }
  filterDevicesListBYCompanyAndModality() {
    const temp = this.adminDeviceListTemp;
    if (
      (this.filterDeviceLIstDto.CompanyId &&
        !this.filterDeviceLIstDto.ModalityId) ||
      (!this.filterDeviceLIstDto.CompanyId &&
        this.filterDeviceLIstDto.ModalityId)
    ) {
      if (this.filterDeviceLIstDto.CompanyId) {
        this.allDevicesList = temp.filter(
          x => x.deviceVendorId === this.filterDeviceLIstDto.CompanyId
        );
      } else {
        this.allDevicesList = temp.filter(
          x => x.modalityId === this.filterDeviceLIstDto.ModalityId
        );
      }
    } else if (
      this.filterDeviceLIstDto.CompanyId &&
      this.filterDeviceLIstDto.ModalityId
    ) {
      if (this.filterDeviceLIstDto.CompanyId) {
        this.allDevicesList = temp.filter(
          x =>
            x.deviceVendorId === this.filterDeviceLIstDto.CompanyId &&
            x.modalityId === this.filterDeviceLIstDto.ModalityId
        );
      }
    } else {
      this.allDevicesList = this.adminDeviceListTemp;
    }
  }
  //   showFiles() {
  //     let files = '';
  //     for (let i = 0; i < this.files.length; i ++) {
  //       files += this.files[i].name;
  //        if (!(this.files.length - 1 === i)) {
  //          files += ',';
  //       }
  //     }
  //     return files;
  //  }
  onUploadOutput(output: any): void {
    if (output.target.files[0].type === 'image/png' || output.target.files[0].type === 'image/bmp' ||
    output.target.files[0].type === 'image/jpg' || output.target.files[0].type === 'image/jpeg' ||
    output.target.files[0].type === 'image/gif') {
      this.addDeviceDto.imagePath = output.target.files[0];
      this.showFileName = this.addDeviceDto.imagePath.name;
      this.imageFileExtension = false;
    } else {
       this.imageFileExtension = true;
    }
  }
  resetFields() {
    this.addingNew = true;
    this.imageFileExtension = false;
    // this.addDeviceDto.deviceName = "";
    this.serialNumberstring = "";
    // this.addDeviceDto.description = "";
    this.showFileName = "";
    this.addDeviceDto = new AddDeviceDto();
    this.selectedDevice = new AdminDevicesListDto();
    // this.deviceVendorId.nativeElement = '';
    // this.serialno.nativeElement = null;
  }

  // if (output.type === 'allAddedToQueue') {
  // } else if (output.type === 'addedToQueue') {
  //   this.files.push(output.file); // add file to array when added
  // } else if (output.type === 'uploading') {
  //   // update current data in files array for uploading file
  //   const index = this.files.findIndex(file => file.id === output.file.id);
  //   this.files[index] = output.file;
  // } else if (output.type === 'removed') {
  //   // remove file from array when removed
  //   this.files = this.files.filter((file: UploadFile) => file !== output.file);
  // } else if (output.type === 'dragOver') {
  //   this.dragOver = true;
  // } else if (output.type === 'dragOut') {
  // } else if (output.type === 'drop') {
  //   this.dragOver = false;
  // }
  // this.showFiles();
  resetData(
    deviceVendorId: FormControl,
    modalityId: FormControl,
    price: FormControl,
    description: FormControl,
    serialno: FormControl
  ) {
    deviceVendorId.reset();
    modalityId.reset();
    price.reset();
    description.reset();
    serialno.reset();
  }
}

export class FilterDeviceLIstDto {
  CompanyId: number;
  ModalityId: number;
}
