import { SecurityService } from 'src/app/core/security/security.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { AppAdminDto, CreateAdminDto } from 'src/app/core/administration.model';
import { AppAdminService } from 'src/app/core/administration/app-admin.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { NgForm } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { RoleDto } from 'src/app/model/roles.model';
import { RoleManagerService } from 'src/app/core/role-manager.service';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { AppUiService } from 'src/app/core/app-ui.service';
import { PatientsService } from 'src/app/core/Patient/patients.service';

@Component({
  selector: 'app-admin-users-list',
  templateUrl: './admin-users-list.component.html',
  styleUrls: ['./admin-users-list.component.scss']
})
export class AdminUsersListComponent implements OnInit {
  @ViewChild("addUsermodal") addUsermodal: ModalDirective;
  @ViewChild("f") form: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  isLoading: boolean;
  selectedRoles = new Array<string>();
  rows: any;
  appAdminDto = new AppAdminDto();
  selectedUserDto = new AppAdminDto();
  createAdminDto = new CreateAdminDto();
  appAdminList = new Array<AppAdminDto>();
  emailinvalid: boolean;
  userNameInvalid: boolean;
  checkemail = true;
  makeEmailAsUserName = false;
  temp = [];
  countriesList: any;
  rolesList = new Array<RoleDto>();
  constructor(private location: Location, private appAdminService: AppAdminService,
    private securityService: SecurityService, private rolesService: RoleManagerService,
    private toaster: ToastService, private appUi: AppUiService, private patientsService: PatientsService ) { }

  ngOnInit(): void {
    this.getAppAdminUsers();
    this.getRolesbyRoleType();
    this.GetAllCountries();
  }

  goBack() {
    this.location.back();
  }
  onActivate(event) {
    if (event.type === "click") {}
  }
  getAppAdminUsers() {
    this.isLoading = true;
    this.appAdminService.GetAppAdmins().subscribe(
      (res: any) => {
        this.isLoading = false;
        this.appAdminList = res;
        this.temp = res;
      },
      (error: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  selectedUser(row: AppAdminDto) {
  this.selectedRoles = row.roleIds;
  this.selectedUserDto = row;
  }
  AssignRolesToUsers() {
    this.isLoading = true;
    const data = {
      appUserId: this.selectedUserDto.userId,
      roleIds: this.selectedRoles
    };
    this.rolesService.assignUserRoles(data).subscribe(
      (res: any) => {
        this.isLoading = false;
        if (res) {
        }
        this.toaster.success("Data Saved Successfully");
        this.getAppAdminUsers();
      },
      err => {
        this.toaster.error(err.message, err.error || err.error);
        this.isLoading = false;
        // console.log(error);
      }
    );
  }
  addAppAdminUsers() {
    this.isLoading = true;
    this.appAdminService.CreateUser(this.createAdminDto).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.addUsermodal.hide();
        this.createAdminDto = new CreateAdminDto();
        // this.appAdminList = res;
        this.getAppAdminUsers();
      },
      (error: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  editAppAdmin() {
    this.isLoading = true;
    this.appAdminService.EditAppAdmin(this.createAdminDto).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.addUsermodal.hide();
        this.createAdminDto = new CreateAdminDto();
        // this.appAdminList = res;
        this.getAppAdminUsers();
      },
      (error: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  setAppAdminActive(row: any) {
    this.isLoading = true;
    this.appAdminService.SetAppAdminActive(row.id).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.getAppAdminUsers();
      },
      (error: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  setAppAdminInActive(row: any) {
    this.isLoading = true;
    this.appAdminService.SetAppAdminInActive(row.id).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.getAppAdminUsers();
      },
      (error: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  openConfirmModal(data: any) {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Delete User";
    modalDto.Text = "Are you sure to delete User";
    modalDto.callBack = this.callBack;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack = (data: any) => {
    this.deleteAppAdminUser(data);
  }
  deleteAppAdminUser(row: any) {
    row.isLoading = true;
    this.appAdminService.DeleteAppAdminUser(row.id).subscribe(
      (res: any) => {
        row.isLoading = false;
        this.getAppAdminUsers();
      },
      (error: HttpResError) => {
        row.isLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function(d) {
      return d.firstName.toLowerCase().indexOf(val) !== -1 || d.lastName.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.appAdminList = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  checkAvailibility(userName: string) {

    if (userName) {
        this.securityService
        .checkUserName(userName).subscribe((res: boolean) => {
          if (res) {
            this.userNameInvalid = false;
            this.checkemail = false;
          } else {
            this.userNameInvalid = true;
            this.checkemail = true;
            // window.alert("Email address Already exist");
          }
        });
    }
  }
  FillUserNameUserName(checked: boolean) {
    if (this.makeEmailAsUserName) {
      this.createAdminDto.userName = this.createAdminDto.email;
      this.checkemail = false;
    } else {
      this.createAdminDto.userName = "";
      this.checkemail = true;
    }
  }
  getRolesbyRoleType() {
    this.isLoading = true;
    this.rolesService.getRolesbyRoleType(3).subscribe(
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
  // getAllRolesList() {
  //   this.isLoading = true;
  //   this.rolesService.getAllRoles().subscribe(
  //     (res: any) => {
  //       this.isLoading = false;
  //       this.rolesList = res;
  //     },
  //     (error: HttpResError) => {
  //       this.isLoading = false;
  //       this.toaster.error(error.error, error.message);
  //     }
  //   );
  // }

 resetAdduserModal() {
  this.createAdminDto = new CreateAdminDto();
  this.form.reset();
  this.emailinvalid = false;
  this.checkemail = true;
  this.makeEmailAsUserName = false;
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
}
