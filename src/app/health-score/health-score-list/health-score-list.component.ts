import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastService } from "ng-uikit-pro-standard";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import {
  PHSFormQuestionOptionFlag,
  PHSFormQuestionType,
  PHSFormStatus,
} from "src/app/Enums/health-score.enum";
import { SubSink } from "src/app/SubSink";
import { PatientsService } from "src/app/core/Patient/patients.service";
import { AppUiService } from "src/app/core/app-ui.service";
import { DataFilterService } from "src/app/core/data-filter.service";
import { HealthScoreService } from "src/app/core/health-score.service";
import { LazyModalDto } from "src/app/model/AppModels/app.model";
import {
  DiagnosisDto,
  DiseaseOnServicesDto,
  SelectChronicDiseaseDto,
} from "src/app/model/Patient/patient.model";
import { HttpResError } from "src/app/model/common/http-response-error";
import {
  FilterPHSForm,
  PHSCareEpisodes,
} from "src/app/model/health-score/health-score.model";
import { TwoCModulesEnum } from "src/app/model/productivity.model";

@Component({
  selector: "app-health-score-list",
  templateUrl: "./health-score-list.component.html",
  styleUrls: ["./health-score-list.component.scss"],
})
export class HealthScoreListComponent implements OnInit {
  phsFormQuestionTypeEnumList =
    this.filterDataService.getEnumAsList(PHSFormQuestionType);
  phsFormQuestionOptionFlagEnumList = this.filterDataService.getEnumAsList(
    PHSFormQuestionOptionFlag
  );
  twoCModulesEnumList = this.filterDataService.getEnumAsList(TwoCModulesEnum);
  phsFormQuestionTypeEnum = PHSFormQuestionType;
  phdFormQuestionOptionFlag = PHSFormQuestionOptionFlag;
  LoadingData: boolean;
  private subs = new SubSink();
  cronicDiseaseList = new Array<{ id: 0; desc: ""; detail: "" }>();
  filterPHSFormDto = new FilterPHSForm();
  phsFormsList = new Array<any>();
  phsCareEpisodesList = new Array<PHSCareEpisodes>();
  phsFormStatusEnum = PHSFormStatus;
  isLoadingForms: boolean;
  tempPHSFormsList= new Array<any>();
  searchFormParam = '';

  constructor(
    private toaster: ToastService,
    private healthScoreService: HealthScoreService,
    private filterDataService: DataFilterService,
    private patientsService: PatientsService,
    private appUi: AppUiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.twoCModulesEnumList = this.twoCModulesEnumList.filter(
      (service) =>
        service.value != TwoCModulesEnum.TCM &&
        service.value != TwoCModulesEnum.PrCM
    );
    this.getCronicDiseases();
    this.getAllPHSForms();
    this.getPHSCareEpisodes();
  }

  getCronicDiseases() {
    this.subs.sink = this.patientsService.getDiseaseCategories().subscribe(
      (res: any) => {
        this.cronicDiseaseList = res;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  getAllPHSForms() {
    this.isLoadingForms = true;
    this.healthScoreService.getAllPHSFormsgetAllPHSForms(this.filterPHSFormDto).subscribe(
      (res: any) => {
        this.phsFormsList = res;
        this.tempPHSFormsList = res;
        this.isLoadingForms = false;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
        this.isLoadingForms = false;
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
  deletePHSForm(formId) {
    this.healthScoreService.deletePHSForm(formId).subscribe(
      (res: any) => {
        this.toaster.success("Form Deleted Successfully");
        this.getAllPHSForms();
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
      }
    );
  }
  openConfirmModal(formId) {
    const modalDto1 = new LazyModalDto();
    modalDto1.Title = "Confirmation";
    modalDto1.Text = `Are you sure you want to delete the form?`;
    modalDto1.callBack = this.callBackBhi;
    modalDto1.rejectCallBack = this.rejectCallBackBhi;
    this.appUi.openLazyConfrimModal(modalDto1);
    modalDto1.data = formId;
  }
  rejectCallBackBhi = () => {};
  callBackBhi = (formId) => {
    this.deletePHSForm(formId);
  };
  navigateToFormDetails(formId) {
    this.router.navigate(["/health-score/form"], {
      queryParams: { id: formId },
    });
  }
  addChange(cValue, type){
    console.log(cValue)
    if(type == 'modules'){
      if(cValue === ''){
        this.filterPHSFormDto.moduleIds = [''];
      }
    }
    if(type == 'episodes'){
      if(cValue === ''){
        this.filterPHSFormDto.careEpisodeIds = [''];
      }
    }
    this.getAllPHSForms();
  }
  removeChange(cValue){
    this.getAllPHSForms();
  }
  changeFilter(values, type){ 
    if(type == 'modules'){
      if (values && values.length) {
        if (values.length > 1 && values.includes("")) {
          this.filterPHSFormDto.moduleIds = values.filter((x) => x !== "");
        }
      }
    }
    if(type == 'episodes'){
      if (values && values.length) {
        if (values.length > 1 && values.includes("")) {
          this.filterPHSFormDto.careEpisodeIds = values.filter((x) => x !== "");
        }
      }
    }
  }
  filterForms(event) {
    const val = event.toLowerCase();
    const temp = this.tempPHSFormsList.filter((phsForm) => {
      return (
        phsForm.title.toLocaleLowerCase().indexOf(val) !== -1 ||
        !val
      );
    });
    this.phsFormsList = temp;
  }
}
