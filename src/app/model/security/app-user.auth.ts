import { AppUserClaim } from './app-user-claim';
import { UserType } from 'src/app/Enums/UserType.enum';

export class AppUserAuth {
  id = 0;
  fullName = '';
  appUserId = '';
  userName = '';
  bearerToken = '';
	expiration = '';
	refreshToken = '';
	refreshTokenExpiration = '';
  changePasswordRequired: boolean;
  is2faRequired: boolean;
  isAuthenticated = false;
  isEmailVerified = false;
  isPhoneVerified = false;
  loginCount = 0;
  logosPath = '';
  primaryColor = ''
  secondaryColor = '';
  sideNavBarColor = '';
  userCurrentLogin = '';
  userLastLogin = '';
  userType: UserType;
  claims: AppUserClaim[] = [
    // { claimValue: 'true', claimId: '123', claimType: 'mytest', userId: '1' }
  ];
}

export class ChnagePasswordDto {
  userId = '';
  newPassword = '';
  oldPassword = '';
}
export enum AccountState {
  LoggedIn = 1,
  LoggedOut = 2,
}
export enum SendMethod {
  SMS = 0,
  Email = 1,
}
export class Send2FTokenDto {
  userId: string;
  sendMethod: SendMethod;
}
