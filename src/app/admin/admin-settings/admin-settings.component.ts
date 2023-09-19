import { Component, OnInit, OnDestroy } from '@angular/core';
import { QuestionCategoryDto } from 'src/app/model/Questionnaire/Questionnire.model';
import { QuestionnaireService } from 'src/app/core/questionnaire.service';
import { ToastService } from 'ng-uikit-pro-standard';

import { DndDropEvent, DropEffect } from 'ngx-drag-drop';
import { SubSink } from 'src/app/SubSink';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss']
})
export class AdminSettingsComponent implements OnInit, OnDestroy {
  isLoading = false;
  categoryList = new Array<QuestionCategoryDto>();

  draggableListLeft = [
    {
      content: 'Left',
      effectAllowed: 'move',
      disable: false,
      handle: false,
    },
    {
      content: 'Lefter',
      effectAllowed: 'move',
      disable: false,
      handle: false,
    },
    {
      content: 'Leftest',
      effectAllowed: 'copyMove',
      disable: false,
      handle: false
    },
    {
      content: 'Lefty',
      effectAllowed: 'move',
      disable: false,
      handle: true,
    }
  ];

  draggableListRight = [
    {
      content: 'I was originally right',
      effectAllowed: 'move',
      disable: false,
      handle: false,
    }
  ];
  layout: any;
  horizontalLayoutActive = false;
  private currentDraggableEvent: DragEvent;
  private currentDragEffectMsg: string;
  private readonly verticalLayout = {
    container: 'row',
    list: 'column',
    dndHorizontal: false
  };
  private readonly horizontalLayout = {
    container: 'row',
    list: 'row',
    dndHorizontal: true
  };
  private subs = new SubSink();
  constructor(
    // private snackBarService: MatSnackBar ,
    private questionService: QuestionnaireService,
    private toaster: ToastService) {

    this.setHorizontalLayout( this.horizontalLayoutActive );
  }
  ngOnInit() {
    this.getCategoryList();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  getCategoryList() {
  this.subs.sink =  this.questionService.getCategoryList().subscribe(
      (res: any) => {
        this.categoryList = res;
        this.isLoading = false;
        // this.toaster.success('Question saved successfully');
      },
      error => {
        this.toaster.error(error.message, error.error || error.error);
      }
    );
  }

  setHorizontalLayout( horizontalLayoutActive: boolean ) {

    this.layout = (horizontalLayoutActive) ? this.horizontalLayout : this.verticalLayout;
  }

  onDragStart( event: DragEvent ) {

    this.currentDragEffectMsg = '';
    this.currentDraggableEvent = event;

    // this.snackBarService.dismiss();
    // this.snackBarService.open( 'Drag started!', undefined, {duration: 2000} );
  }

  onDragged( item: any, list: any[], effect: DropEffect ) {

    this.currentDragEffectMsg = `Drag ended with effect "${effect}"!`;

    if ( effect === 'move' ) {

      const index = list.indexOf( item );
      list.splice( index, 1 );
    }
  }

  onDragEnd( event: DragEvent ) {

    this.currentDraggableEvent = event;
    // this.snackBarService.dismiss();
    // this.snackBarService.open( this.currentDragEffectMsg || `Drag ended!`, undefined, {duration: 2000} );
  }

  onDrop( event: DndDropEvent, list?: any[] ) {

    if ( list
      && (event.dropEffect === 'copy'
        || event.dropEffect === 'move') ) {

      let index = event.index;

      if ( typeof index === 'undefined' ) {

        index = list.length;
      }

      list.splice( index, 0, event.data );
    }
  }
}
