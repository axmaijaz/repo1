import { Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import {
  CreateFacilityUserDto,
  FacilityDto,
  FacilityType,
  SetFacilityServiceConfigDto,
} from "src/app/model/Facility/facility.model";
import { FacilityService } from "src/app/core/facility/facility.service";
import { HttpResError } from "src/app/model/common/http-response-error";
import { ToastService, ModalDirective } from "ng-uikit-pro-standard";
import { CcmDataService } from "src/app/core/ccm-data.service";
import { State } from "src/app/model/AppData.model";
import { SecurityService } from "src/app/core/security/security.service";
import { ActivatedRoute } from "@angular/router";
import { UserType } from "src/app/Enums/UserType.enum";
import { Location } from "@angular/common";
import { LazyModalDto } from "src/app/model/AppModels/app.model";
import { AppUiService } from "src/app/core/app-ui.service";
import { DataFilterService } from "src/app/core/data-filter.service";
import { templateJitUrl } from "@angular/compiler";
import { BrandingService } from "src/app/core/branding.service";
import { EmitEvent, EventBusService, EventTypes } from "src/app/core/event-bus.service";

@Component({
  selector: "app-facility",
  templateUrl: "./facility.component.html",
  styleUrls: ["./facility.component.scss"],
})
export class FacilityComponent implements OnInit {
  @Input() insideOrg = false;
  model: any = {};
  IsLoading = false;
  @ViewChild("addFacilityModal") addFacilityModal: ModalDirective;
  @ViewChild("facilityServicesModal") facilityServicesModal: ModalDirective;
  @ViewChild("facilityName") facilityName: ElementRef;
  // @ViewChild('alreadyExistCheckBox') alreadyExistCheckBox: ElementRef;
  // @ViewChild ('facilityName') myFacilityName: ElementRef;
  facilityDto = new FacilityDto();
  facilityList = new Array<FacilityDto>();
  tempFacilityList = new Array<FacilityDto>();
  States = new Array<State>();
  OrganizationId: number;
  emailinvalid: boolean;
  emrList: any;
  selectedFacilityId: number;
  facilityTypeEnumArr = this.dataFilter.getEnumAsList(FacilityType);
  facilityTypeEnum = FacilityType;
  showInActiveFacilities = false;
  alreadyExistFacilityAdmin = false;
  facilityUsersList = new Array<CreateFacilityUserDto>();
  selectedFacilityUser = new CreateFacilityUserDto();
  shortNameValid = true;
  checkingShortName: boolean;
  mysearch: string;
  savingTheme: boolean;
  facilityAdding: boolean;
  constructor(
    private brandingService: BrandingService,
    private facilityService: FacilityService,
    private eventBus: EventBusService,
    private route: ActivatedRoute,
    private securityService: SecurityService,
    private toaster: ToastService,
    private dataFilter: DataFilterService,
    private ccmDataService: CcmDataService,
    private appUi: AppUiService,
    private location: Location // private appUi: AppUiService
  ) {}

  ngOnInit() {

    if (
      this.securityService.securityObject.userType === UserType.FacilityUser
    ) {
      this.OrganizationId =
        +this.securityService.getClaim("OrganizationId").claimValue;
    }
    const ParamOrgId = +this.route.snapshot.paramMap.get("OrgId");
    if (ParamOrgId) {
      this.OrganizationId = ParamOrgId;
    }
    // this.OrganizationId = +this.securityService.getClaim('OrganizationId').claimValue;
    this.getEmrList();
    this.getFacilities();
    this.getStatesList();
    this.getFacilityAdmins();
  }
  getEmrList() {
    this.facilityService.getEmrList().subscribe(
      (res: any) => {
        this.emrList = res;
      },
      (error: HttpResError) => {
        this.IsLoading = true;
        this.toaster.error(error.error, error.message);
      }
    );
  }

  filterFacility(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.tempFacilityList.filter((facility) => {
      return (
        facility.facilityName.toLocaleLowerCase().indexOf(val) !== -1 || !val
      );
    });
    this.facilityList = temp;
  }
  getFacilities() {
    if (this.OrganizationId) {
      this.IsLoading = true;
      this.facilityService
        .getFacilityByOrgId(this.OrganizationId, this.showInActiveFacilities)
        .subscribe(
          (res: any) => {
            this.IsLoading = false;
            this.facilityList = res;
            this.tempFacilityList = res;
          },
          (error: HttpResError) => {
            this.IsLoading = true;
            this.toaster.error(error.error, error.message);
          }
        );
    } else {
      this.IsLoading = true;
      this.facilityService.getFacilityList().subscribe(
        (res: any) => {
          this.IsLoading = false;
          this.facilityList = res;
          this.tempFacilityList = res;
        },
        (error: HttpResError) => {
          this.IsLoading = true;
          this.toaster.error(error.error, error.message);
        }
      );
    }
  }
  editClicked(row: FacilityDto) {
    this.getFacilitiyByID(row.id);
  }
  getFacilitiyByID(id: number) {
    this.facilityService.getFacilityDetail(id).subscribe(
      (res: any) => {
        this.addFacilityModal.show();
        Object.assign(this.facilityDto, res);
        // this.facilityDto = res;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  checkAvailibility(email: string) {
    if (email) {
      this.securityService
        .checkORGUserName(email, this.OrganizationId)
        .subscribe((res: boolean) => {
          if (res) {
            this.emailinvalid = false;
          } else {
            this.emailinvalid = true;
            // window.alert('Email address Already exist');
          }
        });
    }
  }
  CheckShortNameAvailable() {
    if (this.facilityDto.shortName) {
      this.checkingShortName = true;
      this.brandingService
        .CheckShortNameAvailable(this.facilityDto.shortName , 0 ,this.facilityDto?.id || 0)
        .subscribe((res: any) => {
          this.checkingShortName = false;
          if (res?.available) {
            this.shortNameValid = true;
          } else {
            this.shortNameValid = false;
            this.toaster.warning('Short name taken already');
          }
        }, () => {
          this.checkingShortName = false;
        });
    }
  }
  openDefualtConfirmModal() {
      const modalDto1 = new LazyModalDto();
      modalDto1.Title = 'Reset Defualt Theme';
      modalDto1.Text =
        'Do you want to change the color scheme to the default theme';
      modalDto1.callBack = this.callBackBhi;
      modalDto1.rejectCallBack = this.rejectCallBackBhi;
      // modalDto.data = data;
      this.appUi.openLazyConfrimModal(modalDto1);
  }
  rejectCallBackBhi = () => {
  }
  callBackBhi = () => {
  //  this.bhiConsentModal.show();
  this.SetDefualtThemereset();
  }
  SetDefualtThemereset() {
    this.facilityDto.primaryColor = "#4eb048";
    this.facilityDto.secondaryColor =  "#1d3d71";
    this.facilityDto.sideNavBarColor = "#2b373d";
    this.SetFacilityTheme();
  }
  SetFacilityTheme() {
    this.savingTheme = true;
    this.brandingService
    .SetFacilityTheme(this.facilityDto?.id , this.facilityDto.primaryColor, this.facilityDto.secondaryColor, this.facilityDto.sideNavBarColor)
    .subscribe((res: any) => {
        this.savingTheme = false;
        this.toaster.success(`Facility theme saved successfully`);
      },
      () => {
        this.savingTheme = false;

      });
  }
  getStatesList() {
    this.ccmDataService.getStates().subscribe(
      (res: any) => {
        this.States = res;
      },
      (err: HttpResError) => {
        this.toaster.error(err.message, err.error || err.error);
      }
    );
  }
  addInvoiceContactEmail() {
    this.facilityDto.invoiceContactEmail = this.facilityDto.contactEmail;
  }
  registerNewFacility() {
    if (this.OrganizationId) {
      this.facilityDto.organizationId = this.OrganizationId;
    }
    this.facilityAdding = true;
    this.facilityService.registerFacility(this.facilityDto).subscribe(
      (res: any) => {
        this.facilityDto = new FacilityDto();
        this.addFacilityModal.hide();
        this.facilityAdding = false;
        this.toaster.success("Data Saved Successfully");
        this.getFacilities();
        // this.facilityName.nativeElement.value ='';
        // this.facilityDto.siteManager.password= undefined;
      },
      (error: HttpResError) => {
        this.facilityAdding = false;
        // this.addFacilityModal.hide();
        this.toaster.error(error.message, error.error);
      }
    );
  }
  UpdateFacility() {
    this.facilityAdding = true;
    this.facilityService.editFacility(this.facilityDto).subscribe(
      (res: any) => {
        this.facilityDto = new FacilityDto();
        this.addFacilityModal.hide();
        this.facilityAdding = false;
        this.toaster.success("Data Saved Successfully");
        this.getFacilities();
      },
      (error: HttpResError) => {
        this.facilityAdding = false;
        // this.addFacilityModal.hide();
        this.toaster.error(error.message, error.error);
      }
    );
  }
  goBack() {
    this.location.back();
  }
  resetFacilityDto() {
    this.facilityDto = new FacilityDto();
    this.shortNameValid = true;
    this.alreadyExistFacilityAdmin = false;
  }

  deleteFaclity(id: number) {
    if (confirm("Do you really want to delete this facility")) {
      this.facilityService.removeFacility(id).subscribe(
        (res) => {
          this.toaster.success("Facility deleted successfully");
          this.getFacilities();
        },
        (err: HttpResError) => {
          this.toaster.error(err.message, err.error);
        }
      );
    }
  }
  ConfirmFacilityStateChange(facility: FacilityDto) {
    const modalDto = new LazyModalDto();
    const state = facility.isActiveState ? 'Deactivate': 'Activate';
    const enable = facility.isActiveState ? 'Disable': 'Enable';
    modalDto.Title = `Facility ${state}`;
    modalDto.Text = `<p class="text-danger">YOU ARE TRYING TO <strong>${state} ${facility.facilityName}</strong>, THIS ACTION WILL <strong>${enable}</strong> ALL FACILITY USER AND PATIENTS TO ACCESS THE APPLICATION. ARE YOU SURE?<p>`;
    modalDto.callBack = this.setFacilityActive;
    modalDto.data = facility;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  setFacilityActive = (facility: FacilityDto) => {
    var activeState: boolean;
    var facilityId: number;
    facilityId = facility.id;
    this.facilityService.MakeFacilityInActive(facilityId, facility.isActiveState).subscribe(
      (res: any) => {
        if ((!facility.isActiveState) == false) {
          this.toaster.warning('Facility deactivated successfully')
        } else {
          this.toaster.success('Facility activated successfully')
        }
        this.getFacilities();
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
      }
    );
  }
  changeCheckboxValue() {
    if (this.alreadyExistFacilityAdmin) {
    //   this.alreadyExistFacilityAdmin = false;
      this.facilityDto.siteManager.firstName = '';
      this.facilityDto.siteManager.middleName = '';
      this.facilityDto.siteManager.lastName = '';
      this.facilityDto.siteManager.email = '';
      this.emailinvalid = false;
    } else {
      // this.alreadyExistFacilityAdmin = true;
    }
  }
  fillSiteAdminValue(){
    if(this.selectedFacilityUser){
      this.facilityDto.siteManager.facilityUserId = this.selectedFacilityUser.id;
      this.facilityDto.siteManager.firstName= this.selectedFacilityUser.firstName;
      this.facilityDto.siteManager.middleName= this.selectedFacilityUser.middleName;
      this.facilityDto.siteManager.lastName= this.selectedFacilityUser.lastName;
      this.facilityDto.siteManager.email= this.selectedFacilityUser.email;
    }
  }
  getFacilityAdmins() {
    const facilityId = 0;
    const role = 'Facility Admin';
    this.facilityService
      .GetFacilityUsers(facilityId, role)
      .subscribe(
        (res: any) => {
          this.facilityUsersList = res;
        },
        (err: HttpResError) => {
          this.toaster.error(err.error);
        }
      );
  }
  OpenFacilityQuick(row: FacilityDto) {
    const emitObj = new EmitEvent();
    emitObj.name = EventTypes.TriggerGlobalIframe;
    emitObj.value = `/modalConfig/facility/invoices-configration/${row.id}`;
    this.eventBus.emit(emitObj);
  }
  // openConfirmModal(id: number) {
  //   const modalDto = new LazyModalDto();
  //   modalDto.Title = "Delete facility";
  //   modalDto.Text = "Do you really want to delete this facility?";
  //   modalDto.callBack = this.callBack;
  //   modalDto.data = id;
  //   this.appUi.openLazyConfrimModal(modalDto);
  // }
  // callBack = (data: any) => {
  //   this.deleteFaclity(data);
  // }

  ViewTheme() {
    const theme = `?applyPreview=yes&primaryColor=${this.facilityDto.primaryColor}&secondaryColor=${this.facilityDto.secondaryColor}&sideNavBarColor=${this.facilityDto.sideNavBarColor}`
    const result = window.open(location.href + theme, "_blank");
    result.focus()
  }
}
