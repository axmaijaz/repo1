

export class CreateClientExceptionLoggerDto {
  id: number;
  source: string;
  deviceInfo: string;
  path: string;
  facilityName: string;
  userInfo: string;
  error: string;
  errorName: string;
  message: string;
}

export class ClientExceptionLoggerDto {
  id: number;
  source: string;
  deviceInfo: string;
  path: string;
  facilityName: string;
  userInfo: string;
  error: string;
  errorName: string;
  message: string;
  createdOn: Date | string;
  createdUser: string;
  updatedOn: Date | string;
  updatedUser: string;
  isActiveState: boolean;
  isDeletedState: boolean;
}
