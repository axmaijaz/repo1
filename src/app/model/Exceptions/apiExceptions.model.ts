export class ExceptionLoggerDto {
  id: number;
  logTime: Date | string;
  loggedUser: string;
  loggedUserId: string;
  facilityName: string;
  currentFacilityId: string;
  httpMethod: string;
  controllerName: string;
  eventName: string;
  path: string;
  queryString: string;
  requestBody: string;
  exceptionMessage: string;
  innerExceptionMessage: string;
  exceptionStackTrace: string;
  modelState: string;
  clientType: string;
  pagePath: string;
}
