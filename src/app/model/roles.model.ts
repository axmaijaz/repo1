export class RoleDto {
  id = '';
  name = "";
  normalizedName = "";
  concurrencyStamp = "";
  isActive = false;
}

export class RolesDto {
  value = 0;
  name = "";
}

export class ClaimsDto {
  id = 0;
  claimType: string;
  displayName: string;
  claimScope: ClaimScope = 0;
  claimCategoryId: number;
  claimCategory: string;
  isChecked: boolean;
}

export class AssignCategoryDto {
  categoryId: number;
  appClaimIds = Array<number>();
}
export class CategoryDto {
  id = 0;
  name: string;
}
export enum ClaimScope {
  Generic = 0,
  AppAdmin = 1,
  FacilityUser = 2,
  Patient = 3,
  AppAdmin_FacilityUser = 4,
  AppAdmin_Patient = 5,
  FacilityUser_Patient = 6,
}
