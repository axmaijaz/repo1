import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { CreateClientExceptionLoggerDto } from 'src/app/model/Exception/Exception.model';
import { ApiExceptionsService } from '../Exceptions/api-exceptions.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { UserType } from 'src/app/Enums/UserType.enum';

@Injectable({
  providedIn: 'root'
})
export class AppErrorHandlerService implements ErrorHandler {
  constructor(private exceptionService: ApiExceptionsService, private securityService: SecurityService) { }

  handleError(error: Error): void {
    // throw error;
    // console.log( "Name" + error.name)
    // console.log( "Message" + error.message)
    // console.log( "STack" + error.stack)
    let facilityName  = 'No Facility';
    let userInfo  = 'No User';
    let deviceInfo = `(${navigator.language}) (${navigator.userAgent})`
    if (this.securityService.isLoggedIn()) {
      if (this.securityService.securityObject?.userType == UserType.AppAdmin) {
        facilityName = 'Admin User'
      } else {

        facilityName = this.securityService?.getClaim('FacilityName')?.claimValue
      }
      userInfo = this.securityService.securityObject?.fullName
    }
    let errorObjStr = error.stack

    const dObj = new CreateClientExceptionLoggerDto();
    dObj.id = 0
    dObj.source = 'Website'
    dObj.deviceInfo = deviceInfo
    dObj.path = location.href
    dObj.facilityName = facilityName
    dObj.userInfo = userInfo
    dObj.error = errorObjStr
    dObj.errorName = error.name
    dObj.message = error.message
    this.exceptionService.LoggFrontendException(dObj).subscribe(data => {

    })
    throw error;
  }

}
