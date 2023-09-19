import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DpDatePickerModule } from 'ng2-date-picker';
import { NgxSkltnModule } from 'ngx-skltn';
import { DataTablesModule } from 'angular-datatables';
// MDB Angular Pro
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { AngularDraggableModule } from 'angular2-draggable';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
// import { HasClaimDirective } from './directives/has-claim.directive';
// import { MainLayoutComponent } from '../Main/main-layout/main-layout.component';
import { RouterModule } from '@angular/router';
import { OnlyNumbersDirective } from './directives/only-numbers.directive';
// import { TutorSidenavComponent } from './tutor-sidenav/tutor-sidenav.component';
// import { AdminSidenavComponent } from './admin-sidenav/admin-sidenav.component';
// import { StudentSidenavComponent } from './student-sidenav/student-sidenav.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelectModule } from '@ng-select/ng-select';
import { GroupBYPipe } from './pipes/group-by.pipe';
import { AddPatientComponent } from './add-patient/add-patient.component';
// import { PatientSideNavComponent } from './patient-side-nav/patient-side-nav.component';
import { DndModule } from 'ngx-drag-drop';
import { DndDropzoneDirective } from './directives/dnd-dropzone.directive';
import { DndDraggableDirective } from './directives/dnd-draggable.directive';
import {NgxMaskModule, IConfig} from 'ngx-mask';
import { DistinctPipe } from './pipes/distinct.pipe';
import { SortByPipe } from './pipes/sort-by.pipe';
// import { PatientAlertComponent } from './patient-alert/patient-alert.component';
// import { IsOutsideDirective } from './is-outside.directive';
import { CcmLoaderDirective } from './ccm-loader.directive';
// import { SuccessPageComponent } from './success-page/success-page.component';
import { RecalculateNgxTableDirective } from './recalculate-ngx-table.directive';
// import { MessagingComponent } from '../user-chat/messaging/messaging.component';
import { RecordNotFoundComponent } from './record-not-found/record-not-found.component';
import { ConsentDocComponent } from '../admin/consent-doc/consent-doc.component';
// import { DebounceClickDirective } from '../debounce-click.directive';
// import { EllipsisPipe } from '../ellipsis.pipe';
import { PatientDetailsComponent } from '../admin/patient/patient-details/patient-details.component';
// import { OnDebounceDirective } from './directives/on-debounce.directive';
import { MdbSharedModule } from '../mdb-shared/mdb-shared.module';
import { PatientDetailModule } from '../admin/patient/patient-details/patient-detail/patient-detail.module';
import { SharedDirectivesModule } from './shared-directives/shared-directives.module';
import { PublicSharedModule } from '../public-shared/public-shared.module';
import { SharedPipesModule } from '../shared-pipes/shared-pipes.module';
import { AppUserClaimsComponent } from './app-user-claims/app-user-claims.component';
import { DocumentViewerModule } from '../document-viewer/document-viewer.module';
import { PatientGapDetailComponent } from '../admin/patient/patient-details/patient-detail/patient-gap-detail/patient-gap-detail.component';
import { DateMaskPipe } from './pipes/date-mask.pipe';
export let options: Partial<IConfig> | (() => Partial<IConfig>) = {};
@NgModule({
  declarations: [
    // PageNotFoundComponent,
    // HasClaimDirective,
    // MainLayoutComponent,
    // PatientSideNavComponent,
    OnlyNumbersDirective,
    GroupBYPipe,
    DistinctPipe,
    // TutorSidenavComponent,
    // AdminSidenavComponent,
    // StudentSidenavComponent,
    AddPatientComponent,
    DndDropzoneDirective,
    DndDraggableDirective,
    PatientGapDetailComponent,
    SortByPipe,
    // PatientAlertComponent,
    // IsOutsideDirective,
    CcmLoaderDirective,
    ConsentDocComponent,
    // SuccessPageComponent,
    RecalculateNgxTableDirective,
    // MessagingComponent,
    RecordNotFoundComponent,
    AppUserClaimsComponent,
    // DateMaskPipe,
    // PatientDetailsComponent,
    // DebounceClickDirective,
    // EllipsisPipe,
    // OnDebounceDirective
  ],
  imports: [
    HttpClientModule,
    NgxMaskModule.forRoot(options),
    DndModule,
    NgxSpinnerModule,
    MdbSharedModule,
    RouterModule.forChild([]),
    // DropdownModule,
    CommonModule,
    // TabsModule,
    FormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    ReactiveFormsModule,
    SharedDirectivesModule,
    SharedPipesModule,
    PublicSharedModule,
    DocumentViewerModule,
    // TimePickerModule,
    // ModalModule,
    // WavesModule,
    // SelectModule,
    // InputsModule,
    // ButtonsModule,
    // SidenavModule,
    // AccordionModule,
    // MaterialChipsModule,
    // BadgeModule,
    // IconsModule,
    // NavbarModule,
    // TooltipModule,
    // CheckboxModule,
    // ChartsModule,
    NgxDatatableModule,
    NgSelectModule,
    MalihuScrollbarModule.forRoot(),
    NgxSkltnModule.forRoot({
      rectRadius: 4,
      bgFill: "#CCC",
      flareFill: "#EEE",
      flareWidth: "120px",
      duration: 2000,
      delay: 300
    }),
    DpDatePickerModule,
    // PreloadersModule,
    // CollapseModule,
    // StepperModule,
    // DatepickerModule,
    // FileInputModule,
    // PopoverModule,
    AngularDraggableModule,
    // TableModule,
    DataTablesModule,
    PatientDetailModule,
    // StickyContentModule
    // EllipsisPipe

  ],
  // providers: [MDBSpinningPreloader],
  exports: [
    DndModule,
    SharedDirectivesModule,
    SharedPipesModule,
    PublicSharedModule,
    MdbSharedModule,
    // MaterialChipsModule,
    // BadgeModule,
    // IconsModule,
    NgxSpinnerModule,
    // MainLayoutComponent,
    // PageNotFoundComponent,
    // PatientSideNavComponent,
    // TabsModule,
    CommonModule,
    FormsModule,
    CalendarModule,
    HttpClientModule,
    ReactiveFormsModule,
    // HasClaimDirective,
    OnlyNumbersDirective,
    GroupBYPipe,
    DocumentViewerModule,
    // ModalModule,
    // WavesModule,
    // SelectModule,
    // TimePickerModule,
    // InputsModule,
    // ButtonsModule,
    // SidenavModule,
    // AccordionModule,
    // NavbarModule,
    // TooltipModule,
    NgSelectModule,
    // CheckboxModule,
    // DropdownModule,
    // ChartsModule,
    MalihuScrollbarModule,
    // TutorSidenavComponent,
    // AdminSidenavComponent,
    // StudentSidenavComponent,
    NgxDatatableModule,
    DpDatePickerModule,
    // DatepickerModule,
    // PreloadersModule,
    AddPatientComponent,
    NgxSkltnModule,
    // CollapseModule,
    DndDraggableDirective,
    DndDropzoneDirective,
    NgxMaskModule,
    DistinctPipe,
    SortByPipe,
    // PatientAlertComponent,
    // FileInputModule,
    AppUserClaimsComponent,
    // PopoverModule,
    // IsOutsideDirective,
    CcmLoaderDirective,
    RecalculateNgxTableDirective,
    // MessagingComponent,
    RecordNotFoundComponent,
    AngularDraggableModule,
    // DebounceClickDirective,
    PatientDetailModule,
    PatientGapDetailComponent,
    // TableModule,
    // PatientDetailsComponent,
    // DatepickerModule,
    DataTablesModule,
    // EllipsisPipe,
    // StickyContentModule,
    // OnDebounceDirective
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SharedModule {}
