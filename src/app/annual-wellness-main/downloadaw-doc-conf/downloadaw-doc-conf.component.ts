import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { DndDropEvent, DropEffect } from 'ngx-drag-drop';
import { FacilityFormsDto } from 'src/app/model/Facility/facility.model';

@Component({
  selector: 'app-downloadaw-doc-conf',
  templateUrl: './downloadaw-doc-conf.component.html',
  styleUrls: ['./downloadaw-doc-conf.component.scss']
})
export class DownloadawDocConfComponent implements OnInit {
  isLoadingData: boolean;
  private currentDraggableEvent: DragEvent;
  private currentDragEffectMsg: string;
  itemsList = [];
  @Input() facilityFormsDto: FacilityFormsDto;
  @Input() patientFormsDto: FacilityFormsDto;
  @Output() proceedDownLoad: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('downloadDocumentsModal') downloadDocumentsModal: ModalDirective;
  constructor(private toaster: ToastService) { }

  ngOnInit() {
  }
  resetData() {
    this.itemsList = [
      { label: 'Annual Wellness', order: 1, checked: false, formType: FormsTypeEnum.AnnualWellnes }
    ];
    if (this.facilityFormsDto.hasSuperBill && this.patientFormsDto.hasSuperBill) {
      const obj = { label: 'Super Bill', order: 2, checked: false, formType: FormsTypeEnum.SuperBill };
      this.itemsList.push(obj);
    }
    if (this.facilityFormsDto.hasHumana && this.patientFormsDto.hasHumana) {
      const obj = { label: 'Humana', order: 3, checked: false, formType: FormsTypeEnum.HumanaForm };
      this.itemsList.push(obj);
    }
  }
  onDragStart(event: DragEvent) {
    this.currentDragEffectMsg = '';
    this.currentDraggableEvent = event;

    // this.snackBarService.dismiss();
    // this.snackBarService.open( 'Drag started!', undefined, {duration: 2000} );
  }

  onDragged(item: any, list: any[], effect: DropEffect) {
    this.currentDragEffectMsg = `Drag ended with effect "${effect}"!`;

    if (effect === 'move') {
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
    if (list && (event.dropEffect === 'copy' || event.dropEffect === 'move')) {
      let index = event.index;

      if (typeof index === 'undefined') {
        index = list.length;
      }

      list.splice(index, 0, event.data);
    }
    this.itemsList.forEach((item, index) => {
      if (item.formType === event.data.formType) {
        item = event.data;
      }
    });
    setTimeout(() => {
      this.itemsList.forEach((item, index) => {
        item.order = index + 1;
      });
    }, 500);
  }
  emitEventForDownload() {
    const data = {
      'awEncounterId': 0,
      'awOrder': 0,
      'superbillOrder': 0,
      'humanaOrder': 0
    };
    let isCount = false;
    this.itemsList.forEach(item => {
      if (item.formType === FormsTypeEnum.AnnualWellnes) {
        data.awOrder = item.checked ? item.order : 0;
        if (item.checked) {
          isCount = true;
        }
      }
      if (item.formType === FormsTypeEnum.SuperBill) {
        data.superbillOrder = item.checked ? item.order : 0;
        if (item.checked) {
          isCount = true;
        }
      }
      if (item.formType === FormsTypeEnum.HumanaForm) {
        data.humanaOrder = item.checked ? item.order : 0;
        if (item.checked) {
          isCount = true;
        }
      }
    });
    if (!isCount) {
      this.toaster.info('No option selected');
      return;
    }
    this.proceedDownLoad.emit(data);
  }

}
enum FormsTypeEnum {
  AnnualWellnes = 1,
  HumanaForm = 2,
  SuperBill = 3,
}
