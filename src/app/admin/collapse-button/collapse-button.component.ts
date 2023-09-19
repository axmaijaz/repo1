import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { AddToDoNoteDto, ToDoNoteDto } from 'src/app/model/todos.model';
import { AppUserAuth } from 'src/app/model/security/app-user.auth';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { PatientNoteDto } from 'src/app/model/Patient/patient.model';
import { SubSink } from 'src/app/SubSink';
import moment from 'moment';
import { FeedbackService } from 'src/app/core/feedback.service';
import { FeedbackDto } from 'src/app/model/Facility/facility.model';
import { UserType } from 'src/app/Enums/UserType.enum';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { AppUiService } from 'src/app/core/app-ui.service';

@Component({
  selector: "app-collapse-button",
  templateUrl: "./collapse-button.component.html",
  styleUrls: ["./collapse-button.component.scss"]
})
export class COllapseButtonComponent implements OnInit, OnDestroy {
  @ViewChild("patientNoteModal") patientNoteModal: ModalDirective;
  isLoading: boolean;
  private subs = new SubSink();
  todoDto = new AddToDoNoteDto();
  todoListDto = new Array<ToDoNoteDto>();
  securityObject: AppUserAuth = null;
  PatientId: number;
  SummaryText = "";
  noteText = "";
  facilityId: number;
  appUserName = "";
  anonymous: boolean;
  feedbackDto = new FeedbackDto();
  file = new Array<any>();
  @ViewChild("feedbackModal") feedbackModal: ModalDirective;

  patientNoteObj = {
    count: 0,
    patientName: "",
    notes: new Array<PatientNoteDto>()
  };

  public scrollbarOptions = { axis: "y", theme: "minimal-dark" };
  public scrollbarOptionsTimeline = {
    axis: "y",
    theme: "minimal-dark",
    scrollInertia: 0
  };

  public timePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "YYYY-MM-DD hh:mm A"
  };

  constructor(
    private patientService: PatientsService,
    private securityService: SecurityService,
    private route: ActivatedRoute,
    private toaster: ToastService,
    private appUi: AppUiService,
    private router: Router,
    private feedbackService: FeedbackService,
  ) {
    this.securityObject = securityService.securityObject;
  }

  ngOnInit() {
    if (this.securityService.securityObject.userType === UserType.FacilityUser) {
      this.facilityId = +this.securityService.getClaim("FacilityId").claimValue;
    }
    this.router.events.subscribe(event => {});
    this.PatientId = +this.route.snapshot.paramMap.get("id");
    this.appUserName = this.securityObject.userName;
    this.feedbackDto.email = this.securityObject.userName;
    if (this.PatientId) {
      this.getNotesList();
      this.getClinicalSummary();
      this.getTodoList();
    }
  }

  addNote() {
    if (this.PatientId) {
      const patientNote = new PatientNoteDto();
      patientNote.note = this.noteText;
      patientNote.dateCreated = new Date();
      patientNote.patientId = this.PatientId;
      patientNote.facilityUserId = this.securityObject.id;
      this.isLoading = true;
      this.subs.sink = this.patientService
        .addUpdatePatientNote(patientNote)
        .subscribe(
          (res: any) => {
            this.getNotesList();
            this.noteText = "";
            this.isLoading = false;
            this.toaster.success("Note Added Successfully");
          },
          err => {
            this.toaster.error(err.message, err.error || err.error);
          }
        );
    }
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  getNotesList() {
    if (this.PatientId) {
      this.isLoading = true;
      this.subs.sink = this.patientService
        .getPatientNotesLIst(this.PatientId)
        .subscribe(
          (res: any) => {
            res.notes.forEach(data => {
              data.dateCreated = moment
                .utc(data.dateCreated)
                .local()
                .format('MMM DD,\\ h:mm a');
            });
            this.patientNoteObj.notes = res.notes;
            this.patientNoteObj.patientName = res.patientName;
            this.patientNoteObj.count = res.count;
          this.isLoading = false;
          },
          err => {
            this.toaster.error(err.message, err.error || err.error);
          }
        );
    }
  }
  checkNote = () =>   {
    this.patientNoteModal.hide();
    this.noteText = '';
  }
  rejectAlert = () =>   {
    this.patientNoteModal.show();
  }
  noteValueConfirmModal() {
    if (this.noteText) {
      const modalDto = new LazyModalDto();
      modalDto.Title = "Alert";
      modalDto.Text = "Are you sure to discard your note";
      // modalDto.hideProceed = true;
      modalDto.callBack = this.checkNote;
      modalDto.rejectCallBack = this.rejectAlert;
      // modalDto.data = data;
      this.appUi.openLazyConfrimModal(modalDto);
    } else {
      this.patientNoteModal.hide();
    }
  }
  getClinicalSummary() {
    if (this.PatientId) {
      this.isLoading = true;
      this.subs.sink = this.patientService
        .getClinicalSummary(this.PatientId)
        .subscribe(
          (res: any) => {
            this.SummaryText = res;
            this.isLoading = false;
          },
          err => {
            this.toaster.error(err.message, err.error || err.error);
          }
        );
    }
  }
  addSummary() {
    if (this.PatientId) {
      this.subs.sink = this.patientService
        .addUpdateClinicalSummary(this.SummaryText, this.PatientId)
        .subscribe(
          (res: any) => {
            this.getNotesList();
            this.isLoading = false;
            this.toaster.success("Clinical Summary Update Successfully");
          },
          err => {
            this.toaster.error(err.message, err.error || err.error);
          }
        );
    }
  }

  addTodo() {
    // ;
    this.isLoading = true;
    this.todoDto.userId = this.securityObject.appUserId;
    // const dateNow = new Date();
    // this.todoDto.dateCreated =
    //   dateNow.getDate() +
    //   "-" +
    //   (dateNow.getMonth() + 1) +
    //   "-" +
    //   dateNow.getFullYear() +
    //   " " +
    //   dateNow.getHours() +
    //   ":" +
    //   dateNow.getMinutes();
    // this.todoDto.dateCreated = dateNow.toString();
    if (this.PatientId) {
      this.todoDto.patientId = this.PatientId;
    }
    this.subs.sink = this.patientService.addEditTodo(this.todoDto).subscribe(
      (res: any) => {
        this.todoDto = new AddToDoNoteDto();
        this.getTodoList();
        this.isLoading = false;
        this.toaster.success("data added Successfully");
      },
      err => {
        this.toaster.error(err.message, err.error || err.error);
        this.isLoading = false;
      }
    );
  }

  getTodoList() {
    this.isLoading = true;
    this.subs.sink = this.patientService
      .getTodoListByUser(this.securityObject.appUserId)
      .subscribe(
        (res: any) => {
          res.forEach(data => {
            data.dateCreated = moment
              .utc(data.dateCreated)
              .local()
              .format("MMM DD, y, h:mm:ss a");
            res.push(data);
          });
          this.todoListDto = res;
          this.isLoading = false;
        },
        err => {
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }

  removeEmail() {
    if (this.anonymous) {
      this.feedbackDto.email = "";
    } else {
      this.feedbackDto.email = this.appUserName;
    }
  }

  feedbacks() {
    this.isLoading = true;
    this.feedbackDto.facilityId = this.facilityId;
    this.feedbackService
      .feedbacks(this.feedbackDto)
      .subscribe(
        (res: any) => {
          this.isLoading = false;
          this.file = [];
          this.feedbackDto = new FeedbackDto();
          this.feedbackModal.hide();
          this.toaster.success("Thanks for your feedback");
        },
        (err) => {
          this.toaster.error(err.message, err.error || err.error);
          this.isLoading = false;
          // console.log(error);
        }
      );
  }
  resetFeedBackForm() {
    this.file = [];
    this.feedbackDto = new FeedbackDto();
    this.feedbackDto.email = this.securityObject.userName;
  }
}
