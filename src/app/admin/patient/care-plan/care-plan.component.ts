import {
  Component,
  OnInit,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  OnDestroy,
  HostListener
} from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { QuestionnaireService } from 'src/app/core/questionnaire.service';
import {
  QuestionnaireDto,
  CarePlanViewModel,
  TemplateRecord,
  CarePlanata
} from 'src/app/model/Questionnaire/Questionnire.model';
import * as moment from 'moment';
import {
  ModalDirective,
  ToastService,
  TabsetComponent,
  TabDirective
} from 'ng-uikit-pro-standard';
import { DataFilterService } from 'src/app/core/data-filter.service';
import { Location } from '@angular/common';
import { CcmDataService } from 'src/app/core/ccm-data.service';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { AppDataService } from 'src/app/core/app-data.service';
import { SubSink } from 'src/app/SubSink';

@Component({
  selector: 'app-care-plan',
  templateUrl: './care-plan.component.html',
  styleUrls: ['./care-plan.component.scss']
})
export class CarePlanComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild("editTemplateModal") EditPlanModal: ModalDirective;
  @ViewChild("reOrderQuestions") reOrderQuestions: ModalDirective;
  @ViewChild("staticTabs") staticTabs: TabsetComponent;
  private subs = new SubSink();
  @Input() actionType: number;
  @Output() emitNoteValue = new EventEmitter<string>();
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD hh:mm A'
  };
  public onlydatePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD'
  };
  followUpDataObj = {
    patientId: 0,
    followUpDate: '',
    recentPcpAppointment: '',
    recentHospitalizationDate: ''
  };

  RearrangeCategoryId: number;
  activeTab = 1;
  canEditTemplate = false;
  PatientId: number;
  PatientTemplate: any;
  questionList = new Array<QuestionnaireDto>();
  carePlanViewModel = new Array<CarePlanViewModel>();
  templateData = new Array<CarePlanata>();
  submitCarePlanData = new Array<TemplateRecord>();
  isLoading = false;
  SectionTimeLogData = new Array<{
    category: string;
    starttime: string;
    stopTime: string;
    isRecording: boolean;
    totalTime: string;
  }>();
  actionTypeCheck: number;

  // @HostListener('window:beforeunload', ['$event'])
  // beforeUnloadHander(event) {
  //   return false;
  // }
  constructor(
    private Toaster: ToastService,
    private route: ActivatedRoute,
    // private router: Router,
    private location: Location,
    private questionService: QuestionnaireService,
    private filterDataService: DataFilterService,
    private ccmService: CcmDataService,
    private appDataService: AppDataService,
    private toaster: ToastService
  ) {
    // router.events.subscribe((event) => {
    //   if (event instanceof NavigationStart) {
    //     const ress = !router.navigated;
    //   }
    // });
  }

  ngOnInit() {
    this.PatientId = +this.route.snapshot.paramMap.get('id');
    if (!this.PatientId) {
      this.PatientId = +this.route.pathFromRoot[3].snapshot.paramMap.get('id');
    }
    this.getPatientTemplateByID(this.PatientId);
    this.getFollowUpDate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.actionType >= 0 && this.actionTypeCheck !== this.actionType) {
      this.actionTypeCheck = this.actionType;
      this.recordSectionionTimeLog(this.actionType);
    }
  }
  ngOnDestroy(): void {
    if (this.templateData && this.templateData.length > 0) {
      this.saveTemplateData();
    }
    this.appDataService.patientTemplate = {};
    this.subs.unsubscribe();
  }
  getFollowUpDate() {
    this.subs.sink = this.ccmService.getfollowUpDate(this.PatientId).subscribe(
      res => {
        Object.assign(this.followUpDataObj, res);
        // this.toaster.success('Data Updated Successfully');
        if (this.followUpDataObj.followUpDate) {
          this.followUpDataObj.followUpDate = moment(
            this.followUpDataObj.followUpDate
          ).format('YYYY-MM-DD hh:mm A');
        }

        if (this.followUpDataObj.recentPcpAppointment) {
          this.followUpDataObj.recentPcpAppointment = moment(
            this.followUpDataObj.recentPcpAppointment
          ).format('YYYY-MM-DD hh:mm A');
        }

        if (this.followUpDataObj.recentHospitalizationDate) {
          this.followUpDataObj.recentHospitalizationDate = this.followUpDataObj.recentHospitalizationDate.slice(
            0,
            10
          );
        }
      },
      error => {
        this.toaster.error(error.message, error.error || error.error);
      }
    );
  }
  updateFollowUpDate() {
    this.followUpDataObj.patientId = this.PatientId;
    this.subs.sink = this.ccmService
      .changefollowUpDate(this.followUpDataObj)
      .subscribe(
        res => {
          this.toaster.success("Data Updated Successfully");
        },
        err => {
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }

  getPatientTemplateByID(ID: number) {
    this.isLoading = true;
    this.subs.sink = this.questionService.getPatientTemplate(ID).subscribe(
      (res: any) => {
        if (res) {
          if (res.id > 0) {
            this.canEditTemplate = false;
            this.PatientTemplate = res;
            this.appDataService.patientTemplate = res;
            this.appDataService.patientDataChanged.next(true);
            this.questionList = res.carePlanQuestionnaires;
            this.carePlanViewModel = this.filterDataService.ArrayGroupBy(
              res.carePlanQuestionnaires,
              'questionCatName'
            );
            this.subs.sink = this.questionService
              .getTemplateData(res.id)
              .subscribe(
                (result: any) => {
                  this.templateData = this.filterDataService.ArrayGroupByChildObject(
                    result,
                    "carePlanFieldId"
                  );
                  if (this.staticTabs) {
                    this.staticTabs.setActiveTab(2);
                  }
                },
                err => {}
              );
          } else {
            this.PatientTemplate = res;
            this.canEditTemplate = true;
            // this.EditPlanModal.show();
          }
          this.isLoading = false;
        }
        this.isLoading = false;
      },
      error => {
        // console.log(error);
      }
    );
  }
  saveTemplateData() {
    this.submitCarePlanData = new Array<TemplateRecord>();
    this.templateData.forEach((item: any) => {
      this.submitCarePlanData.push(item);
    });
    this.subs.sink = this.questionService
      .saveTemplateData(this.submitCarePlanData)
      .subscribe(
        (res: any) => {
          // this.Toaster.success('Data Saved Successfully');
        },
        err => {
          this.toaster.error(err.message, err.error || err.error);        }
      );
  }
  saveTemplate() {
    this.canEditTemplate = false;
    this.EditPlanModal.hide();
    this.getPatientTemplateByID(this.PatientId);
  }
  onChangeCheckBox(templateRecord: TemplateRecord, options: any, event) {}
  isChecked(templateRecord: TemplateRecord, options: any) {}

  activeNextTab() {
    this.activeTab = this.activeTab + 1;
    if (this.carePlanViewModel.length < this.activeTab) {
      this.activeTab = this.carePlanViewModel.length;
    }
    this.staticTabs.setActiveTab(this.activeTab);
    const tabs = this.staticTabs.getActive();
  }
  activePrevTab() {
    this.activeTab = this.activeTab - 1;
    if (this.activeTab < 1) {
      this.activeTab = 1;
    }
    this.staticTabs.setActiveTab(this.activeTab);
    const tabs = this.staticTabs.getActive();
  }

  recordSectionionTimeLog(action: number) {
    // 1: start , 2: stop , 0: pause
    if (action === 0) {
      if (this.SectionTimeLogData.length > 0) {
        this.SectionTimeLogData.forEach(timeLog => {
          if (timeLog.isRecording === true) {
            const previous = moment(timeLog.starttime, 'hh:mm:ss');
            const current = moment(this.currentTime(), 'hh:mm:ss');
            const result = moment.duration(current.diff(previous));
            timeLog.totalTime = moment(timeLog.totalTime, 'hh:mm:ss')
              .add(result)
              .format('hh:mm:ss');
            timeLog.starttime = this.currentTime();
            timeLog.isRecording = false;
          }
        });
        this.SectionTimeLogData.forEach(timeLog => {
          timeLog.stopTime = this.currentTime();
          timeLog.isRecording = false;
        });
      }
      if (this.staticTabs) {
        const myTab = this.staticTabs.tabs.find(tab => tab.active === true);
        this.tabChanged(myTab);
      }
    } else if (action === 1) {
      if (this.staticTabs) {
        const myTab = this.staticTabs.tabs.find(tab => tab.active === true);
        ///////// this code is for Pause /////////
        if (this.SectionTimeLogData.length > 0) {
          const wasPause = this.SectionTimeLogData.find(
            x => x.isRecording === true
          );
          if (!wasPause) {
            const isExist = this.SectionTimeLogData.find(
              section => section.category === myTab['heading']
            );
            if (isExist) {
              //   this.SectionTimeLogData.forEach(timeLog => {
              //     if (timeLog.category === isExist.category) {
              //       timeLog.isRecording = true;
              //       timeLog.stopTime = this.currentTime();
              //     }
              // });
            } else {
              this.SectionTimeLogData.push({
                category: myTab['heading'],
                starttime: this.currentTime(),
                stopTime: '00:00:00',
                isRecording: false,
                totalTime: '00:00:00'
              });
            }
          }
        }
        ///////// this code is for Pause /////////
        this.tabChanged(myTab);
      }
    } else if (action === 2) {
      let TimeLogString = 'Reviewed the following sections: . \n';
      this.SectionTimeLogData.forEach(timeLog => {
        if (timeLog.isRecording === true) {
          const previous = moment(timeLog.starttime, 'hh:mm:ss');
          const current = moment(this.currentTime(), 'hh:mm:ss');
          const result = moment.duration(current.diff(previous));
          timeLog.totalTime = moment(timeLog.totalTime, 'hh:mm:ss')
            .add(result)
            .format('hh:mm:ss');
          timeLog.starttime = this.currentTime();
          timeLog.isRecording = false;
        }
      });
      this.SectionTimeLogData.forEach(timeLog => {
        TimeLogString +=
          // 'Time spend on section ' +
          timeLog.category +
          // ' is ' +
          // moment(timeLog.totalTime, 'hh:mm:ss').minutes() +
          // ' min ' +
          // moment(timeLog.totalTime, 'hh:mm:ss').seconds() +
          // ' sec' +
          ' . \n';
      });
      this.SectionTimeLogData = new Array<{
        category: string;
        starttime: string;
        stopTime: string;
        isRecording: boolean;
        totalTime: string;
      }>();
      this.emitNoteValue.next(TimeLogString);
    }
  }

  tabChanged(event: any) {
    const isExist = this.SectionTimeLogData.find(
      section => section.category === event['heading']
    );
    if (isExist) {
      if (this.actionType === 0) {
      } else if (this.actionType === 1) {
        this.SectionTimeLogData.forEach(timeLog => {
          if (timeLog.isRecording === true) {
            const previous = moment(timeLog.starttime, 'hh:mm:ss');
            const current = moment(this.currentTime(), 'hh:mm:ss');
            const result = moment.duration(current.diff(previous));
            timeLog.totalTime = moment(timeLog.totalTime, 'hh:mm:ss')
              .add(result)
              .format('hh:mm:ss');
            timeLog.starttime = this.currentTime();
            timeLog.isRecording = false;
          }
        });
        this.SectionTimeLogData.forEach(timeLog => {
          if (timeLog.category === isExist.category) {
            timeLog.starttime = this.currentTime();
            timeLog.isRecording = true;
          }
        });
      }
    } else {
      if (this.SectionTimeLogData.length > 0) {
        this.SectionTimeLogData.forEach(timeLog => {
          if (timeLog.isRecording === true) {
            const previous = moment(timeLog.starttime, 'hh:mm:ss');
            const current = moment(this.currentTime(), 'hh:mm:ss');
            const result = moment.duration(current.diff(previous));
            timeLog.totalTime = moment(timeLog.totalTime, 'hh:mm:ss')
              .add(result)
              .format('hh:mm:ss');
            timeLog.stopTime = this.currentTime();
            timeLog.isRecording = false;
          }
        });
      }
      if (this.actionType === 1) {
        this.SectionTimeLogData.push({
          category: event['heading'],
          starttime: this.currentTime(),
          stopTime: '00:00:00',
          isRecording: true,
          totalTime: '00:00:00'
        });
      }
    }
  }

  currentTime() {
    const date = moment().format('hh:mm:ss');
    return date;
  }
  pauseTimer() {
    // clearInterval(this.myInterval);
    // this.myInterval = -1;
    // this.timerStart = false;
  }
  RearrangeCategory(questionList: Array<QuestionnaireDto>) {
    this.RearrangeCategoryId = 0;
    this.RearrangeCategoryId = questionList[0].questionCategoryId;
  }

  CloseReorderModal(action: number) {
    this.reOrderQuestions.hide();
    if (action === 1) {
      this.getPatientTemplateByID(this.PatientId);
    }
  }
}
