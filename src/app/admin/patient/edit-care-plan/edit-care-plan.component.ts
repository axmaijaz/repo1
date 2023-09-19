import { Component, OnInit, ViewChild, EventEmitter, Output, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionnaireService } from 'src/app/core/questionnaire.service';
import { QuestionnaireDto, CarePlanViewModel, QuestionCategoryDto, CpQuestionOptions } from 'src/app/model/Questionnaire/Questionnire.model';
import { DataFilterService } from 'src/app/core/data-filter.service';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { Disease } from 'src/app/model/admin/disease.model';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { AppUiService } from 'src/app/core/app-ui.service';
import { SubSink } from 'src/app/SubSink';

@Component({
  selector: "app-edit-care-plan",
  templateUrl: "./edit-care-plan.component.html",
  styleUrls: ["./edit-care-plan.component.scss"]
})
export class EditCarePlanComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  isLoading = false;
  PatientId: number;
  PatientTemplate: any;
  @Output() public SaveTemplate = new EventEmitter();
  @ViewChild("AddorEditQuestion") EditPlanModal: ModalDirective;
  newQuestion = new QuestionnaireDto();
  diseaseList = new Array<Disease>();
  newCategory = "";
  newOption = "";
  categoryList = new Array<QuestionCategoryDto>();
  isEditingQuestion = false;
  isAddingCategory = false;
  questionList = new Array<QuestionnaireDto>();
  carePlanViewModel = new Array<CarePlanViewModel>();
  AddEditQuestionTemp = {
    questionIndex: 0,
    categoryIndex: 0,
    question: new QuestionnaireDto()
  };
  isSavingTemplate = false;

  constructor(
    private toaster: ToastService,
    private route: ActivatedRoute,
    private appUi: AppUiService,
    private questionService: QuestionnaireService,
    private filterDataService: DataFilterService
  ) {}

  ngOnInit() {
    this.PatientId = +this.route.snapshot.paramMap.get("id");
    if (!this.PatientId) {
      this.PatientId = +this.route.pathFromRoot[3].snapshot.paramMap.get("id");
    }
    this.getPatientTemplate(this.PatientId);
    // this.questionService.getFilterDiseaseList('').subscribe((res: any) => {
    //   this.diseaseList = res;
    // }, err => {
    //   console.log(err);
    // });
    this.subs.sink = this.questionService.getCategoryList().subscribe(
      (res: any) => {
        res.find(x => x.section.fontsize(7));
        this.categoryList = res;
      },
      err => {}
    );
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  getPatientTemplate(id: number) {
    this.isLoading = true;
    this.carePlanViewModel = new Array<CarePlanViewModel>();
    this.subs.sink = this.questionService.getPatientTemplate(id).subscribe(
      (res: any) => {
        this.isLoading = false;
        if (res) {
          this.PatientTemplate = res;
          // this.questionList = res.carePlanQuestionnaires;
          this.carePlanViewModel = this.filterDataService.ArrayGroupBy(
            res.carePlanQuestionnaires,
            "questionCatName"
          );
        }
      },
      error => {
        this.isLoading = false;
      }
    );
  }
  removeQuestion(
    question: any,
    carePlanModel: CarePlanViewModel,
    questionIndex: number,
    categoryIndex: number
  ) {
    const item = this.carePlanViewModel[categoryIndex].value.splice(
      questionIndex,
      1
    );
  }
  DeleteQuestion(question: any) {
    if (question.id) {
      this.subs.sink = this.questionService
        .RemoveQuestion(question.id)
        .subscribe(
          x => {
            this.getPatientTemplate(this.PatientId);
            this.toaster.success("Changes saved successfully");
          },
          err => {
            this.toaster.error(err.message, err.error || err.error);
          }
        );
    }
  }
  openConfirmModal(data: any) {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Delete Question";
    modalDto.Text =
      "Do you want to delete this question and its relevent data ?";
    modalDto.callBack = this.callBack;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack = (data: any) => {
    this.DeleteQuestion(data);
  };
  editQuestion(
    question: any,
    carePlanModel: CarePlanViewModel,
    questionIndex: number,
    categoryIndex: number
  ) {
    this.isEditingQuestion = true;
    this.AddEditQuestionTemp.question = question;
    this.AddEditQuestionTemp.questionIndex = questionIndex;
    this.AddEditQuestionTemp.categoryIndex = categoryIndex;
    Object.assign(this.newQuestion, question);
    this.EditPlanModal.show();
    // const item = this.carePlanViewModel[categoryIndex].value.splice(questionIndex, 1);
  }
  saveTemplate() {
    this.isSavingTemplate = true;
    this.PatientTemplate.carePlanQuestionnaires = [];
    this.carePlanViewModel.forEach(element => {
      element.value.forEach(element1 => {
        this.PatientTemplate.carePlanQuestionnaires.push(element1);
      });
    });
    this.subs.sink = this.questionService
      .createPatientTemplate(this.PatientTemplate)
      .subscribe(
        x => {
          this.isSavingTemplate = false;
          this.SaveTemplate.emit();
          this.toaster.success("Template saved successfully");
        },
        err => {
          this.isSavingTemplate = false;
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }
  addEditNewQuestion() {
    this.subs.sink = this.questionService
      .EditTemplateQuestion(this.newQuestion)
      .subscribe(
        (res: any) => {
          this.toaster.success("Changes Saved Successfully");
          this.getPatientTemplate(this.PatientId);
          this.newQuestion = new QuestionnaireDto();
        },
        err => {
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }
  AddingNewQuestion() {
    this.isEditingQuestion = false;
    this.AddEditQuestionTemp = {
      questionIndex: 0,
      categoryIndex: 0,
      question: new QuestionnaireDto()
    };
    this.newQuestion.carePlanTemplateId = this.PatientTemplate.id;
    this.EditPlanModal.show();
  }
  // addNewCategory() {
  //   this.subs.sink = this.questionService.addCategory(this.newCategory, Parentcat).subscribe((res: any) => {
  //     this.newCategory = '';
  //     this.categoryList.push(res);
  //     this.newQuestion.questionCategoryId = res.id;
  //     this.toaster.success('Category Added Successfully');
  //   }, err => {
  //   });
  // }
  RemoveOption(optIndex) {
    this.newQuestion.cpQuestionOptions.splice(optIndex, 1);
  }
  addNewOption() {
    const newOptdata = new CpQuestionOptions();
    newOptdata.id = 0;
    newOptdata.text = this.newOption;
    this.newQuestion.cpQuestionOptions.push(newOptdata);
    this.newOption = "";
  }
  AddQuestionTotemplateData(QuestionList: QuestionnaireDto[]) {
    if (this.PatientTemplate && this.PatientTemplate.id > 0) {
      QuestionList.forEach(item => {
        // item.id = 0;
        item.carePlanTemplateId = this.PatientTemplate.id;
      });
      this.subs.sink = this.questionService
        .AddCPQuestionnairesFromQuestionnaresList(QuestionList)
        .subscribe(
          (res: any) => {
            this.toaster.success("Changes Saved Successfully");
            this.getPatientTemplate(this.PatientId);
            this.newQuestion = new QuestionnaireDto();
          },
          err => {
            this.toaster.error(err.message, err.error || err.error);
          }
        );
    } else if (this.PatientTemplate && this.PatientTemplate.id === 0) {
      QuestionList.forEach(item => {
        item.id = 0;
        Object.assign(this.newQuestion, item);
        this.addQuestionTotemplate();
      });
    }
  }
  addQuestionTotemplate() {
    this.newQuestion.questionCatName = this.categoryList.find(
      x => x.id === this.newQuestion.questionCategoryId
    ).name;
    this.PatientTemplate.carePlanQuestionnaires.push(this.newQuestion);
    this.newQuestion = new QuestionnaireDto();
    this.carePlanViewModel = new Array<CarePlanViewModel>();
    this.carePlanViewModel = this.filterDataService.ArrayGroupBy(
      this.PatientTemplate.carePlanQuestionnaires,
      "questionCatName"
    );
  }
}
