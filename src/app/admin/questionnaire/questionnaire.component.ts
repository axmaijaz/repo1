import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  EventEmitter,
  Output,
  Input,
  OnDestroy
} from '@angular/core';
import {
  QuestionnaireDto,
  QuestionCategoryDto,
  CpQuestionOptions
} from 'src/app/model/Questionnaire/Questionnire.model';
import { QuestionnaireService } from 'src/app/core/questionnaire.service';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { Disease } from 'src/app/model/admin/disease.model';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { QuestionType } from 'src/app/Enums/questionType.enum';
import { AppUiService } from 'src/app/core/app-ui.service';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { SubSink } from 'src/app/SubSink';
import { DndDropEvent, DropEffect } from 'ngx-drag-drop';

@Component({
  selector: "app-questionnaire",
  templateUrl: "./questionnaire.component.html",
  styleUrls: ["./questionnaire.component.scss"]
})
export class QuestionnaireComponent
  implements OnInit, AfterViewInit, OnDestroy {
  private subs = new SubSink();
  model: any = {};
  @Output() public AddQuestionEmitter = new EventEmitter();
  @Input() public IsTemplateEditing = false;
  @ViewChild('reOrderQuestions') reOrderQuestions: ModalDirective; 
  selectedDisease: number;
  isLoading = true;
  ParentCatId = 1;
  isEditingQuestion = false;
  isAddingCategory = false;
  newCategory = "";
  newOption = "";
  searchDisease = "";
  questionTypeEnum = QuestionType;
  cpQuestionOptions = new Array<CpQuestionOptions>();
  rows = new Array<QuestionnaireDto>();
  categoryList = new Array<QuestionCategoryDto>();
  ParentCategoryList = new Array<QuestionCategoryDto>();
  diseaseList = new Array<Disease>();
  my = true;
  newQuestion = new QuestionnaireDto();
  @ViewChild(DatatableComponent) table: DatatableComponent;
  temp = [];
  selected = [];
  findQuestionWithDisease: number;
  draggableConf = {
    // note that data is handled with JSON.stringify/JSON.parse
    // only set simple data or POJO's as methods will be lost
    data: "myDragData",
    effectAllowed: "all",
    disable: false,
    handle: true
  };

  draggableListLeft = [
    {
      content: "Left",
      effectAllowed: "move",
      disable: false,
      handle: false
    },
    {
      content: "Lefter",
      effectAllowed: "move",
      disable: false,
      handle: false
    },
    {
      content: "Leftest",
      effectAllowed: "copyMove",
      disable: false,
      handle: false
    },
    {
      content: "Lefty",
      effectAllowed: "move",
      disable: false,
      handle: true
    }
  ];

  draggableListRight = [
    {
      content: "I was originally right",
      effectAllowed: "move",
      disable: false,
      handle: false
    }
  ];
  layout: any;
  horizontalLayoutActive = false;
  private currentDraggableEvent: DragEvent;
  private currentDragEffectMsg: string;
  private readonly verticalLayout = {
    container: "row",
    list: "column",
    dndHorizontal: false
  };
  private readonly horizontalLayout = {
    container: "row",
    list: "row",
    dndHorizontal: true
  };
  questionsListByDisease: any;
  QuestionList: any;
  constructor(
    private questionService: QuestionnaireService,
    private appUi: AppUiService,
    private toaster: ToastService
  ) {
    this.setHorizontalLayout(this.horizontalLayoutActive);
  }

  ngAfterViewInit() {
    const rightRowCells = document.getElementsByClassName(
      "datatable-row-right"
    );
    rightRowCells[0].setAttribute(
      "style",
      "transform: translate3d(-17px, 0px, 0px)"
    );
  }

  ngOnInit() {
    this.subs.sink = this.questionService.getCCMDiseases().subscribe(
      (res: any) => {
        this.diseaseList = res;
      },
      err => {}
    );
    this.subs.sink = this.questionService.getCategoryList().subscribe(
      (res: any) => {
        this.categoryList = res;
        this.isLoading = false;
        // this.toaster.success('Question saved successfully');
      },
      err => {
        this.toaster.error(err.message, err.error || err.error);
      }
    );
    this.subs.sink = this.questionService.getParentCategoryList().subscribe(
      (res: any) => {
        this.ParentCategoryList = res;
        this.isLoading = false;
        // this.toaster.success('Question saved successfully');
      },
      err => {
        this.toaster.error(err.message, err.error || err.error);
      }
    );
    this.getQuestions(this.selectedDisease, false);
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  // getFilterDisease(searchParms: string) {
  //   if (searchParms.length > 3) {
  //     this.subs.sink = this.questionService.getFilterDiseaseList(searchParms).subscribe(
  //       (res: any) => {
  //         this.diseaseList = res;
  //       },
  //       err => {
  //       }
  //     );
  //   }
  // }
  getQuestions(diseaseId: number, check: boolean) {
    this.isLoading = true;
    this.subs.sink = this.questionService.getQuestionsList(diseaseId).subscribe(
      (res: any) => {
        if (!check) {
          this.rows = res;
          this.temp = res;
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.questionsListByDisease = res;
        }
      },
      err => {
        this.isLoading = false;
      }
    );
  }
  RemoveOption(optIndex) {
    this.cpQuestionOptions.splice(optIndex, 1);
  }
  addNewOption() {
    const newOptdata = new CpQuestionOptions();
    newOptdata.id = 0;
    newOptdata.text = this.newOption;
    this.cpQuestionOptions.push(newOptdata);
    this.newOption = "";
  }
  addingNew() {
    this.isEditingQuestion = false;
    this.newQuestion = new QuestionnaireDto();
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function(d) {
      return d.question.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  editQuestion(row: QuestionnaireDto) {
    this.cpQuestionOptions = new Array<CpQuestionOptions>();
    this.isEditingQuestion = true;
    Object.assign(this.newQuestion, row);
    if (this.newQuestion.questionOptions && this.newQuestion.questionType > 2) {
      let optArray = this.newQuestion.questionOptions.split(",");
      optArray = optArray.filter(x => x !== "");
      if (optArray.length > 0) {
        optArray.forEach(item => {
          const newOptdata = new CpQuestionOptions();
          newOptdata.id = 0;
          newOptdata.text = item;
          this.cpQuestionOptions.push(newOptdata);
        });
      }
    }
  }
  addNewQuestion() {
    if (this.newQuestion.questionType > 2) {
      this.newQuestion.questionOptions = "";
      this.cpQuestionOptions.forEach(element => {
        this.newQuestion.questionOptions += element.text + ",";
      });
    }
    this.cpQuestionOptions = new Array<CpQuestionOptions>();
    this.subs.sink = this.questionService
      .addQuestion(this.newQuestion)
      .subscribe(
        (res: any) => {
          this.newQuestion = new QuestionnaireDto();
          // this.rows = res;
          this.toaster.success("Question saved successfully");
          this.getQuestions(null, false);
        },
        err => {
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }
  addNewCategory() {
    this.subs.sink = this.questionService
      .addCategory(this.newCategory, this.ParentCatId)
      .subscribe(
        (res: any) => {
          this.ParentCatId = null;
          this.newCategory = "";
          this.categoryList.push(res);
          this.newQuestion.questionCategoryId = res.id;
        },
        err => {
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }
  displayCheck(row) {
    return row.name !== "Ethel Price";
  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  AddquestionToTemplate() {
    this.AddQuestionEmitter.emit(this.selected);
    this.selected = [];
  }
  deleteQuestion(id: number) {
    // if (confirm('Do you want to delete this Question?')) {
    this.subs.sink = this.questionService.deleteQuestion(id).subscribe(
      (res: any) => {
        this.getQuestions(null, false);
      },
      err => {}
    );
    // }
  }
  openConfirmModal(id: number) {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Delete Questionnaire";
    modalDto.Text = "Do you want to delete this Question?";
    modalDto.callBack = this.callBack;
    modalDto.data = id;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack = (data: any) => {
    this.deleteQuestion(data);
  };
  discardChanges() {
    // this.reOrderQuestions.hide();
  }

  setHorizontalLayout(horizontalLayoutActive: boolean) {
    this.layout = horizontalLayoutActive
      ? this.horizontalLayout
      : this.verticalLayout;
  }

  onDragStart(event: DragEvent) {
    this.currentDragEffectMsg = "";
    this.currentDraggableEvent = event;

    // this.snackBarService.dismiss();
    // this.snackBarService.open( 'Drag started!', undefined, {duration: 2000} );
  }

  onDragged(item: any, list: any[], effect: DropEffect) {
    this.currentDragEffectMsg = `Drag ended with effect "${effect}"!`;

    if (effect === "move") {
      const index = list.indexOf(item);
      list.splice(index, 1);
    }
  }

  onDragEnd(event: DragEvent) {
    this.currentDraggableEvent = event;
    // this.snackBarService.dismiss();
    // this.snackBarService.open( this.currentDragEffectMsg || `Drag ended!`, undefined, {duration: 2000} );
  }

  onDrop(event: DndDropEvent, list?: any[]) {
    if (list && (event.dropEffect === "copy" || event.dropEffect === "move")) {
      let index = event.index;

      if (typeof index === "undefined") {
        index = list.length;
      }

      list.splice(index, 0, event.data);
    }
  } 
  SaveQuestionOrder() {
    const NewOrders = new Array<{ questionId: number; newOrder: number }>();
    this.questionsListByDisease.forEach((item, index, arr) => {
      const Question = {
        questionId: item.id,
        newOrder: index + 1
      };
      NewOrders.push(Question);
    });
    this.subs.sink = this.questionService.questionsOrderChange(NewOrders).subscribe(
      (res: any) => {
        this.reOrderQuestions.hide();
        this.findQuestionWithDisease = null;
        this.questionsListByDisease = res;
        this.isLoading = false;
        // this.toaster.success('Question saved successfully');
      },
      err => {
        this.toaster.error(err.message, err.error || err.error);
      }
    );
  }
}
