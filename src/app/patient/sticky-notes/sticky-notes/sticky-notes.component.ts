import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { ToastService } from 'ng-uikit-pro-standard';
import { BulkCommunicationService } from 'src/app/communication/bulk-communication.service';
import { AppDataService } from 'src/app/core/app-data.service';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { PatientDto, StickyNotesDto } from 'src/app/model/Patient/patient.model';
import { SubSink } from 'src/app/SubSink';

@Component({
  selector: 'app-sticky-notes',
  templateUrl: './sticky-notes.component.html',
  styleUrls: ['./sticky-notes.component.scss']
})
export class StickyNotesComponent implements OnInit {
  reviewNote: string;
  PatientId: number;
  PatientData: PatientDto;
  stickyNotesDto = new StickyNotesDto();
  PatientAge: number;
  private subs = new SubSink();
  public notificationScroll = {
    axis: "y",
    theme: "dark-3",
    scrollInertia: 2,
    scrollButtons: { enable: true },
    autoHideScrollbar: true,

  };
  constructor(private patientsService: PatientsService, private toaster: ToastService, private route: ActivatedRoute,private appData: AppDataService, private bulkCommService: BulkCommunicationService,) { }

  ngOnInit(): void {
    this.getPatientDetail();
    this.GetPatientReviewNote();
  }
  EditStickyNotes() {
    let stickyNotesData = {
      patientId: this.PatientId,
      stickyNoteHigh: this.stickyNotesDto.stickyNoteHigh,
      stickyNoteMedium: this.stickyNotesDto.stickyNoteMedium,
      stickyNoteLow: this.stickyNotesDto.stickyNoteLow,
    };
    this.patientsService.EditStickyNotes(stickyNotesData).subscribe(
      (res: any) => {
        this.toaster.success('Sticky Notes Updated')
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
      }
    );
  }
  getPatientDetail() {
    this.PatientId = +this.route.snapshot.paramMap.get("id");
    if (this.PatientId) {
      this.subs.sink = this.patientsService
        .getPatientDetail(this.PatientId)
        .subscribe(
          (res: any) => {
            if (res) {
              this.appData.summeryViewPatient = res;
              res.dateOfBirth = res.dateOfBirth.slice(0, 10);
              this.PatientData = res;
              this.stickyNotesDto.stickyNoteLow = this.PatientData.stickyNoteLow;
              this.stickyNotesDto.stickyNoteMedium =
                this.PatientData.stickyNoteMedium;
              this.stickyNotesDto.stickyNoteHigh = this.PatientData.stickyNoteHigh;
              this.stickyNotesDto.patientId = this.PatientId;

              if (this.PatientData.lastAppLaunchDate) {
                this.PatientData.isActiveMobileUser = false;
                this.PatientData.lastAppLaunchDate = moment(
                  this.PatientData.lastAppLaunchDate
                )
                  .local()
                  .format("YYYY-MM-DDTHH:mm:ss.SSSS");
                const today = moment();
                var duration = today.diff(
                  this.PatientData.lastAppLaunchDate,
                  "days"
                );
                if (duration < 30) {
                  this.PatientData.isActiveMobileUser = true;
                }
                this.PatientData.lastAppLaunchDate = moment
                  .utc(this.PatientData.lastAppLaunchDate)
                  .local()
                  .format("D MMM YY,\\ h:mm a");
              }

              if (this.PatientData.homePhone) {
                this.PatientData.homePhone = this.PatientData.homePhone.replace(
                  /^(\d{0,3})(\d{0,3})(\d{0,4})/,
                  "($1)$2-$3"
                );
              }
              if (this.PatientData.personNumber) {
                this.PatientData.personNumber =
                  this.PatientData.personNumber.replace(
                    /^(\d{0,3})(\d{0,3})(\d{0,4})/,
                    "($1)$2-$3"
                  );
              }
              if (this.PatientData.emergencyContactPrimaryPhoneNo) {
                this.PatientData.emergencyContactPrimaryPhoneNo =
                  this.PatientData.emergencyContactPrimaryPhoneNo.replace(
                    /^(\d{0,3})(\d{0,3})(\d{0,4})/,
                    "($1)$2-$3"
                  );
              }
              // this.PatientAge = this.calculateAge(this.PatientData.dateOfBirth);
            }
          },
          (error) => {
            //  console.log(error);
          }
        );
    }
  }
  EditPatientReviewNote = () => {
    this.subs.sink = this.bulkCommService.EditPatientReviewNote(this.PatientId, this.reviewNote).subscribe(
      (res: any) => {
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  };
  GetPatientReviewNote = () => {
    this.reviewNote = ''
    this.subs.sink = this.bulkCommService.GetPatientReviewNote(this.PatientId).subscribe(
      (res: any) => {
        this.reviewNote = res
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  };
}
