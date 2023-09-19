export class AppAdminDto {
id = 0;
firstName: string;
lastName: string;
middleName: string;
userName: string;
email: string;
phoneNumber: string;
title: string;
profileImagePath: string;
roleIds: [];
roleNames = "";
isAdmin: boolean;
isActiveState: boolean;
isDeletedState: boolean;
isLoading: boolean;
userId: string;
}

export class CreateAdminDto {
  id = 0;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  middleName: string;
  title: string;
  email: string;
  userName: string;
  password: string;
  confirmPassword: string;
  countryCallingCode: number;
}
export class AddAdminDto {
  id = 0;
  firstName: string;
  lastName: string;
  middleName: string;
  title: string;
  email: string;
  password: string;
  confirmPassword: string;
}
