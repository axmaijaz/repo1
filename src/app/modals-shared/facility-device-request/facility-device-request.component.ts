import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { ModalDirective, ToastService } from "ng-uikit-pro-standard";
import { ComplaintsService } from "src/app/core/complaints.service";
import { DeviceManagementService } from "src/app/core/device-management.service";
import { FacilityService } from "src/app/core/facility/facility.service";
import { PatientsService } from "src/app/core/Patient/patients.service";
import { RpmService } from "src/app/core/rpm.service";
import { PhdevicePricingService } from "src/app/core/rpm/phdevice-pricing.service";
import { SecurityService } from "src/app/core/security/security.service";
import { DepartmentType } from "src/app/Enums/complaints.enum";
import { CustomerType } from "src/app/Enums/smartMeter.enum";
import {
  AddComplaintDto,
  ComplaintListDto,
} from "src/app/model/AppModels/complaints.model";
import { SearchedChatUsersDto } from "src/app/model/chat/chat.model";
import { HttpResError } from "src/app/model/common/http-response-error";
import { FacilityDto } from "src/app/model/Facility/facility.model";
import { NewDeviceRequestDto, SaleDeviceToFacilityDto } from "src/app/model/Inventory/rpm-inventory.model";
import { FilterPatient, PatientDto } from "src/app/model/Patient/patient.model";
import { PHDevicePricingListDto, SaleTypeEnum } from "src/app/model/rpm/phdevice-pricing.model";
import { CheckPatientDeviceExistsDto } from "src/app/model/ScreeningTools/phq.modal";
import { CreateSMOrderDto } from "src/app/model/smartMeter.model";

@Component({
  selector: "app-facility-device-request",
  templateUrl: "./facility-device-request.component.html",
  styleUrls: ["./facility-device-request.component.scss"],
})
export class FacilityDeviceRequestComponent implements OnInit {

  @Output() deviceRequestAdded = new EventEmitter();
  @ViewChild("facilityDeviceRequestModal") facilityDeviceRequestModal: ModalDirective;
  @ViewChild("facilityDeviceRequestModalPreview") facilityDeviceRequestModalPreview: ModalDirective;
  checkPatientDeviceExistsDto = new CheckPatientDeviceExistsDto();
  searchedChatUserList: PatientDto[];
  searchingChatUsers: boolean;
  alreadyPendingBillingMsg: string;
  cpT99453: boolean;
  searchParam: string;
  CurrentPatient: PatientDto;
  filterPatientDto = new FilterPatient();
  selectedFacility = new FacilityDto();
  createDeviceRequestObj = new NewDeviceRequestDto();
  addingComplaint: boolean;
  facilityId: number;
  facilityDto: FacilityDto;
  CustomerType = CustomerType;
  rpmModalitEnumList: { modalityCode: string; modalityName: string }[];
  selectedDeviceType: { modalityCode: string; modalityName: string };
  // deviceCount = 1;
  // note = "";
  shipping_method = "";
  saleTypeEnum = SaleTypeEnum;
  complainTypeId: number;
  patientHaveAlreadyModality = false;
  gettingPricing: boolean;
  phDevicesPricingList: PHDevicePricingListDto[];
  // saleDeviceToFacilityObj= new SaleDeviceToFacilityDto();
  complaintSubTypesList: any[];
  complainSubTypeId: number;
  customerName: string;
  addingRequest: boolean;

  constructor(
    private patientService: PatientsService,
    private deviceService: DeviceManagementService,
    private facilityService: FacilityService,
    private securityService: SecurityService,
    private toaster: ToastService,
    private complaintService: ComplaintsService,
    private rpmService: RpmService,
    private phDevicePricingService: PhdevicePricingService
  ) {}

  ngOnInit(): void {
    this.rpmModalitEnumList = this.rpmService.modalitiesList;
    this.facilityId = +this.securityService.getClaim("FacilityId").claimValue;
    this.getFacilityById();
    // this.getComplaintTypes();
    this.GetPricingsByFacilityId();
  }
  // CustomerTypeChanged(type: number) {
  //   this.createDeviceRequestObj = new NewDeviceRequestDto();
  //   this.selectedDeviceType = null;
  //   this.patientHaveAlreadyModality = false;
  //   if (type === 1) {
  //     this.createDeviceRequestObj.customer_type = CustomerType.Facility;
  //     this.SelectFacility();
  //   }
  //   if (type === 2) {
  //     this.createDeviceRequestObj.customer_type = CustomerType.Patient;
  //     this.deviceCount = 1;
  //   }
  // }
  getFacilityById() {
    // this.isLoading = true;
    // this.patientsService.getPatientDetail(this.PatientId).subscribe(
    if (!this.facilityId) {
      return;
    }
    this.facilityService.getFacilityDetail(this.facilityId).subscribe(
      (res: FacilityDto) => {
        this.facilityDto = res;
        this.SelectFacility();
      },
      (error: HttpResError) => {
        this.toaster.error(error.error);
      }
    );
  }
  OpenModal() {
    this.selectedDeviceType = null;
    // this.deviceCount = 1;
    // this.note = "";
    this.shipping_method = "";
    this.searchParam = "";
    this.createDeviceRequestObj = new NewDeviceRequestDto();
    this.CurrentPatient = new PatientDto();
    this.patientHaveAlreadyModality = false;
    this.facilityDeviceRequestModal.show();
  }
  getFilterPatientsList2() {
    let result = this.CurrentPatient.lastName.concat(', ',this.CurrentPatient.firstName);
    if(result != this.searchParam){
      if (this.customerName == this.searchParam || !this.searchParam) {
        return;
      }
      const fPDto = new FilterPatient();
      this.searchedChatUserList = [];
      this.searchingChatUsers = true;
      for (const filterProp in this.filterPatientDto) {
        if (
          this.filterPatientDto[filterProp] === null ||
          this.filterPatientDto[filterProp] === undefined
        ) {
          this.filterPatientDto[filterProp] = fPDto[filterProp];
          // this.FilterPatientDto[filterProp] = 0;
        }
      }
      this.searchingChatUsers = true;
      // this.searchingChatUsersPayersList = true;
      this.filterPatientDto.FacilityUserId = 0;
      // FacilityId = 0
      this.filterPatientDto.CareProviderId = 0;
      this.filterPatientDto.FacilityId = this.facilityId;
      this.filterPatientDto.SearchParam = this.searchParam;
      this.filterPatientDto.PageNumber = 1;
      this.filterPatientDto.PageSize = 20;
      this.filterPatientDto.ccmStatus = [];
  
      this.patientService.getFilterPatientsList2(this.filterPatientDto).subscribe(
        (res: any) => {
          this.searchingChatUsers = false;
          this.searchedChatUserList = res.patientsList;
        },
        (error: HttpResError) => {
          this.searchingChatUsers = false;
          // this.isLoadingPayersList = false;
          this.toaster.error(error.error, error.message);
        }
      );
    }
  }
  SelectFacility() {
    // this.createDeviceRequestObj.customer_type = CustomerType.Facility;
    this.createDeviceRequestObj.facilityId = this.facilityDto.id;
    this.createDeviceRequestObj.patientId = null;
    this.customerName = this.facilityDto.facilityName;
    this.createDeviceRequestObj.address1 = this.facilityDto.address;
    this.createDeviceRequestObj.address2 = "";
    this.createDeviceRequestObj.city = this.facilityDto.city;
    this.createDeviceRequestObj.state = this.facilityDto.stateName;
    this.createDeviceRequestObj.zipCode = this.facilityDto.zipCode;
    this.createDeviceRequestObj.country = 'US';
    this.createDeviceRequestObj.status = 0;
    this.createDeviceRequestObj.type = 0;
    if(this.CurrentPatient.id){
      this.CurrentPatient = new PatientDto();
      this.searchParam = '';
    }
  }
  SelectPatient(patient: SearchedChatUsersDto) {
    this.searchedChatUserList = [];
    this.alreadyPendingBillingMsg = "";
    this.cpT99453 = false;
    this.createDeviceRequestObj.quantity = 1;
    this.patientService
    .getPatientDetail(patient.id)
    .subscribe((res: PatientDto) => {
      this.searchParam = res.lastName + ", " + res.firstName;
      this.CurrentPatient = res;
      this.customerName = patient.fullName ;
        // this.createDeviceRequestObj.customer_type = CustomerType.Patient;
        this.createDeviceRequestObj.patientId = res.id
        // this.createDeviceRequestObj.customer_name =
        //   res.firstName + " " + res.lastName;
        this.createDeviceRequestObj.address1 = res.currentAddress;
        this.createDeviceRequestObj.city = res.city;
        this.createDeviceRequestObj.state = res.state;
        this.createDeviceRequestObj.zipCode = res.zip;
      });
  }
  getComplaintTypes() {
    this.complaintService.getComplaintTypes().subscribe(
      (res: any[]) => {
        this.complainTypeId = res.find((x) => x.name == "4GDevice").id;
        this.fillComplaintSubType();
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
      }
    );
  }
  fillComplaintSubType() {
    this.complaintSubTypesList = [];
    this.complainSubTypeId = null;
    if(this.complainTypeId){
      this.complaintService.getComplaintsSubTypes(this.complainTypeId).subscribe(
        (res: any) => {
          this.complaintSubTypesList = res;
        this.complainSubTypeId = res.find((x) => x.name == "NewRequest").id;
        }, (err: HttpResError) => {
          this.toaster.error(err.error);
        }
      )
    }
  }
  SubmitDeviceRequest() {
    this.addingRequest = true;
    this.deviceService.CreateDeviceRequest(this.createDeviceRequestObj).subscribe(
      (res: any) => {
        this.addingRequest = false;
        this.deviceRequestAdded.emit();
        this.facilityDeviceRequestModal.hide();
          this.facilityDeviceRequestModalPreview.hide();
        this.toaster.success( "Device request sent successfully with ticket no " + res?.ticketNo);
      },
      (error: HttpResError) => {
        this.addingRequest = false;
        this.toaster.error(error.message, error.error);
      }
    );
  }
  // FillComplainObject() {
  //   const addComplaintObject = new AddComplaintDto();
  //   addComplaintObject.complaintTypeId = this.complainTypeId; // 4GDevice
  //   addComplaintObject.complaintSubTypeId = this.complainSubTypeId; // NewRequest
  //   addComplaintObject.departmentType = DepartmentType["Care Delivery"];

  //   if (this.createDeviceRequestObj.customer_type === CustomerType.Patient) {
  //     addComplaintObject.patientId = +this.createDeviceRequestObj.customer_id;
  //   } else {
  //     addComplaintObject.patientId = null;
  //   }
  //   addComplaintObject.comment = "";
  //   addComplaintObject.details += ` Facility Name: ${this.facilityDto.facilityName} <br>`;
  //   addComplaintObject.details = ` Customer Type: ${
  //     CustomerType[this.createDeviceRequestObj.customer_type]
  //   } <br>`;
  //   addComplaintObject.details += ` Customer Name: ${this.createDeviceRequestObj.customer_name} <br>`;
  //   addComplaintObject.details += `      Modality: ${this.selectedDeviceType.modalityName} <br>`;
  //   addComplaintObject.details += `      Quantity: ${this.deviceCount} <br>`;
  //   addComplaintObject.details += `Shipping Method: ${this.shipping_method}<br>`;
  //   addComplaintObject.details += `     Sale Type: ${this.saleType}<br>`;
  //   addComplaintObject.details += `     Address 1: ${this.createDeviceRequestObj.address1} <br>`;
  //   addComplaintObject.details += `     Address 2: ${this.createDeviceRequestObj.address2} <br>`;
  //   addComplaintObject.details += `          City: ${this.createDeviceRequestObj.city} <br>`;
  //   addComplaintObject.details += `         State: ${this.createDeviceRequestObj.state} <br>`;
  //   addComplaintObject.details += `           Zip: ${this.createDeviceRequestObj.zipCode} <br>`;
  //   addComplaintObject.details += `          Note: ${this.note} <br>`;
  //   this.AddPatientComplaint(addComplaintObject);
  //   this.facilityDeviceRequestModalPreview.hide();
  //   this.facilityDeviceRequestModal.hide()
  // }
  AddPatientComplaint(addComplaintObject: AddComplaintDto) {
    this.addingComplaint = true;
    this.complaintService.AddPatientComplaint(addComplaintObject).subscribe(
      (res: ComplaintListDto) => {
        addComplaintObject.id = res.id;
        this.addingComplaint = false;
        this.facilityDeviceRequestModal.hide();
        this.toaster.success(
          "Device request sent successfully with ticket no " + res.ticketNo
        );
      },
      (error: HttpResError) => {
        this.addingComplaint = false;
        this.toaster.error(error.message, error.error);
      }
    );
  }
  checkPatientDeviceExists() {
    if (this.createDeviceRequestObj.patientId) {
      this.checkPatientDeviceExistsDto.patientId = this.CurrentPatient.id;
      this.checkPatientDeviceExistsDto.modalityCode =
        this.selectedDeviceType.modalityCode;
      if (this.checkPatientDeviceExistsDto.modalityCode) {
        this.phDevicePricingService
          .CheckPatientDeviceExists(this.checkPatientDeviceExistsDto)
          .subscribe(
            (res: boolean) => {
              if (res == true) {
                this.patientHaveAlreadyModality = true;
              } else {
                this.patientHaveAlreadyModality = false;
              }
            },
            (err: HttpResError) => {
              this.toaster.error(err.error);
            }
          );
      }
    }
  }
  GetPricingsByFacilityId() {
    if (!this.facilityId) {
      return;
    }
    this.gettingPricing = true;
    this.phDevicePricingService
      .GetPricingsByFacilityId(this.facilityId)
      .subscribe(
        (res: PHDevicePricingListDto[]) => {
          this.gettingPricing = false;
          this.phDevicesPricingList = res.sort((x, y) =>
            x.modality.localeCompare(y.modality)
          );
          // this.ApplyDefaultPricing();
          // this.calculateDevicesPrice();
        },
        (error: HttpResError) => {
          this.toaster.error(error.error || error.error);
          this.gettingPricing = false;
        }
      );
  }
  ApplyDefaultPricing() {
    this.createDeviceRequestObj.modalityCode = this.selectedDeviceType?.modalityCode;
    const modalityPricing = this.phDevicesPricingList?.find(x => x.modality === this.selectedDeviceType?.modalityCode)
    // this.saleDeviceToFacilityObj.saleType = SaleTypeEnum.Sale;
    if (!modalityPricing) {
      return;
    }
    this.createDeviceRequestObj.shipping = 0;
    // this.createDeviceRequestObj.discount = 0;
    // this.createDeviceRequestObj.totalPrice = modalityPricing.price;
    this.createDeviceRequestObj.note = "";
    this.createDeviceRequestObj.installmentCount = modalityPricing.installmentsCount;
    // this.createDeviceRequestObj.leasePrice = modalityPricing.leasePrice;
    if(this.createDeviceRequestObj.saleType == 1){
      this.createDeviceRequestObj.salePrice = modalityPricing.price;
      this.createDeviceRequestObj.totalPrice = modalityPricing.price * this.createDeviceRequestObj.quantity;
    }
    if(this.createDeviceRequestObj.saleType == 2){
      this.createDeviceRequestObj.salePrice = modalityPricing.leasePrice;
      this.createDeviceRequestObj.totalPrice = modalityPricing.leasePrice * this.createDeviceRequestObj.quantity;
    }
  }
}
