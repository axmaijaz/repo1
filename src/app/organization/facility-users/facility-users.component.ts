import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { ModalDirective, ToastService } from "ng-uikit-pro-standard";
import { FacilityService } from "src/app/core/facility/facility.service";
import {
  CreateFacilityUserDto,
  FacilityDto,
  SendPhoneNoVerificationDto,
  VerifyPhoneNumberDto,
  TansferAndDeleteFacilityUserDto,
  UserInActiveDto,
} from "src/app/model/Facility/facility.model";
import { SecurityService } from "src/app/core/security/security.service";
import { UserType } from "src/app/Enums/UserType.enum";
import { HttpResError } from "src/app/model/common/http-response-error";
import { RoleManagerService } from "src/app/core/role-manager.service";
import { RoleDto } from "src/app/model/roles.model";
import {
  EmitEvent,
  EventTypes,
  EventBusService,
} from "src/app/core/event-bus.service";
import { ChatGroupDto } from "src/app/model/chat/chat.model";
import { TwocChatService } from "src/app/core/2c-chat.service";
import { Location } from "@angular/common";
import { AppUiService } from "src/app/core/app-ui.service";
import { LazyModalDto } from "src/app/model/AppModels/app.model";
import { Form, NgForm } from "@angular/forms";
import { PatientsService } from "src/app/core/Patient/patients.service";
// import { from } from 'rxjs';

@Component({
  selector: "app-facility-users",
  templateUrl: "./facility-users.component.html",
  styleUrls: ["./facility-users.component.scss"],
})
export class FacilitUsersComponent implements OnInit, AfterViewInit {
  model: any = {};
  facilityId = 0;
  selectedFacilityUser = 0;
  selectedFacilityUserObj = new CreateFacilityUserDto();
  selectedFacilities = new Array<number>();
  selectedRoles = new Array<string>();
  facilityUser = new CreateFacilityUserDto();
  facilityList = new Array<FacilityDto>();
  rolesList = new Array<RoleDto>();
  isLoading = false;
  sendPhoneNoVerifictionDto = new SendPhoneNoVerificationDto();
  verifyPhoneNoDto = new VerifyPhoneNumberDto();
  editfacilityUserId: number;
  verificationUserName = "";
  isEditingfacilityUser = false;
  rows = [];
  facilityUsersList = [];
  flteredFacilityUsersList = [];
  temp = [];
  isShownDeletedUsers = false;
  emailinvalid: boolean;
  roleIds = new Array<string>();


  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("searchFacility") searchfacilityUser: ElementRef;
  @ViewChild("f") form: NgForm;
  @ViewChild("addFacility") EditfacilityUserModal: ModalDirective;
  @ViewChild("transferAndDleteModal") transferAndDleteModal: ModalDirective;
  @ViewChild("assignFacilitiesMOdal") assignFacilitiesMOdal: ModalDirective;
  @ViewChild("verificationModal") verificationModal: ModalDirective;
  organizationId = 0;
  userInActiveDto = new UserInActiveDto();
  gettingChatGroup: boolean;
  transferAndDeleteFacilityUserDto = new TansferAndDeleteFacilityUserDto();
  isMatchRoles: any;
  tempUserList: any[];
  transferingUser: boolean;
  search: any;
  countriesList: any;
  selectedUserCountryCallingCode: any;
  isChangingUserState: boolean;
  showInActiveUsers: any;
  isConfigRoute: boolean;
  subVendorNotInList = false;
  isFacilitySubVendor = false;

  constructor(
    private router: Router,
    private rolesService: RoleManagerService,
    private twocChatService: TwocChatService,
    private eventBus: EventBusService,
    private route: ActivatedRoute,
    private facilityService: FacilityService,
    private toaster: ToastService,
    private location: Location,
    public securityService: SecurityService,
    private appUi: AppUiService,
    private patientService: PatientsService
  ) {}

  private cellOverflowVisible() {
    const cells = document.getElementsByClassName(
      "datatable-body-cell overflow-visible"
    );
    for (let i = 0, len = cells.length; i < len; i++) {
      cells[i].setAttribute("style", "overflow: visible !important");
    }
  }

  ngAfterViewInit() {
    // this.searchfacilityUser.nativeElement.focus();
    // const rightRowCells = document.getElementsByClassName(
    //   'datatable-row-right'
    // );
    // rightRowCells[0].setAttribute(
    //   'style',
    //   'transform: translate3d(-17px, 0px, 0px)'
    // );
  }

  ngOnInit() {
    this.isFacilitySubVendor = this.facilityService.isFacilitySubVendor;
    if (
      this.securityService.securityObject.userType === UserType.FacilityUser
    ) {
      this.facilityId = +this.securityService.getClaim("FacilityId").claimValue;
    }
    if (
      this.securityService.securityObject.userType === UserType.FacilityUser
    ) {
      this.organizationId =
        +this.securityService.getClaim("OrganizationId").claimValue;
    }
    const paramFacilityId = +this.route.snapshot.paramMap.get("facilityId");
    const paramOrgId = +this.route.snapshot.paramMap.get("OrgId");
    this.route.pathFromRoot.forEach(x => {
      if(!this.isConfigRoute) {
        this.isConfigRoute = x.snapshot.data['isConfigRoute']
      }
    });
    if (paramFacilityId) {
      this.facilityId = paramFacilityId;
    }
    if (paramOrgId) {
      this.organizationId = paramOrgId;
    }
    if (this.organizationId) {
      this.getFacilitiesbyOrgId();
    }
    if (this.facilityId) {
      this.loadFacilityUsers();
    }
    this.getRolesbyRoleType();
    this.GetAllCountries();
  }
  loadFacilityUsers() {
    // for show only recover Action in Table
    this.isShownDeletedUsers = false;
    this.checkArray();
    this.isLoading = true;
    this.facilityService.getFacilityUserList(this.facilityId, this.showInActiveUsers).subscribe(
      (res: any) => {
        this.isLoading = false;
        if (res) {
          // res = res.filter((user) => user.isDisabled == false);
          this.facilityUsersList = res;
          this.rows = res;
          this.temp = res;
          if (this.search) {
            this.updateFilter(this.search);
          }
        }
        const subVendorsList = this.rows.filter((user)=> user.isSubVendorUser == true )
        if(!subVendorsList.length){
          this.subVendorNotInList = true;
        }else{
          this.subVendorNotInList = false;
        }
      },
      (error) => {
        this.toaster.error(error.message, error.error || error.error);
        this.isLoading = false;
        // console.log(error);
      }
    );
  }
  assignValues(row: any) {
    this.tempUserList = [];
    this.roleIds = row.roleIds;
    this.transferAndDeleteFacilityUserDto =
      new TansferAndDeleteFacilityUserDto();
    this.flteredFacilityUsersList = [];
    this.transferAndDeleteFacilityUserDto.id = row.id;
    this.transferAndDleteModal.show();
    this.flteredFacilityUsersList = this.facilityUsersList.filter(
      (user) => user.id !== row.id
    );
    this.flteredFacilityUsersList.forEach((fu) => {
      this.isMatchRoles = row.roleIds.every(function (val) {
        return fu.roleIds.indexOf(val) >= 0;
      });
      if (this.isMatchRoles) {
        this.tempUserList.push(fu);
      }
    });
    this.flteredFacilityUsersList = this.tempUserList;
  }

  checkArray() {
    this.selectedFacilityUserObj;
    // let targetArray = [1,3,2];
    // let array1 = [1,2,3]; //return true
    // let array2 = [1,2,3,4]; //return true
    // let array3 = [1,2] //return false

    // console.log(targetArray.every(function(val) { return array1.indexOf(val) >= 0; })); //true
    // console.log(targetArray.every(function(val) { return array2.indexOf(val) >= 0; })); // true
    // console.log(targetArray.every(function(val) { return array3.indexOf(val) >= 0; }));// false
  }
  GetAllCountries() {
    this.patientService.GetAllCountries().subscribe(
      (res: any) => {
        this.countriesList = res;
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
      }
    );
  }

  changeFacilityUser() {
    this.transferingUser = true;
    this.facilityService
      .changeFacilityUser(this.transferAndDeleteFacilityUserDto)
      .subscribe(
        (res: any) => {
          this.transferingUser = false;
          this.transferAndDleteModal.hide();
          this.transferAndDeleteFacilityUserDto =
            new TansferAndDeleteFacilityUserDto();
          this.loadFacilityUsers();
          this.toaster.success("User deleted successfully");
        },
        (error) => {
          this.toaster.error(error.error, error.message);
          this.transferingUser = false;
          // console.log(error);
        }
      );
  }
  getDeletedFacilityUsers() {
    this.rows = [];
    this.temp = [];
    this.isLoading = true;
    this.facilityService.getDeletedFacilityUsers().subscribe(
      (res: any) => {
        this.isLoading = false;
        if (res) {
          this.rows = res;
          this.temp = res;
        }
      },
      (error) => {
        // this.isShownDeletedUsers = false;
        this.toaster.error(error.error, error.message);
        this.isLoading = false;
        // console.log(error);
      }
    );
  }
  showUsersList() {
    if (this.isShownDeletedUsers) {
      this.getDeletedFacilityUsers();
    } else {
      this.loadFacilityUsers();
    }
  }
  openConfirmModalForRecoverUser(data: any) {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Recover Facility User";
    modalDto.Text = "Are you really sure to Recover this Facility User";
    modalDto.callBack = this.callBack;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack = (data: any) => {
    this.recoverFacilityUser(data);
  };
  recoverFacilityUser(id: number) {
    this.isLoading = true;
    this.facilityService.recoverFacilityUser(id).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.getDeletedFacilityUsers();
      },
      (error) => {
        this.toaster.error(error.error, error.message);
        this.isLoading = false;
        // console.log(error);
      }
    );
  }

  getRolesbyRoleType() {
    this.isLoading = true;
    this.rolesService.getRolesbyRoleType(UserType.FacilityUser).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.rolesList = res;
      },
      (error: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  FillUserNameUserName(isSameCurrentAddress: boolean) {
    if (isSameCurrentAddress) {
      this.facilityUser.userName = this.facilityUser.email;
    } else {
      this.facilityUser.userName = "";
    }
  }
  getFacilitiesbyOrgId() {
    this.isLoading = true;
    this.facilityService.getFacilityByOrgId(this.organizationId).subscribe(
      (res: any) => {
        this.isLoading = false;
        if (res) {
          this.facilityList = res;
        }
      },
      (error) => {
        this.toaster.error(error.message, error.error || error.error);
        this.isLoading = false;
        // console.log(error);
      }
    );
  }
  getFacilitiesbyUserId() {
    this.selectedFacilities = new Array<number>();
    this.isLoading = true;
    this.facilityService
      .getFaciliesByUserId(this.selectedFacilityUser)
      .subscribe(
        (res: any) => {
          const filterdArray = Array<number>();
          this.isLoading = false;
          res.forEach((data) => {
            this.facilityList.filter((fil) => {
              if (data === fil.id) {
                filterdArray.push(data);
              }
            });
          });
          if (filterdArray) {
            this.selectedFacilities = filterdArray;
          }
        },
        (error) => {
          this.toaster.error(error.message, error.error || error.error);
          this.isLoading = false;
          // console.log(error);
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
  onActivate(event) {
    if (event.type === "click") {
      // id: number = +event.row.id;
      // this.router.navigate(['/admin/patient/', event.row.id]);
    }
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.search = event;
    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.firstName.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  editfacilityUser(row: CreateFacilityUserDto) {
    this.editfacilityUserId = +row.id;
    Object.assign(this.facilityUser, row);
    this.EditfacilityUserModal.show();
  }

  addUpdateFacility() {
    this.facilityUser.facilityId = this.facilityId;
    if (!this.isEditingfacilityUser) {
      let isLocumCareProvider = false;
      if (this.securityService.hasClaim("isLocumCareProvider")) {
        isLocumCareProvider = true;
      }
      this.facilityService.addFacilityUSer(this.facilityUser, false).subscribe(
        (res: any) => {
          this.toaster.success("Facility User Created Successfully");
          this.isLoading = false;
          this.facilityUser = new CreateFacilityUserDto();
          this.EditfacilityUserModal.hide();
          this.loadFacilityUsers();
        },
        (error: HttpResError) => {
          this.isLoading = false;
          this.toaster.error(error.error, error.message);
        }
      );
    } else {
      this.facilityService.editFacilityUSer(this.facilityUser).subscribe(
        (res: any) => {
          this.toaster.success("Facility User Updated Successfully");
          this.isLoading = false;
          this.facilityUser = new CreateFacilityUserDto();
          this.EditfacilityUserModal.hide();
          this.loadFacilityUsers();
        },
        (error: HttpResError) => {
          this.isLoading = false;
          this.toaster.error(error.error, error.message);
        }
      );
    }
  }
  AssignFacilitiesToUsers() {
    this.isLoading = true;
    const data = {
      facilityUserId: this.selectedFacilityUser,
      facilityIds: this.selectedFacilities,
    };
    this.facilityService.AssignFacilitiesToUsers(data).subscribe(
      (res: any) => {
        this.isLoading = false;
        if (res) {
        }
        this.toaster.success("Data Saved Successfully");
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
        this.loadFacilityUsers();
      },
      (error) => {
        this.toaster.error(error.message, error.error || error.error);
        this.isLoading = false;
        // console.log(error);
      }
    );
  }
  getChatGroup() {
    // this.isLoading = true;
    // this.twocChatService
    //   .GetPersonalChatGroup(
    //     this.securityService.securityObject.appUserId,
    //     this.selectedFacilityUserObj.userId
    //   )
    //   .subscribe(
    //     (res: ChatGroupDto) => {
    //       this.isLoading = false;
    //       // this.router.navigateByUrl(`/chat/messages?channel=${res.channelName}`);
    //       const event = new EmitEvent();
    //       event.name = EventTypes.OpenCommunicationModal;
    //       event.value = res;
    //       this.eventBus.emit(event);
    //     },
    //     (err: HttpResError) => {
    //       this.isLoading = false;
    //       this.toaster.error(err.message, err.error || err.error);
    //     }
    //   );
  }
  disableFacilityUser(row: any) {
    this.isLoading = true;

    this.facilityService.archiveFacilityUser(row.id).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.loadFacilityUsers();
        this.toaster.success("Facility User deleted successfully");
      },
      (error) => {
        this.isLoading = false;
        this.toaster.error(error.message, error.error || error.error);
      }
    );
  }
  openConfirmModal(data: any) {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Delete Facility User";
    modalDto.Text = "Are you really sure to delete Facility User";
    modalDto.callBack = this.callBack2;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack2 = (data: any) => {
    this.disableFacilityUser(data);
  };
  sendPhoneNoVerificationToken(row: any) {
    this.isLoading = true;
    this.verificationUserName = row.firstName + " " + row.lastName;
    this.sendPhoneNoVerifictionDto.phoneNumber = row.phoneNo;
    this.sendPhoneNoVerifictionDto.userName = row.userName;
    this.sendPhoneNoVerifictionDto.countryCallingCode = row.countryCallingCode;
    this.selectedUserCountryCallingCode = row.countryCallingCode;
    if (!this.sendPhoneNoVerifictionDto.countryCallingCode) {
      this.toaster.warning("Facility user country calling code not selected");
      this.isLoading = false;
    } else {
      this.verificationModal.show();
      this.securityService
        .SendPhoneNoVerificationToken(this.sendPhoneNoVerifictionDto)
        .subscribe(
          (res: any) => {
            this.isLoading = false;
            this.loadFacilityUsers();
            // this.toaster.success("Facility User deleted successfully");
          },
          (err) => {
            this.isLoading = false;
            this.toaster.error(err.error);
          }
        );
    }
  }
  verifyPhoneNumber() {
    this.verifyPhoneNoDto.userName = this.sendPhoneNoVerifictionDto.userName;
    this.securityService.VerifyPhoneNumber(this.verifyPhoneNoDto).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.verificationModal.hide();
        this.loadFacilityUsers();
        this.toaster.success("Phone No Verified successfully");
        this.sendPhoneNoVerifictionDto = new SendPhoneNoVerificationDto();
        this.verifyPhoneNoDto = new VerifyPhoneNumberDto();
      },
      (err) => {
        this.isLoading = false;
        this.toaster.error(err.error);
      }
    );
  }
  sendVerifyEmail(row) {
    const userName = row.userName;
    const email = row.email;
    this.isLoading = false;
    this.securityService.sendVerifyEmail(userName, email).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.toaster.success("Verification email sent !");
      },
      (err) => {
        this.isLoading = false;
        this.toaster.error(err.error);
      }
    );
  }
  checkAvailibility(email: string) {
    if (this.form.controls.email.valid) {
      if (email) {
        this.securityService.checkUserName(email).subscribe((res: boolean) => {
          if (res) {
            this.emailinvalid = false;
          } else {
            this.emailinvalid = true;
            // window.alert("Email address Already exist");
          }
        });
      }
    }
  }
  goBack() {
    this.location.back();
  }
  resetFacilityUser() {
    // email.nativeElement.reset();
    this.facilityUser = new CreateFacilityUserDto();
    // this.model.controls.reset();
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
        } else {
          // this.showInActiveFacilityUsers();
        }
        this.loadFacilityUsers();
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
  markFacilityUserAsSubVendor(user, isTrue){
    const isSubVendor = isTrue;
    this.facilityService.MarkFacilityUserAsSubVendor(user.id, isSubVendor).subscribe((res: any) => {
      if(isTrue){
        this.toaster.success('SubVendor Marked Successfully.');
      }else{
        this.toaster.success('SubVendor Unmarked Successfully.');
      }
      this.loadFacilityUsers();
    }, (err: HttpResError) => {
      this.toaster.error(err.error)
    })
  }
}
