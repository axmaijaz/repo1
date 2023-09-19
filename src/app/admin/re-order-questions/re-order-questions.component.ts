import { Component, OnInit, SimpleChanges, OnChanges, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { QuestionCategoryDto, QuestionnaireDto } from 'src/app/model/Questionnaire/Questionnire.model';
import { QuestionnaireService } from 'src/app/core/questionnaire.service';
import { ToastService } from 'ng-uikit-pro-standard';

import { DndDropEvent, DropEffect } from 'ngx-drag-drop';
import { SubSink } from 'src/app/SubSink';

@Component({
  selector: "app-re-order-questions",
  templateUrl: "./re-order-questions.component.html",
  styleUrls: ["./re-order-questions.component.scss"]
})
export class ReOrderQuestionsComponent implements OnInit, OnChanges, OnDestroy {
  private subs = new SubSink();
  @Input() CategoryId: number;
  @Input() CarePLanId: number;
  @Output() public closeModal = new EventEmitter<number>(); // 1 for close and reload and 2 for just close
  CategoryIdCheck: number;
  isLoading = false;
  QuestionList = new Array<QuestionnaireDto>();
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

  constructor(
    // private snackBarService: MatSnackBar ,
    private questionService: QuestionnaireService,
    private toaster: ToastService
  ) {
    this.setHorizontalLayout(this.horizontalLayoutActive);
  }
  ngOnInit() {
    // this.getCategoryList();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.CategoryId &&
      this.CategoryId > 0 &&
      this.CategoryIdCheck !== this.CategoryId
    ) {
      this.CategoryIdCheck = this.CategoryId;
      this.getQuestionListByCategory();
    }
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  getQuestionListByCategory() {
    this.isLoading = true;
    this.subs.sink = this.questionService
      .getQuestionListByCategoryId(this.CarePLanId, this.CategoryId)
      .subscribe(
        (res: any) => {
          this.QuestionList = res;
          this.isLoading = false;
          // this.toaster.success('Question saved successfully');
        },
        err => {
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }
  SaveQuestionOrder() {
    const NewOrders = new Array<{ questionId: number; newOrder: number }>();
    this.QuestionList.forEach((item, index, arr) => {
      const Question = {
        questionId: item.id,
        newOrder: index + 1
      };
      NewOrders.push(Question);
    });
    this.subs.sink = this.questionService.SaveQuestionsOrder(NewOrders).subscribe(
      (res: any) => {
        this.closeModal.emit(1);
        this.QuestionList = res;
        this.isLoading = false;
        // this.toaster.success('Question saved successfully');
      },
      err => {
        this.toaster.error(err.message, err.error || err.error);
      }
    );
  }
  discardChanges() {
    this.closeModal.emit(2);
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
}
