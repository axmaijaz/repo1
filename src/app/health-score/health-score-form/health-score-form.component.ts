import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ToastService } from "ng-uikit-pro-standard";
import { Subject } from "rxjs";
import { debounceTime, map } from "rxjs/operators";
import {
  PHSFormQuestionOptionFlag,
  PHSFormQuestionType,
  PHSFormStatus,
} from "src/app/Enums/health-score.enum";
import { SubSink } from "src/app/SubSink";
import { PatientsService } from "src/app/core/Patient/patients.service";
import { DataFilterService } from "src/app/core/data-filter.service";
import { HealthScoreService } from "src/app/core/health-score.service";
import {
  DiagnosisDto,
  DiseaseOnServicesDto,
  SelectChronicDiseaseDto,
} from "src/app/model/Patient/patient.model";
import { HttpResError } from "src/app/model/common/http-response-error";
import { TwoCModulesEnum } from "src/app/model/productivity.model";
import { Location } from "@angular/common";
import {
  AddEditPHSForm,
  AddEditPHSFormQuestion,
  AddEditPHSFormQuestionOption,
  PHSCareEpisodes,
} from "src/app/model/health-score/health-score.model";
import moment from "moment";
import { ActivatedRoute } from "@angular/router";
import { LazyModalDto } from "src/app/model/AppModels/app.model";
import { AppUiService } from "src/app/core/app-ui.service";
let that;
@Component({
  selector: "app-health-score-form",
  templateUrl: "./health-score-form.component.html",
  styleUrls: ["./health-score-form.component.scss"],
})
export class HealthScoreFormComponent implements OnInit {
  phsFormQuestionTypeEnumList =
    this.filterDataService.getEnumAsList(PHSFormQuestionType);
  phsFormQuestionOptionFlagEnumList = this.filterDataService.getEnumAsList(
    PHSFormQuestionOptionFlag
  );
  twoCModulesEnumList = this.filterDataService.getEnumAsList(TwoCModulesEnum);
  phsFormQuestionTypeEnum = PHSFormQuestionType;
  phdFormQuestionOptionFlag = PHSFormQuestionOptionFlag;
  questionType: any;
  newQuestion = [];
  addEditPHSFormDto = new AddEditPHSForm();
  addEditPHSFormQuestionDto = new AddEditPHSFormQuestion();
  addEditPHSFormQuestionOptionDto = new AddEditPHSFormQuestionOption();
  addEditPHSFormQuestionsList = new Array<AddEditPHSFormQuestion>();
  phsCareEpisodesList = new Array<PHSCareEpisodes>();
  phsFormStatusEnum = PHSFormStatus;
  selectedCronicDisease = {
    code: "",
    detail: "",
  };
  searchWatch = new Subject<string>();
  searchParam = "";
  LoadingData: boolean;
  chronicDiseasesByUrl = new Array<{ code: string; detail: string }>();
  private subs = new SubSink();
  selectItem = new SelectChronicDiseaseDto();
  diagnose = new DiagnosisDto();
  isIcdCodeExist: boolean;
  diseaseOnServicesDto = new DiseaseOnServicesDto();
  cronicDiseaseList = new Array<{ id: 0; desc: ""; detail: "" }>();
  showAddQuestionTab = false;
  showAddAnswerTab = false;
  phsQuestionOptionsList= new Array<AddEditPHSFormQuestionOption>();
  selectedFormId: number;
  constructor(
    private toaster: ToastService,
    private healthScoreService: HealthScoreService,
    private filterDataService: DataFilterService,
    private patientsService: PatientsService,
    private location: Location,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private appUi: AppUiService,
  ) {}

  ngOnInit(): void {
    this.phsFormQuestionTypeEnum["Yes/No"]
    this.selectedFormId = +this.route.snapshot.queryParamMap.get('id');
    if(this.selectedFormId){
      this.getPHSFormById()
    }
    this.twoCModulesEnumList = this.twoCModulesEnumList.filter(
      (service) =>
        service.value != TwoCModulesEnum.TCM &&
        service.value != TwoCModulesEnum.PrCM
    );
    this.questionType;
    this.getCronicDiseases();
    this.getPHSCareEpisodes();
  }
  QuestionType(questionType) {
    console.log(this.questionType);
  }
  removeQuestion(qbox) {
    this.newQuestion.splice(qbox);
  }
  getCronicDiseases() {
    this.subs.sink = this.patientsService.getChronicConditions().subscribe(
      (res: any) => {
        this.cronicDiseaseList = res;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  navigateBack() {
    this.location.back();
  }
  addEditPHSForm() {
    if (this.addEditPHSFormDto.status == PHSFormStatus.Published) {
      this.addEditPHSFormDto.publishedDate = moment().format();
    }
    const separator = ", ";
    if(this.addEditPHSFormDto.moduleIds.length){
      this.addEditPHSFormDto.moduleIds =
        this.addEditPHSFormDto.moduleIds.join(separator);
    }
    this.healthScoreService.addEditPHSForm(this.addEditPHSFormDto).subscribe(
      (res: any) => {
        this.addEditPHSFormDto = res;
        this.addEditPHSFormDto.chronicConditionIds = res.chronicConditions.map(x => x.id)
        this.addEditPHSFormDto.phsCareEpisodeIds = res.phsCareEpisodes.map(x => x.id)
        this.addEditPHSFormDto.chronicConditionIds = [...this.addEditPHSFormDto.chronicConditionIds];
        this.addEditPHSFormDto.phsCareEpisodeIds = [...this.addEditPHSFormDto.phsCareEpisodeIds];
        var moduleIdsInStr = res.moduleIds.split(',');
        this.addEditPHSFormDto.moduleIds = moduleIdsInStr.map(str => {return Number(str)});
        this.addEditPHSFormDto.moduleIds = [...this.addEditPHSFormDto.moduleIds];
        this.toaster.success("PHS Form Created Successfully");
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
      }
    );
  }
  getPHSCareEpisodes() {
    this.healthScoreService.phsCareEpisodes().subscribe(
      (res: any) => {
        this.phsCareEpisodesList = res;
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
      }
    );
  }
  getPHSFormById() {
    this.healthScoreService.getPHSForm(this.selectedFormId).subscribe(
      (res: any) => {
      this.addEditPHSFormDto.title = res.title;
      this.addEditPHSFormDto.id = res.id;
      this.addEditPHSFormDto.status = res.status;
      this.addEditPHSFormDto.chronicConditionIds = res.chronicConditions.map(x => x.id)
      this.addEditPHSFormDto.phsCareEpisodeIds = res.phsCareEpisodes.map(x => x.id)
      this.addEditPHSFormDto.chronicConditionIds = [...this.addEditPHSFormDto.chronicConditionIds];
      this.addEditPHSFormDto.phsCareEpisodeIds = [...this.addEditPHSFormDto.phsCareEpisodeIds];
      var moduleIdsInStr = res.moduleIds.split(',');
      this.addEditPHSFormDto.moduleIds = moduleIdsInStr.map(str => {return Number(str)});
      this.addEditPHSFormDto.moduleIds = [...this.addEditPHSFormDto.moduleIds];
      this.addEditPHSFormDto.phsFormQuestions = res.phsFormQuestions;
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
      }
    );
  }
  saveQuestion(process){
    this.addEditPHSFormQuestionDto.phsFormId = this.addEditPHSFormDto.id;
    this.healthScoreService.addEditPHSFormQuestion(this.addEditPHSFormQuestionDto).subscribe((res: AddEditPHSFormQuestion) => {
      this.addEditPHSFormQuestionDto = res;
      if(this.addEditPHSFormDto.phsFormQuestions == null){
        this.addEditPHSFormDto.phsFormQuestions = [];
      }
      if(process== 'add'){
        this.addEditPHSFormDto.phsFormQuestions.push(this.addEditPHSFormQuestionDto);
      }
      this.toaster.success('Question Updated')
    },
      (err: HttpResError) => {
        this.toaster.error(err.error);
      })
  }
  getPHSFormQuestion(){
    this.healthScoreService.phsFormQuestionById(this.addEditPHSFormDto.id).subscribe((res: any) => {
      // this.addEditPHSFormQuestionsList = res;
    },
      (err: HttpResError) => {
        this.toaster.error(err.error);
      })
  }
  saveQuestionOption(questionOption?){
    if(questionOption || questionOption.id){
      this.addEditPHSFormQuestionOptionDto = questionOption;
    }
    this.addEditPHSFormQuestionOptionDto.phsFormQuestionId = this.addEditPHSFormQuestionDto.id;
    this.healthScoreService.addEditPHSFormQuestionOption(this.addEditPHSFormQuestionOptionDto).subscribe((res: any) => {
      if(!questionOption.id){
        this.addEditPHSFormQuestionOptionDto = res;
      }
      var selectedQuestion = this.addEditPHSFormDto.phsFormQuestions.find((question) => question.id == res.phsFormQuestionId)
      if(selectedQuestion.phsFormQuestionOptions == null){
        selectedQuestion.phsFormQuestionOptions = []
      }
      this.phsQuestionOptionsList.push(this.addEditPHSFormQuestionOptionDto);
      selectedQuestion.phsFormQuestionOptions.push(this.addEditPHSFormQuestionOptionDto);
      this.addEditPHSFormQuestionOptionDto = new AddEditPHSFormQuestionOption();
      this.toaster.success('Option Updated')
    },
    (err: HttpResError) => {
      this.toaster.error(err.error);
    })
  }
  fillQuestionOptionType(question: AddEditPHSFormQuestion){
    this.phsFormQuestionOptionBy(question.id);
    this.addEditPHSFormQuestionDto = question;
    this.addEditPHSFormQuestionOptionDto.phsFormQuestionId = question.id;
    this.addEditPHSFormQuestionOptionDto.questionType = question.questionType;
    this.showAddQuestionTab = true;
  }
  phsFormQuestionOptionBy(questionId){
    this.healthScoreService.phsFormQuestionOptionsByQuestionId(questionId).subscribe((res: any) => {
      this.phsQuestionOptionsList = res;
    },
    (err: HttpResError) => {
      this.toaster.error(err.error);
    })
  }
  resetValues(){
    this.showAddQuestionTab = false;
    this.showAddAnswerTab = false;
    this.addEditPHSFormQuestionDto = new AddEditPHSFormQuestion();
    this.addEditPHSFormQuestionOptionDto = new AddEditPHSFormQuestionOption();
    this.phsQuestionOptionsList = new Array<AddEditPHSFormQuestionOption>();
  }
  deletePHSFormQuestionOption(questionOptionId){
    this.healthScoreService.deletePHSFormQuestionOption(questionOptionId).subscribe((res: any) => {
      this.toaster.success('Option Deleted');
      this.phsQuestionOptionsList =  this.phsQuestionOptionsList.filter(option => option.id != questionOptionId)
    },
    (err: HttpResError) => {
      this.toaster.error(err.error);
    })
  }
  openConfirmModal(optionId) {
    const modalDto1 = new LazyModalDto();
    modalDto1.Title = "Confirmation";
    modalDto1.Text = `Are you sure you want to delete the option?`;
    modalDto1.callBack = this.callBackBhi;
    modalDto1.rejectCallBack = this.rejectCallBackBhi;
    this.appUi.openLazyConfrimModal(modalDto1);
    modalDto1.data = optionId;
  }
  rejectCallBackBhi = () => {};
  callBackBhi = (optionId) => {
    this.deletePHSFormQuestionOption(optionId);
  };
}
