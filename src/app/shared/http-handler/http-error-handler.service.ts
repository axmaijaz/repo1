import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { HttpResError } from 'src/app/model/common/http-response-error';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerService {

  constructor() { }

  public handleHttpError = (err: HttpErrorResponse) => {
    // if (err.error instanceof ErrorEvent) {
    //   // Client Side or Network Error
    //   console.error('Client Side Error: ' , err.error.message);
    // } else {
    //   console.error('Server Side Error: ', err);
    // }
    const dataError = new HttpResError();
    dataError.status = err.status;
    // dataError.error = 'An error occurred. Please try again later.';
    // dataError.error = (typeof err.error === 'object') ? JSON.stringify(err.error) : err.error;
    dataError.error = this.getErrorMessage(err);
    if (err.status === 400) {
      // return Observable.throw('400');
      dataError.message = 'Bad Request';
      if (err.error) {
        dataError.error = this.getErrorMessage(err);
      }
    } else if (err.status === 404) {
      // return Observable.throw('Not Found Error');
      dataError.message = 'Not Found Error';
      if (err.error) {
        dataError.error = this.getErrorMessage(err);
      }
    } else if (err.status === 423) {
      // return Observable.throw('423');
    } else if (err.status === 422) {
      // return Observable.throw(error);
    } else if (err.status === 401) {
      // return Observable.throw('Unauthorize');
      dataError.message = 'UnAuthorized';
    } else if (err.status === 0) {
      // return Observable.throw('Internet Connection Lost');
      dataError.message = 'Internet Connection Lost';
    } else if (err.status === 500) {
      // return Observable.throw('Internal Server Error');
      dataError.message = 'Internal Server Error';
    }
    // return Observable.throw('App Error ' + dataError);
    // return ErrorObservable.create(dataError);
    return throwError(dataError);
  }

  getErrorMessage = (err: HttpErrorResponse) => {
    let errorString = '';
    if (typeof err.error === 'object') {
      for (const key in err.error) {
        if (err.error.hasOwnProperty(key)) {
          errorString += key + ' : ' + err.error[key];
        }
      }
      errorString = errorString;
    } else {
      errorString = err.error;
    }
    return errorString;
  }
}
