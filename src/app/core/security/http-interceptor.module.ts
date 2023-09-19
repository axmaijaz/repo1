import { Injectable, NgModule } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { SecurityService } from './security.service';
import { Router } from '@angular/router';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  // private refreshingToken: boolean;
  private refreshTokenSubject: Subject<any> = new BehaviorSubject<any>(null);
  /**
   *
   */
  constructor(private securityService: SecurityService, private router: Router) {

  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const isAccessTokenExpired = this.securityService.isAccessTokenExpired();
    const isRefreshTokenExpired = this.securityService.isRefreshTokenExpired();
    const isLoggedIn = this.securityService.isLoggedIn();
    // console.log(this.securityService.GetTokensExpiry());
    if (isLoggedIn && isRefreshTokenExpired) {
      this.router.navigateByUrl('/login', {queryParams: {reason: 'Refresh Token Expired'}});
      this.securityService.logout();
      return;
    }
    if (isLoggedIn && isAccessTokenExpired && !isRefreshTokenExpired) {
      if (!localStorage.getItem('refreshing2CToken') ) {
        localStorage.setItem('refreshing2CToken', 'true');
        this.refreshTokenSubject.next(null);
        // return this.securityService.RefreshToken().subscribe(x => {
        // setItem.getItem('refreshing2CToken', 'false');
        //   this.refreshTokenSubject.next(x);
        //   return this.handleTheRequest(req, next);
        // }, (error) => {
        // setItem.getItem('refreshing2CToken', 'false');
        //   this.router.navigateByUrl('/login', {queryParams: {reason: 'Unable to Refresh Token ' + error}});
        //   this.securityService.logout();
        //   return throwError(error);
        // })
        return this.securityService.RefreshToken().pipe(
          switchMap((token: any) => {
            localStorage.setItem('refreshing2CToken', '');
            this.refreshTokenSubject.next(token);
            return this.handleTheRequest(req, next);
            // this.isRefreshing = false;
            // this.tokenService.saveToken(token.accessToken);
            // this.refreshTokenSubject.next(token.accessToken);

            // return next.handle(this.addTokenHeader(request, token.accessToken));
          }),
          catchError((err) => {
            localStorage.setItem('refreshing2CToken', '');
            this.router.navigateByUrl('/login', {queryParams: {reason: 'Unable to Refresh Token ' + err}});
            this.securityService.logout();
            // this.tokenService.signOut();
            return throwError(err);
          })
        );
      } else {
        return this.refreshTokenSubject.pipe(
          filter(result => result !== null),
          take(1),
          switchMap((res) => {
              return this.handleTheRequest(req, next);
          })
      );
      }
    } else {
      return this.handleTheRequest(req, next);
    }

  //   return next.handle(newReq);
  // } else {
  //   return next.handle(req);
  // }
  }
  private handleTheRequest(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('bearerToken');
    const PagePath = location.href || '';
    if (token) {
      const newReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          version: this.securityService.appVersion,
          ClientType: 'web',
          PagePath: PagePath
        },
        // headers: req.headers.set('Authorization', 'Bearer ' + token)
      });
      req = newReq;
    }
    const myreqq = req;
    return next.handle(req).pipe(
      catchError((httpError: HttpErrorResponse) => {
        if (httpError.status == 426) {
          window.location.reload();
        }
        // log your error here
        // console.error(myreqq);
        return throwError(httpError);
      })
    );
  }
}

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true
    }
  ]
})
export class HttpInterceptorModule {}
