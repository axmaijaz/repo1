import { Component, OnInit, ViewChild } from '@angular/core';
import { FacilityDto, OrganizationDto } from 'src/app/model/Facility/facility.model';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { CcmDataService } from 'src/app/core/ccm-data.service';
import { State } from 'src/app/model/AppData.model';
import { SecurityService } from 'src/app/core/security/security.service';
import * as moment from 'moment';
import { AppUiService } from 'src/app/core/app-ui.service';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { BrandingService } from 'src/app/core/branding.service';
import { FacilityComponent } from '../facility/facility.component';
import { AppThemeDto } from 'src/app/model/branding.model';
import { DataFilterService } from 'src/app/core/data-filter.service';
import { OrganizationType } from 'src/app/Enums/organization.enum';


@Component({
  selector: "app-organizations",
  templateUrl: "./organizations.component.html",
  styleUrls: ["./organizations.component.scss"]
})
export class OrganizationsComponent implements OnInit {
  IsLoading = false;
  @ViewChild("addFacilityModal") addFacilityModal: ModalDirective;
  @ViewChild("addOrganization") addOrganization: ModalDirective;
  @ViewChild("facilityCompRef") facilityCompRef: FacilityComponent;
  facilityDto = new FacilityDto();
  organizationDto = new OrganizationDto();
  tempOrganizationDto = new OrganizationDto();
  facilityList = new Array<FacilityDto>();
  organizationList = new Array<OrganizationDto>();
  tempOrganizationList = new Array<OrganizationDto>();
  searchParam: any;
  searchByOrgName = true;
  // searchOrganization = '';
  States = new Array<State>();
  organizationId: number;
  emrList: any;
  isEditOrganization = false;
  isEditingOrganization: boolean;
  shortNameValid = true;
  checkingShortName: boolean;
  selectedOrgId: number;
  savingTheme: boolean;
  orgTypeEnumList = this.filterDataService.getEnumAsList(OrganizationType);
  organizationTypeEnum = OrganizationType;
  orgType= [''];
  constructor(
    private facilityService: FacilityService,
    private securityService: SecurityService,
    private brandingService: BrandingService,
    private toaster: ToastService,
    private ccmDataService: CcmDataService,
    private appUi: AppUiService,
    private filterDataService: DataFilterService
  ) {}

  ngOnInit() {
    // this.organizationId = +this.securityService.getClaim('OrganizationId').claimValue;
    this.getEmrList();
    this.getStatesList();
    this.getFacilities();
    this.getOrganizations();
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
  getFacilities() {
    this.IsLoading = true;
    this.facilityService.getFacilityList().subscribe(
      (res: any) => {
        this.IsLoading = false;
        this.facilityList = res;
      },
      (error: HttpResError) => {
        this.IsLoading = true;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  checkFilter(currentValue){
    // if(currentValue == ''){
    //   this.orgType = [''];
    // }
  }
  changeOrganizationType(value){
    if (!this.orgType.length) {
      this.orgType = ['']
    }
    if(this.orgType && this.orgType.length === 1 && this.orgType.includes('')){

    }else{
      this.orgType = this.orgType.filter((x) => x !== '');
    }

    // this.orgType = value;
    this.getOrganizations();
  }
  getOrganizations() {
    this.IsLoading = true;
    this.facilityService.getorganizationList(this.orgType).subscribe(
      (res: any) => {
        this.IsLoading = false;
        this.organizationList = res;
        this.tempOrganizationList = res;
      },
      (error: HttpResError) => {
        this.IsLoading = true;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  editOrganizations(){
    this.isEditingOrganization = true;
    this.facilityService.EditOrganization(this.organizationDto).subscribe((res: any) => {
      this.toaster.success('Organization edited successfully');
      this.getOrganizations();
      this.isEditingOrganization = false;
      this.addOrganization.hide();
    }, (err: HttpResError) => {
      this.toaster.error(err.error);
      this.isEditingOrganization = false;
    })
  }
  filterOrg() {
    Object.assign(this.organizationList, this.tempOrganizationList);
    const val = this.searchParam.target?.value.toLowerCase();
    if(this.searchByOrgName && val){

      const temp = this.tempOrganizationList.filter(org => org.name.toLocaleLowerCase().indexOf(val) !== -1 || !val);
      this.organizationList = temp;
    } else if (val) {
      const newOrgList = new Array<OrganizationDto>();

      this.tempOrganizationList.forEach((orga: OrganizationDto) =>{
        const temp =  orga?.facilities.find(facility => facility.facilityName.toLocaleLowerCase().indexOf(val) !== -1 || !val);
        if (temp) {
          newOrgList.push(orga);
        }
      })
      this.organizationList = newOrgList;
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
  getStatesList() {
    this.ccmDataService.getStates().subscribe(
      (res: any) => {
        this.States = res;
      },
      (error: HttpResError) => {
        this.toaster.error(error.message, error.error || error.error);
      }
    );
  }
  registerNewFacility() {
    this.facilityService.registerFacility(this.facilityDto).subscribe(
      (res: any) => {
        this.facilityDto = new FacilityDto();
        this.addFacilityModal.hide();
        this.toaster.success("Data Saved Successfully");
        this.getFacilities();
      },
      (error: HttpResError) => {
        this.addFacilityModal.hide();
        this.toaster.error(error.message, error.error);
      }
    );
  }
  registerOrganization() {
    this.organizationDto.dateAdded = moment().format("YYYY-MM-DD");
    this.facilityService.registerOrganization(this.organizationDto).subscribe(
      (res: any) => {
        this.organizationDto = new OrganizationDto();
        this.addOrganization.hide();
        this.toaster.success("Data Saved Successfully");
        this.resetModalData();
        this.getOrganizations();
      },
      (error: HttpResError) => {
        this.addOrganization.hide();
        this.toaster.error(error.message, error.error);
      }
    );
  }
  UpdateFacility() {
    this.facilityService.editFacility(this.facilityDto).subscribe(
      (res: any) => {
        this.facilityDto = new FacilityDto();
        this.addFacilityModal.hide();
        this.toaster.success("Data Saved Successfully");
        this.getFacilities();
      },
      (error: HttpResError) => {
        this.addFacilityModal.hide();
        this.toaster.error(error.message, error.error);
      }
    );
  }
  resetFacilityDto() {
    this.facilityDto = new FacilityDto();
  }

  deleteFaclity(id: number) {
    if (confirm("Do you really want to deelete this facility")) {
      this.facilityService.removeFacility(id).subscribe(
        res => {
          this.toaster.success("Facility deleted successfully");
          this.getFacilities();
        },
        (err: HttpResError) => {
          this.toaster.error(err.message, err.error);
        }
      );
    }
  }
  assignData(item){
    this.organizationDto = new OrganizationDto();
    setTimeout(() => {
      Object.assign(this.organizationDto, item);
    }, 500);
  }
  resetModalData(){
    this.organizationDto = new OrganizationDto();
  }
  onCloseOrganizationModal(){
    setTimeout(() => {
      this.isEditOrganization=false
    }, 500);
  }
  CheckShortNameAvailable() {
    if (this.organizationDto.shortName) {
      this.checkingShortName = true;
      this.brandingService
      .CheckShortNameAvailable(this.organizationDto.shortName , this.organizationDto?.id || 0)
      .subscribe((res: any) => {
          this.checkingShortName = false;
          if (res?.available) {
            this.shortNameValid = true;
          } else {
            this.shortNameValid = false;
            this.toaster.warning('Short name taken already');
            // window.alert('Email address Already exist');
          }
        },
        () => {
          this.checkingShortName = false;

        });
    }
  }
  openDefualtConfirmModal() {
    const modalDto1 = new LazyModalDto();
    modalDto1.Title = 'Reset Defualt Theme';
    modalDto1.Text =
      'Do you want to change the color scheme to the default theme';
    modalDto1.callBack = this.callBackOrganization;
    modalDto1.rejectCallBack = this.rejectCallBackOrganization;
    // modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto1);
}
rejectCallBackOrganization = () => {
}
callBackOrganization = () => {
//  this.bhiConsentModal.show();
this.SetDefualtThemereset();
}
SetDefualtThemereset() {
  this.organizationDto.primaryColor = "#4eb048";
  this.organizationDto.secondaryColor =  "#1d3d71";
  this.organizationDto.sideNavBarColor = "#2b373d";
  this.SetOrganizationTheme();
}
  SetOrganizationTheme() {
    this.savingTheme = true;
    this.brandingService
    .SetOrganizationTheme(this.organizationDto?.id , this.organizationDto.primaryColor, this.organizationDto.secondaryColor, this.organizationDto.sideNavBarColor)
    .subscribe((res: any) => {
        this.savingTheme = false;
        this.toaster.success(`Organization theme saved successfully`);
        this.getOrganizations();
      },
      () => {
        this.savingTheme = false;

      });
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
  // };
  loadFacilities(org: OrganizationDto) {
    if (this.selectedOrgId == org.id) {
      this.selectedOrgId = null;
      this.facilityCompRef.OrganizationId = null;
    } else {
      this.selectedOrgId = org.id;
      this.facilityCompRef.OrganizationId = org.id;
    }
    this.facilityCompRef.getFacilities();
  }openConfirmationModal(value){
    if(this.organizationDto.organizationType == OrganizationType.SAAS){
      const modalDto = new LazyModalDto();
      modalDto.Title = 'White Label Confirmation';
      modalDto.Text = 'Are you sure you want to turn off white labeling? All your branding (Icons, colors, logo) will be reset to default.';
      modalDto.callBack = this.callBackBhi;
      modalDto.rejectCallBack = this.rejectCallBackBhi;
      modalDto.data = value;
      this.appUi.openLazyConfrimModal(modalDto);
    }
  }
  rejectCallBackBhi = (data) => {
    debugger
    if(this.organizationDto.organizationType == OrganizationType.SAAS){
      this.organizationDto.organizationType = data;
    }else{
      this.organizationDto.organizationType = OrganizationType.SAAS;
    }
  }
  callBackBhi = (data) => {
    debugger
    if(this.organizationDto.organizationType == OrganizationType.SAAS){
      this.organizationDto.organizationType = OrganizationType.SAAS;
    }else{
      this.organizationDto.organizationType = data;
      this.SetDefualtThemereset();
    }
  }
  checkEligibilityForConfirmation(value){
    debugger
    if(this.organizationDto.organizationType == OrganizationType.SAAS){
      this.openConfirmationModal(value)
    }
  }
}
