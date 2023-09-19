import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
} from "@angular/core";
import { IDatePickerConfig, ECalendarValue } from "ng2-date-picker";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { NewUser } from "src/app/model/AppModels/userManger.model";
import { ModalDirective, ToastService } from "ng-uikit-pro-standard";
import { UserManagerService } from "src/app/core/UserManager/user-manager.service";
import { PatientsService } from "src/app/core/Patient/patients.service";
import {
  PatientDto,
  AssignPatientsToCareProvider,
} from "src/app/model/Patient/patient.model";
import { NgxSpinnerService } from "ngx-spinner";
import { FacilityService } from "src/app/core/facility/facility.service";
import {
  CreateFacilityUserDto,
  FacilityDto,
  UserInActiveDto,
} from "src/app/model/Facility/facility.model";
import { AppUserAuth } from "src/app/model/security/app-user.auth";
import { SecurityService } from "src/app/core/security/security.service";
import { UserType } from "src/app/Enums/UserType.enum";
import { HttpResError } from "src/app/model/common/http-response-error";
import { SubSink } from "src/app/SubSink";
import { RoleDto } from "src/app/model/roles.model";
import { RoleManagerService } from "src/app/core/role-manager.service";

@Component({
  selector: "app-user-manager",
  templateUrl: "./user-manager.component.html",
  styleUrls: ["./user-manager.component.scss"],
})
export class UserManagerComponent implements OnInit, OnDestroy, AfterViewInit {
  private subs = new SubSink();
  model: any = {};
  spinnerOne = "one";
  facilityId = 0;
  @ViewChild("addUser") addUserModal: ModalDirective;
  public DisplayDate;
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "YYYY-MM-DD",
  };
  @ViewChild("assignFacilitiesMOdal") assignFacilitiesMOdal: ModalDirective;

  userInActiveDto = new UserInActiveDto();
  selectedDate = new Date();
  rolesList = new Array<RoleDto>();
  IsLoading = false;
  currentUser: AppUserAuth = null;
  facilityList = new Array<FacilityDto>();
  userList = new Array<CreateFacilityUserDto>();
  countriesList: any;
  newUser = new CreateFacilityUserDto();
  patientsList = new Array<PatientDto>();
  selectedFacilityUser = 0;
  selectedFacilityUserObj = new CreateFacilityUserDto();
  selectedFacilities = new Array<number>();
  facilityUser = new CreateFacilityUserDto();
  AssignPatientsToCareProviderDto = new AssignPatientsToCareProvider();
  emailinvalid: boolean;
  showInActiveUsers = false;
  OrganizationId: number;
  test: any;
  isLoading: boolean;
  temp = new Array<CreateFacilityUserDto>();
  gettingFacilities: boolean;
  isUpdatingFacilityUser: boolean;
  isChangingUserState: boolean;
  selectedRoles = new Array<string>();
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private securityService: SecurityService,
    private rolesService: RoleManagerService,
    private facilityService: FacilityService,
    private toaster: ToastService,
    private userManagerService: UserManagerService,
    private patientsService: PatientsService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.facilityId = +this.securityService.getClaim("FacilityId").claimValue;
    this.OrganizationId =
      +this.securityService.getClaim("OrganizationId").claimValue;
    this.getGetCareProviders();
    // this.getPatientsList();
    if (
      this.securityService.securityObject &&
      this.securityService.securityObject.isAuthenticated
    ) {
      this.currentUser = this.securityService.securityObject;
    }
    if (this.currentUser.userType === UserType.AppAdmin) {
      // this.getFacilityList();
      this.getFacilitiesbyOrgId();
    }
    this.getAllRolesList();
    this.GetAllCountries();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.assignFacilitiesMOdal.hide();
    }, 5000);
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.firstName.toLowerCase().indexOf(val) !== -1 || d.lastName.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.userList = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }
  getAllRolesList() {
    this.subs.sink = this.rolesService.getRolesbyRoleType(UserType.FacilityUser).subscribe(
      (res: any) => {
        this.rolesList = res;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  getRolesByUserId() {
    this.isLoading = true;
    this.selectedRoles = [];
    this.rolesService
      .getRolesByAppUserId(this.selectedFacilityUserObj.userId)
      .subscribe(
        (res: string[]) => {
          this.isLoading = false;
          if (res && res.length) {
            // this.selectedRoles = res;
            if (this.rolesList && this.rolesList.length) {
              this.selectedRoles = this.rolesList
                .filter(function (e) {
                  return res.indexOf(e.name) > -1;
                })
                .map((data) => data.id.toString());
            }
          }
        },
        (error) => {
          this.toaster.error(error.message, error.error || error.error);
          this.isLoading = false;
          // console.log(error);
        }
      );
  }

  AssignRolesToUsers() {
    this.isLoading = true;
    const data = {
      appUserId: this.selectedFacilityUserObj.userId,
      roleIds: this.selectedRoles,
    };
    this.rolesService.assignUserRoles(data).subscribe(
      (res: any) => {
        this.isLoading = false;
        if (res) {
        }
        this.toaster.success("Data Saved Successfully");
        this.getGetCareProviders();
      },
      (error) => {
        this.toaster.error(error.message, error.error || error.error);
        this.isLoading = false;
        // console.log(error);
      }
    );
  }

  getFacilityList() {
    this.subs.sink = this.facilityService.getFacilityList().subscribe(
      (res: any) => {
        this.facilityList = res;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  getPatientsList() {
    this.subs.sink = this.patientsService
      .getPatientsList(this.facilityId)
      .subscribe(
        (res: any) => {
          if (res) {
            this.patientsList = res;
          }
        },
        (error) => {}
      );
  }
  getGetCareProviders() {
    this.IsLoading = true;
    this.subs.sink = this.facilityService
      .getFacilityUserList(this.facilityId, this.showInActiveUsers)
      .subscribe(
        (res: any) => {
          if (res) {
            // this.userList = res.filter((user) => user.isDisabled == false);
            // this.temp = res.filter((user) => user.isDisabled == false);
            this.userList = res;
            this.temp = res;
          }
          this.IsLoading = false;
        },
        (error) => {
          this.IsLoading = false;
        }
      );
  }
  adduser() {
    this.addUserModal.hide();
    this.newUser.facilityId = this.facilityId;
    const temp = new CreateFacilityUserDto();
    for (const user in this.newUser) {
      if (this.newUser[user] === null || this.newUser[user] === undefined) {
        this.newUser[user] = temp[user];
      }
    }
    this.subs.sink = this.facilityService
      .addFacilityUSer(this.newUser, true)
      .subscribe(
        (res: any) => {
          if (res) {
            this.toaster.success("Care Provider Created Successfully");
            this.newUser = new CreateFacilityUserDto();
            this.getGetCareProviders();
          }
        },
        (err) => {
          this.toaster.error(err.message, err.error || err.error);
          this.addUserModal.hide();
        }
      );
  }
  openAssignPatientsModal(item: NewUser) {
    this.spinner.show("one");
    this.AssignPatientsToCareProviderDto = new AssignPatientsToCareProvider();
    this.AssignPatientsToCareProviderDto.careProviderIds.push(item.id);
    this.getPatientIds(item.id);
  }
  AssignPatients() {
    this.subs.sink = this.userManagerService
      .AssignPatientsToCareProvider(this.AssignPatientsToCareProviderDto)
      .subscribe(
        (res: any) => {
          this.AssignPatientsToCareProviderDto =
            new AssignPatientsToCareProvider();
          this.toaster.success("Data Saved Successfully");
        },
        (err) => {
          this.toaster.error(err.message, err.error || err.error);
          this.addUserModal.hide();
        }
      );
  }
  FillUserNameUserName(isSameCurrentAddress: boolean) {
    if (isSameCurrentAddress) {
      this.newUser.userName = this.newUser.email;
    } else {
      this.newUser.userName = "";
    }
  }
  getFacilitiesbyUserId() {
    this.gettingFacilities = true;
    this.selectedFacilities = [];
    this.subs.sink = this.facilityService
      .getFaciliesByUserId(this.selectedFacilityUser)
      .subscribe(
        (res: any) => {
          this.gettingFacilities = false;
          if (res) {
          }
          this.selectedFacilities = res || [];
        },
        (err) => {
          this.toaster.error(err.message, err.error || err.error);
          this.gettingFacilities = false;
        }
      );
  }
  AssignFacilitiesToUsers() {
    this.IsLoading = true;
    const data = {
      facilityUserId: this.selectedFacilityUser,
      facilityIds: this.selectedFacilities,
    };
    this.subs.sink = this.facilityService
      .AssignFacilitiesToUsers(data)
      .subscribe(
        (res: any) => {
          this.IsLoading = false;
          if (res) {
          }
          this.toaster.success("Data Saved Successfully");
        },
        (err) => {
          this.toaster.error(err.message, err.error || err.error);
          this.IsLoading = false;
        }
      );
  }
  getFacilitiesbyOrgId() {
    this.IsLoading = true;
    this.subs.sink = this.facilityService
      .getFacilityByOrgId(this.OrganizationId, null, true)
      .subscribe(
        (res: any) => {
          this.IsLoading = false;
          if (res) {
            this.facilityList = res;
          }
        },
        (err) => {
          this.toaster.error(err.message, err.error || err.error);
          this.IsLoading = false;
        }
      );
  }
  getPatientIds(careProviderID: number) {
    this.subs.sink = this.userManagerService
      .getPatientSByCareProviderID(careProviderID)
      .subscribe(
        (res: any) => {
          this.AssignPatientsToCareProviderDto.patientIds = res;
          // this.toaster.success('Data Saved Successfully');
        },
        (err) => {
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }
  // showSpinner() {
  //   this.spinner.show("one", { fullScreen: false });
  // }
  facilityChanged(facilityId: any) {
    if (facilityId) {
      this.facilityId = facilityId;
      this.getPatientsList();
    } else {
      this.facilityId = 0;
      this.getPatientsList();
    }
  }
  checkAvailibility(email: string) {
    if (email) {
      this.subs.sink = this.securityService
        .checkUserName(email)
        .subscribe((res: boolean) => {
          if (res) {
            this.emailinvalid = false;
          } else {
            this.emailinvalid = true;
            // window.alert("Email address Already exist");
          }
        });
    }
  }
  ClearAssignFacilities() {
    setTimeout(() => {
      this.selectedFacilities = [];
    }, 2000);
  }
  EnableFacilityUser(row: any) {
    this.isLoading = true;
    this.facilityService.EnableFacilityUser(row.id).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.getGetCareProviders();
      },
      (error: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  DisableFacilityUser(row: any) {
    this.isLoading = true;
    this.facilityService.DisableFacilityUser(row.id).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.getGetCareProviders();
      },
      (error: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetAllCountries() {
    this.patientsService.GetAllCountries().subscribe(
      (res: any) => {
        this.countriesList = res;
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
      }
    );
  }
  editFacilityOpenModal(row: CreateFacilityUserDto) {
    Object.assign(this.facilityUser, row)
  }

  editFacilityUser(modal: ModalDirective) {
    this.isUpdatingFacilityUser = true;
    this.facilityService.editFacilityUSer(this.facilityUser).subscribe(
      (res: any) => {
        this.toaster.success("Facility User Updated Successfully");
        this.isUpdatingFacilityUser = false;
        modal.hide();
        this.facilityUser = new CreateFacilityUserDto();
        this.getGetCareProviders();
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
        this.isUpdatingFacilityUser = false;
      }
    );
  }
  setFacilityUserActive(facilityUser) {
    this.isChangingUserState = true;
    if (facilityUser.isDisabled) {
      this.userInActiveDto.userId = facilityUser.userId;
      this.userInActiveDto.inActive = false;
    } else {
      this.userInActiveDto.userId = facilityUser.userId;
      this.userInActiveDto.inActive = true;
    }
    this.facilityService.MakeUserInActive(this.userInActiveDto).subscribe(
      (res: any) => {
        this.isChangingUserState = false;
        if (!facilityUser.isDisabled) {
          this.toaster.warning(
            "You can reactivate user in InActive users list",
            "Facility user disabled"
          );
        }else{
          // this.showInActiveFacilityUsers()
        }
        this.getGetCareProviders();
        this.userInActiveDto = new UserInActiveDto();
        // if (this.showInActiveUsers) {
        //   this.showInActiveUsers = false;
        // }
      },
      (error: HttpResError) => {
        this.isChangingUserState = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
}
