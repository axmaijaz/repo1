import { UtilityModule } from './utility/utility.module';
import { SharedPipesModule } from 'src/app/shared-pipes/shared-pipes.module';
import { ModalsSharedModule } from './modals-shared/modals-shared.module';

// import { BrowserModule } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA, ErrorHandler } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
// import { FormsModule } from '@angular/forms';
// import { FilterPipe } from './rpm/modality-configuration/modality-configuration.component';
import { ActionReducer, StoreModule } from '@ngrx/store';
import * as LogRocket from 'logrocket';
import { MDBBootstrapModulesPro, ToastModule } from 'ng-uikit-pro-standard';
import { PubNubAngular } from 'pubnub-angular2';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { LazyLoaderService } from './core/Lazy/lazy-loader.service';
import { HttpInterceptorModule } from './core/security/http-interceptor.module';
import { lazyArrayToObj } from './lazy-widgets';
import { EditorModule } from '@tinymce/tinymce-angular';

// import { AboutUsComponent } from './public/about-us/about-us.component';
// import { ContactUSComponent } from './public/contact-us/contact-us.component';
// import { HomeComponent } from './public/home/home.component';
import { LAZY_WIDGETS } from './tokens';
import { ForgetPasswordComponent } from './users/forget-password/forget-password.component';
import { LoginComponent } from './users/login/login.component';
import { AgmCoreModule } from "@agm/core";
import { MdbSharedModule } from './mdb-shared/mdb-shared.module';
import { MainLayoutComponent } from './Main/main-layout/main-layout.component';
import { HasClaimDirective } from './shared/directives/has-claim.directive';
import { SuccessPageComponent } from './public/success-page/success-page.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedDirectivesModule } from './shared/shared-directives/shared-directives.module';
import { PatientSideNavComponent } from './shared/patient-side-nav/patient-side-nav.component';
import { AdminSidenavComponent } from './shared/admin-sidenav/admin-sidenav.component';
import { PublicSharedModule } from './public-shared/public-shared.module';
import { MessagingComponent } from './user-chat/messaging/messaging.component';
// import { MonthlyChargesReportComponent } from './monthly-charges-report/monthly-charges-report.component';
// import { AnalyticSideNavComponent } from './analytic-side-nav/analytic-side-nav.component';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { NgSelectModule } from '@ng-select/ng-select';
import { QRCodeModule } from 'angularx-qrcode';
import { CustomListModalComponent } from './custom-patient-listing/custom-list-modal/custom-list-modal.component';
import { AngularDraggableModule } from 'angular2-draggable';
import { InvoicePreviewComponent } from './accounts/invoice-preview/invoice-preview.component';
// import { IntellisenseWidgetComponent } from './intellisense-widget/intellisense-widget.component';
import { GlobalIframeComponent } from './global-iframe/global-iframe.component';
import { SearchPatientsComponent } from './administration/search-patients/search-patients.component';
import { AppErrorHandlerService } from './core/ErrorHandler/app-error-handler.service';
import { PatientCommunicationModule } from './patient-communication/patient-communication.module';
import { PatientSharedModule } from './patient-shared/patient-shared.module';

// import { AdminUsersListComponent } from './administration/admin-users-list/admin-users-list.component';

const reduxMiddleware = LogRocket.reduxMiddleware();

export function logrocketMiddleware(reducer): ActionReducer<any> {
  let currentState;
  const fakeDispatch = reduxMiddleware({
    getState: () => currentState,
  })(() => {});

  return function (state, action) {
    const newState = reducer(state, action);
    currentState = state;
    fakeDispatch(action);
    return newState;
  };
}

@NgModule({
  declarations: [
    // PageNotFoundComponent,
    // HasClaimDirective,
    // SuccessPageComponent,
    // AnalyticMainLayoutComponent,
    // AnalyticSideNavComponent,
    MessagingComponent,
    CustomListModalComponent,
    PatientSideNavComponent,
    AdminSidenavComponent,
    MainLayoutComponent,
    ForgetPasswordComponent,
    AppComponent,
    LoginComponent,
    InvoicePreviewComponent,
    // IntellisenseWidgetComponent,
    GlobalIframeComponent,
    SearchPatientsComponent,


    // AdminUsersListComponent,
    // AboutUsComponent,
    // ContactUSComponent,
    // FooterComponent,
    // HeaderComponent,
    // HomeComponent,
    // MonthlyChargesReportComponent,
    // AnalyticSideNavComponent,
    // FilterPipe,

  ],
  imports: [
    // BrowserModule,
    SharedDirectivesModule,
    SharedPipesModule,
    ModalsSharedModule,
    PublicSharedModule,
    PatientSharedModule,
    DpDatePickerModule,
    FormsModule,
    MalihuScrollbarModule.forRoot(),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularDraggableModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyB-slSloFmZbtUgY8YQh0KaaG5hRyNGmlo",
      libraries: ["places"]
    }),
    StoreModule.forRoot(
      {},
      {
        metaReducers: [logrocketMiddleware]
      }
    ),
    HttpInterceptorModule,
    MDBBootstrapModulesPro.forRoot(),
    ToastModule.forRoot(),
    MdbSharedModule,
    NgSelectModule,
    CoreModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production
    }),
    QRCodeModule,
    UtilityModule,
    EditorModule,
    PatientCommunicationModule
  ],
  bootstrap: [AppComponent],
  providers: [
    PubNubAngular,
    DatePipe,
    LazyLoaderService,
    {provide: ErrorHandler, useClass: AppErrorHandlerService},
    { provide: LAZY_WIDGETS, useFactory: lazyArrayToObj }
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {}
