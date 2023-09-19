import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { ProviderDto, Speciality } from 'src/app/model/Provider/provider.model';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { ActivatedRoute } from '@angular/router';
import { PatientDto, PatientSpecialistDto } from 'src/app/model/Patient/patient.model';
import { ToastService } from 'ng-uikit-pro-standard';
import { CreateFacilityUserDto } from 'src/app/model/Facility/facility.model';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { UserType } from 'src/app/Enums/UserType.enum';
import { SecurityService } from 'src/app/core/security/security.service';
import { DatePipe } from '@angular/common';
import { SubSink } from 'src/app/SubSink';

@Component({
  selector: "app-providers",
  templateUrl: "./providers.component.html",
  styleUrls: ["./providers.component.scss"]
})
export class ProvidersComponent implements OnInit, OnDestroy {
  @Input() hideBillingProviderView: boolean;
  @Input() careplanView: boolean;
  @Output() providersAddEditEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();


  private subs = new SubSink();
  public DisplayDate;
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "MM-DD-YYYY",
    appendTo: 'body'
    // drops: "down"
  };
  provider = new CreateFacilityUserDto();
  PatientId = 0;
  // otherSpeciality = false;
  BillingProviderId = 0;
  selectedDate = new Date();
  providerList = new Array<CreateFacilityUserDto>();
  providerId: number;
  PatientData: PatientDto;
  addPatientSpecialist = new PatientSpecialistDto();
  ListofPatientSpecialist = new Array<PatientSpecialistDto>();
  specialities = new Array<Speciality>();
  facilityId: number;

  constructor(
    private patientsService: PatientsService,
    private datepipe: DatePipe,
    private securityService: SecurityService,
    private facilityService: FacilityService,
    private route: ActivatedRoute,
    private toaster: ToastService
  ) {}
  ngOnInit() {
    if (
      this.securityService.securityObject.userType === UserType.FacilityUser
    ) {
      this.facilityId = +this.securityService.getClaim("FacilityId").claimValue;
    } else {
      this.facilityId = 0;
    }
    this.PatientId = +this.route.pathFromRoot[3].snapshot.paramMap.get("id");
    this.loadProviders();
    this.GetPatientData();
    this.subs.sink = this.patientsService.getProviderSpecialities().subscribe(
      (res: any) => {
        if (res) {
          this.specialities = res;
        }
      },
      err => {
        this.toaster.error(err.message, err.error || err.error);
      }
    );
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  GetPatientData() {
    if (this.PatientId) {
      this.subs.sink = this.patientsService.getPatientDetail(this.PatientId).subscribe(
        (res: any) => {
          if (res) {
            this.PatientData = res;
            this.BillingProviderId = this.PatientData.billingProviderId;
            if (
              this.PatientData.specialists &&
              this.PatientData.specialists.length > 0
            ) {
              this.ListofPatientSpecialist = this.PatientData.specialists;
            }
            this.getBillingProviderDetail(this.BillingProviderId);
          }
        },
        error => {}
      );
    }
  }
  getBillingProviderDetail(id: number) {
    this.subs.sink = this.facilityService.getFacilityUserById(id).subscribe(
      (res: any) => {
        if (res) {
          this.provider = res;
          this.providerId = this.provider.id;
        }
      },
      error => {}
    );
  }
  loadProviders() {
   this.subs.sink = this.facilityService
     .getBillingProvidersByFacilityId(this.facilityId)
     .subscribe(
       (res: any) => {
         if (res) {
           this.providerList = res;
         }
       },
       error => {}
     );
  }
  addEditBillingProvider() {
    const parm = {
      patientId: this.PatientId,
      providerId: this.providerId
    };
    this.subs.sink = this.patientsService
      .AddUpdateBillingProvider(parm)
      .subscribe(
        (res: any) => {
          if (res) {
            this.provider = res;
            this.toaster.success("Data Saved Successfully");
          }
        },
        err => {
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }
  addSpecialistMethod() {
    this.addPatientSpecialist.patientId = this.PatientId;
    this.subs.sink = this.patientsService
      .AddUpdatePatientSpecialist(this.addPatientSpecialist)
      .subscribe(
        (res: any) => {
          if (res) {
            this.toaster.success("Data Saved Successfully");
            this.addPatientSpecialist = new PatientSpecialistDto();
            this.GetPatientData();
            this.providersAddEditEmitter.emit(true);
          }
        },
        error => {
          this.toaster.error(error.message, error.error || error.error);
        }
      );
  }
  editSpecialist(item: PatientSpecialistDto) {
    // if ( item.degree) {
    //   this.otherSpeciality = true;
    // } else {
    //   this.otherSpeciality = false;
    // }
    // item.prevAppointment =(item.prevAppointment.getFullYear() +
    //   "-" +
    //   item.prevAppointment.getMonth() +
    //   "-" +
    //   item.prevAppointment.getDate());
    item.prevAppointment = this.datepipe.transform(
      item.prevAppointment,
      "MM-dd-yyyy"
    );
    item.nextAppointment = this.datepipe.transform(
      item.nextAppointment,
      "MM-dd-yyyy"
    );

    this.addPatientSpecialist = new PatientSpecialistDto();
    Object.assign(this.addPatientSpecialist, item);
  }
  resetProviderValues() {
    this.addPatientSpecialist = new PatientSpecialistDto();
  }
}
