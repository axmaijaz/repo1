import { Component, OnInit } from "@angular/core";
import { HttpResError } from "src/app/model/common/http-response-error";
import { ClaimsListDto } from "src/app/model/security/ClaimsList.model";
import {
  RoleDto,
  RolesDto,
  ClaimsDto,
  AssignCategoryDto,
  CategoryDto,
  ClaimScope,
} from "src/app/model/roles.model";
import { RoleManagerService } from "src/app/core/role-manager.service";
import { ToastService } from "ng-uikit-pro-standard";
import { DataFilterService } from "src/app/core/data-filter.service";

@Component({
  selector: "app-app-user-claims",
  templateUrl: "./app-user-claims.component.html",
  styleUrls: ["./app-user-claims.component.scss"],
})
export class AppUserClaimsComponent implements OnInit {
  // isLoading: boolean;
  isLoading = false;
  selectedRoleId = 0;
  isSelectionModeOn = false;
  claimsListDto = new ClaimsListDto();
  rolesList = new Array<RolesDto>();
  claimsList = new Array<ClaimsDto>();
  addEditClaimDto = new ClaimsDto();
  selectedClaims = new Array<number>();
  ClaimScopeEnumList = this.filterDataService.getEnumAsList(ClaimScope);
  newRoleName = "";
  userRoleId = 0;
  assignCategoryDto = new AssignCategoryDto();
  byUserRoleList = new Array<RoleDto>();
  categoryListDto = new Array<CategoryDto>();
  categoryDto = new CategoryDto();
  isRoleTypeLoading: boolean;
  isRoleListLoading: boolean;
  CategoryName: any;
  activeselect: boolean;

  constructor(
    private rolesService: RoleManagerService,
    private toaster: ToastService,
    private filterDataService: DataFilterService
  ) {}
  public scrollbarOptions = {
    axis: "y",
    theme: "minimal-dark",
    scrollbarPosition: "inside",
    scrollInertia: 0,
  };
  ngOnInit(): void {
    this.getClaimsLookUp();
    this.getCategoriesList();
    this.getAllRolesList();
  }

  getAllRolesList() {
    this.isRoleListLoading = true;
    this.rolesService.getRoleTypes().subscribe(
      (res: any) => {
        this.isRoleListLoading = false;
        this.rolesList = res;
      },
      (error: HttpResError) => {
        this.isRoleListLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  getRolesbyRoleType() {
    this.isRoleTypeLoading = true;
    if (!this.selectedRoleId) {
      this.selectedRoleId = 0;
    }
    this.rolesService.getRolesbyRoleType(this.selectedRoleId).subscribe(
      (res: any) => {
        this.isRoleTypeLoading = false;
        this.byUserRoleList = res;
      },
      (error: HttpResError) => {
        this.isRoleTypeLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  addClaim() {
    this.isLoading = true;
    if (!this.addEditClaimDto.claimScope) {
      this.addEditClaimDto.claimScope = 0;
    }
    this.rolesService.AddClaim(this.addEditClaimDto).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.addEditClaimDto = new ClaimsDto();
        // this.byUserRoleList = res;
        this.getClaimsLookUp();
      },
      (error: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  // valuesAssign() {
  //   this.categoryDto.id = this.addEditClaimDto.claimCategoryId;
  //   this.categoryDto.name = this.addEditClaimDto.claimCategory;
  // }
  editClaim() {
    this.isLoading = true;
    // this.addEditClaimDto.claimCategoryId = this.categoryDto.id;
    // this.addEditClaimDto.claimCategory = this.categoryDto.name;
    if (!this.addEditClaimDto.claimScope) {
      this.addEditClaimDto.claimScope = 0;
    }
    this.rolesService.editClaim(this.addEditClaimDto).subscribe(
      (res: any) => {
        this.addEditClaimDto = new ClaimsDto();
        this.isLoading = false;
        // this.byUserRoleList = res;
        this.getClaimsLookUp();
      },
      (error: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  resetClaimDto() {
    // this.categoryDto = new CategoryDto();
    this.addEditClaimDto = new ClaimsDto();
    this.assignCategoryDto = new AssignCategoryDto();
  }
  getClaimsLookUp() {
    this.isLoading = true;
    if (!this.selectedRoleId) {
      this.selectedRoleId = 0;
    }
    this.rolesService.getClaims(this.selectedRoleId).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.claimsList = res;
      },
      (error: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  getCategoriesList() {
    // this.isLoading = true;
    this.rolesService.ClaimCategories().subscribe(
      (res: any) => {
        // this.isLoading = false;
        this.categoryListDto = res;
      },
      (error: HttpResError) => {
        // this.isLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }

  //   getRolesList() {
  //   this.rolesService.getClaimsByRoles(this.selectedRoleId).subscribe(
  //     (res: [{ claimType: string; claimValue: string }]) => {
  //       this.isLoading = false;
  //       res.forEach(value => {
  //         Object.keys(this.claimsListDto).forEach((key, index, obj) => {
  //           if (key === value.claimType) {
  //             this.claimsListDto[key] = true;
  //           }
  //         });
  //       });
  //     },
  //     (error: HttpResError) => {
  //       this.isLoading = false;
  //       this.toaster.error(error.error, error.message);
  //     }
  //   );
  // }

  getCalimsOnSelectRole() {
    if (this.userRoleId) {
      this.isLoading = true;
      this.resetClaimsList();
      this.rolesService.getClaimsByRoles(this.userRoleId).subscribe(
        (res: [{ claimType: string; claimValue: string }]) => {
          this.isLoading = false;
          res.forEach((value) => {
            this.claimsList.forEach((data: ClaimsDto) => {
              if (data.claimType === value.claimType) {
                data.isChecked = true;
              }
            });
          });
        },
        (error: HttpResError) => {
          this.isLoading = false;
          this.toaster.error(error.error, error.message);
        }
      );
    }
  }
  resetClaimsList() {
    this.claimsList.forEach((data: ClaimsDto) => {
      data.isChecked = false;
    });
  }
  addClaimsToCategory() {
    this.rolesService.AddClaimsToCategory(this.assignCategoryDto).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.getClaimsLookUp();
        // res.forEach(value => {
        //   Object.keys(this.claimsListDto).forEach((key, index, obj) => {
        //     if (key === value.claimType) {
        //       this.claimsListDto[key] = true;
        //     }
        //   });
        // });
      },
      (error: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }

  addNewRole() {
    this.isLoading = true;
    this.rolesService.addNewRole(this.newRoleName).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.newRoleName = "";
        this.toaster.success("Role Added Successfully");
        this.getAllRolesList();
      },
      (error: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  addNewCategory() {
    this.isLoading = true;
    const dto = {
      id: 0,
      name: this.CategoryName,
    };
    this.rolesService.addNewCategory(dto).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.CategoryName = "";
        this.toaster.success("Category Added Successfully");
        this.getCategoriesList();
      },
      (error: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  editRolePermissions() {
    this.isLoading = true;
    const data = {
      roleId: this.userRoleId,
      claims: new Array<string>(),
    };
    const tempArr = new Array<string>();
    this.claimsList.forEach((data: ClaimsDto) => {
      if (data.isChecked === true) {
        tempArr.push(data.claimType);
      }
    });
    data.claims = tempArr;
    this.rolesService.addRoleClaims(data).subscribe(
      (res: any) => {
        this.isLoading = false;
        // this.claimsListDto = new ClaimsListDto();
        this.toaster.success("Permissions saved successfully");
      },
      (error: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  MarkPtientPermissions(checked, data: Array<ClaimsDto>) {
    data.forEach((el: ClaimsDto) => {
      el.isChecked = checked;
    });
  }

  resetFields() {
    this.userRoleId = 0;
  }
  getRolesByClaimType(claim: ClaimsDto) {
    this.byUserRoleList.forEach(x => {
      x.isActive = false;
    })
    this.rolesService.GetRolesByClaimType(claim.claimType).subscribe((res: string[]) => {
      res.forEach(element => {
      const hd =  this.byUserRoleList.find(role => role.id == element)
      if (hd) {
        
        hd.isActive = true;
        this.activeselect =  hd.isActive
      }
      });
      this.byUserRoleList.sort((x, y) => {
        return (x.isActive === y.isActive)? 0 : x.isActive? -1 : 1;
      });
    }, (err: HttpResError) =>{
      this.toaster.error(err.error);
    })
  }
  checkUserRolesListCount(event){
    console.log(event)
    console.log(this.isSelectionModeOn)
    if(this.isSelectionModeOn){
      if(!this.byUserRoleList || this.byUserRoleList.length == 0){
        event.target.checked = false;
        this.isSelectionModeOn = false;
        this.toaster.warning('Role must be selected');
      }
    }
  }
}
