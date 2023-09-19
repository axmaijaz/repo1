import { DashboardModule } from './dashboard/dashboard.module';
// import { SuccessPageComponent } from './shared/success-page/success-page.component';
import { LoginComponent } from './users/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
// import { MainLayoutComponent } from './Main/main-layout/main-layout.component';
import { ForgetPasswordComponent } from './users/forget-password/forget-password.component';
import { LoginGuard } from './core/guards/login.guard';
import { MainLayoutComponent } from './Main/main-layout/main-layout.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    data: { claimType: "IsAuthenticated" },
    pathMatch: 'prefix',
    children: [
      { path: '', redirectTo: 'admin', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
      { path: 'health-score', loadChildren: () => import('./health-score/health-score.module').then(m => m.HealthScoreModule) },
      { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
      { path: 'rpm', loadChildren: () => import('./rpm/rpm.module').then(m => m.RpmModule) },
      { path: 'insurance', loadChildren: () => import('./insurance/insurance.module').then(m => m.InsuranceModule) },
      { path: 'accounts', loadChildren: () => import('./accounts/accounts.module').then(m => m.AccountsModule) },
      // { path: 'config', loadChildren: () => import('./configuration/configuration.module').then(m => m.ConfigurationModule) },
      { path: 'patient', loadChildren: () => import('./patient/patient.module').then(m => m.PatientModule) },
      { path: 'org', loadChildren: () => import('./organization/org.module').then(m => m.OrgModule) },
      { path: 'device', loadChildren: () => import('./patient-device-management/patient-device-management.module').then(m => m.PatientDeviceManagementModule) },
      { path: 'tcm', loadChildren: () => import('./tcm/tcm.module').then(m => m.TcmModule) },
      { path: 'ccm', loadChildren: () => import('./ccm/ccm.module').then(m => m.CcmModule) },
      { path: 'medicare', loadChildren: () => import('./medi-care/medi-care.module').then(m => m.MediCareModule) },
      // { path: 'accounts', loadChildren: () => import(`./accounts/accounts.module`).then(m => m.AccountsModule) },
      // { path: 'student', loadChildren: './student/student.module#StudentModule' },
      { path: 'annualWellness', loadChildren: () => import('./annual-wellness-main/annual-wellness-main.module').then(m => m.AnnualWellnessMainModule) },
      // { path: 'endo', loadChildren: () => import('./principal-care-management/principal-care-management.module').then(m => m.PrincipalCareManagementModule) },
      // { path: 'annualWellness', loadChildren: './annual-wellness/annual-wellness.module#AnnualWellnessModule' },
      { path: 'medicine', loadChildren: () => import('./telemedicine/telemedicine.module').then(m => m.TelemedicineModule) },
      { path: 'pcm', loadChildren: () => import('./pcm-main/pcm-main.module').then(m => m.PcmMainModule) },
      { path: 'pcmHistory', loadChildren: () => import('./pcm-history/pcm-history.module').then(m => m.PcmHistoryModule) },
      { path: 'patientMr/:id', loadChildren: () => import('./monthly-review/monthly-review.module').then(m => m.MonthlyReviewModule) },
      { path: 'mr', loadChildren: () => import('./mr-admin/mr-admin.module').then(m => m.MrAdminModule) },
      // { path: 'user', loadChildren: './user-info/user-info.module#UesrInfoModule'},
      { path: 'user', loadChildren: () => import('./user-info/uesr-info.module').then(m => m.UesrInfoModule) },
      { path: 'bhi', loadChildren: () => import('./bhi-main/bhi-main.module').then(m => m.BhiMainModule) },
      { path: 'setupMr', loadChildren: () => import('./monthly-review/mrsetup/mrsetup.module').then(m => m.MRSetupModule) },
      { path: 'logging', loadChildren: () => import('./api-excep-logging/api-excep-logging.module').then(m => m.ApiExcepLoggingModule) },
      { path: 'administration', loadChildren: () => import('./administration/manage-admin/manage-admin.module').then(m => m.ManageAdminModule) },
      // { path: 'analytics', loadChildren: () => import('./analytics/analytics.module').then(m => m.AnalyticModule) },
      { path: 'extmanager', loadChildren: () => import('./extension-manager/extension-manager.module').then(m => m.ExtensionManagerModule) },
      { path: 'alertManager', loadChildren: () => import('./rpm/manage-rpm-alerts/manage-rpm-alerts.module').then(m => m.ManageRpmAlertsModule) },
      { path: 'customList', loadChildren: () => import('./custom-patient-listing/custom-patient-listing.module').then(m => m.CustomPatientListingModule) },
      { path: 'encounters', loadChildren: () => import('./manage-encounters/manage-encounters.module').then(m => m.ManageEncountersModule) },
      { path: 'priorAuth', loadChildren: () => import('./prior-auth/prior-auth.module').then(m => m.PriorAuthModule) },
      { path: 'ringCentral', loadChildren: () => import('./twoc-ring-central/twoc-ring-central.module').then(m => m.TwocRingCentralModule) },
      { path: 'principalcare', loadChildren: () => import('./principal-care-management/principal-care-management.module').then(m => m.PrincipalCareManagementModule) },
      { path: 'public', loadChildren: () => import('./public/public.module').then(m => m.PublicModule) },
      { path: 'complaintcenter', loadChildren: () => import('./complaint-dashboard/complaint-dashboard.module').then(m => m.ComplaintDashboardModule) },
      { path: 'rpm-inventory', loadChildren: () => import('./rpm/rpm-inventory/rpm-inventory.module').then(m => m.RpmInventoryModule) },
      { path: 'admin-tools', loadChildren: () => import('./admin-tools/admin-tools.module').then(m => m.AdminToolsModule) },
      { path: 'mobile-guide', loadChildren: () => import('./mobile-health-guide/mobile-health-guide.module').then(m => m.MobileHealthGuideModule) },
      { path: 'pr-reporting', loadChildren: () => import('./productivity-reporting/productivity-reporting.module').then(m => m.ProductivityReportingModule) },
      { path: 'complaince', loadChildren: () => import('./complaince/complaince.module').then(m => m.ComplainceModule) },
      { path: 'config', loadChildren: () => import('./configuration/configuration.module').then(m => m.ConfigurationModule) },
      { path: 'communication', loadChildren: () => import('./patient-communication/patient-communication.module').then(m => m.PatientCommunicationModule) },
      { path: 'AppInsights', loadChildren: () => import('./patient-insights/patient-insights.module').then(m => m.PatientInsightsModule) },
    ]
  },
  { path: 'extApp', loadChildren: () => import('./extension-manager/extension-manager.module').then(m => m.ExtensionManagerModule) },
  { path: 'adminModal', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'cms', loadChildren: () => import('./medi-care/medi-care.module').then(m => m.MediCareModule) },
  { path: 'viewer', loadChildren: () => import('./document-viewer/document-viewer.module').then(m => m.DocumentViewerModule) },
  { path: 'awForm', loadChildren: () => import('./annual-wellness-main/annual-wellness-main.module').then(m => m.AnnualWellnessMainModule) },
  { path: 'teleCare', loadChildren: () => import('./telemedicine/telemedicine.module').then(m => m.TelemedicineModule) },
  { path: 'modality', loadChildren: () => import('./patient-device-management/patient-device-management.module').then(m => m.PatientDeviceManagementModule) },
  { path: 'customUrl', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'insights', loadChildren: () => import('./patient-insights/patient-insights.module').then(m => m.PatientInsightsModule) },
  { path: 'modalConfig', loadChildren: () => import('./configuration/configuration.module').then(m => m.ConfigurationModule) },


  { path: 'fhir', loadChildren: () => import('./fhir-connect/fhir-connect.module').then(m => m.FHIRConnectModule) },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'login/:context', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'forgetpassword', component: ForgetPasswordComponent },
  // { path: 'success', component: SuccessPageComponent },
  // not change below this as it is used on backend
  { path: 'success', loadChildren: () => import('./public/public.module').then(m => m.PublicModule) },
  { path: 'emr', loadChildren: () => import('./emr-connect/emr-connect.module').then(m => m.EMRConnectModule) },
  { path: '**', component: PageNotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  // imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
