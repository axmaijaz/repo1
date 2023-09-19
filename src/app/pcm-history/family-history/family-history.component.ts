import { SecurityService } from './../../core/security/security.service';
import { id } from '@swimlane/ngx-datatable';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { SubSink } from 'src/app/SubSink';
import { FHLookUpDto, AddFamilyHistoryDto, FamilyHistoryListDto } from 'src/app/model/FamilyHistoryDtos/familyHistory.model';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { FamilyHistoryService } from 'src/app/core/family-history.service';
import { ActivatedRoute } from '@angular/router';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { AppUiService } from 'src/app/core/app-ui.service';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { UserType } from 'src/app/Enums/UserType.enum';

@Component({
  selector: 'app-family-history',
  templateUrl: './family-history.component.html',
  styleUrls: ['./family-history.component.scss']
})
export class FamilyHistoryComponent implements OnInit, OnDestroy {
  @Input() awId: number;
  @Input() awDisable: boolean;
  private subs = new SubSink();
  lookUpData: FHLookUpDto[];
  isLoadingLookUp: boolean;
  patientId: number;
  preserveLookUp = new Array<FHLookUpDto>();
  isAddingFHistory: boolean;
  isLoadingFH: boolean;
  fhListData = new Array<FamilyHistoryListDto>();
  familyHistoryEditObj = new FamilyHistoryListDto();
  updatinfFH: boolean;
  constructor(private toaster: ToastService, private securityService: SecurityService,
    private appUi: AppUiService, private familyService: FamilyHistoryService, private route: ActivatedRoute) { }
  ngOnInit() {
    // this.patientId = +this.route.snapshot.paramMap.get('id');
    // this.patientId = +this.route.parent.snapshot.paramMap.get("id");
    this.patientId = +this.route.parent.parent.snapshot.paramMap.get('id');
    if (!this.patientId) {
      this.patientId = +this.route.snapshot.paramMap.get('id');
    }
    if (!this.patientId) {
      this.patientId = +this.route.pathFromRoot[3].snapshot.paramMap.get('id');
    }
    if (this.securityService.securityObject.userType === UserType.Patient) {
      this.patientId = this.securityService.securityObject.id;
    }
    this.GetFamilyHistoryByPatient();
    this.GetFamilyHistoryLookupData();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  GetFamilyHistoryLookupData() {
    this.isLoadingLookUp = true;
    this.subs.sink = this.familyService.GetFamilyHistoryLookupData().subscribe(
      (res: any) => {
        this.lookUpData = res;
        this.lookUpData.forEach((item) => {
          for (const name in item) {
            if (item[name] === null) {
              item[name] = false;
            }
          }
        });
        Object.assign(this.preserveLookUp  , res);
        this.isLoadingLookUp = false;
      },
      (error: HttpResError) => {
        this.isLoadingLookUp = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetFamilyHistoryByPatient() {
    this.isLoadingFH = true;
    this.subs.sink = this.familyService.GetFamilyHistory(this.patientId, this.awId).subscribe(
      (res: any) => {
        this.fhListData = res;
        if (!this.fhListData || !this.fhListData.length) {
          var tempData = new FamilyHistoryListDto();
            tempData.relation = "NA",
            tempData.condition = "NA",
            tempData.note = "NA",
            tempData.id = 0
          this.fhListData.push(tempData);
        }
        this.isLoadingFH = false;
      },
      (error: HttpResError) => {
        this.isLoadingFH = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  AddFamilyHistory(modal: ModalDirective) {
    this.isAddingFHistory = true;
    const pData = new AddFamilyHistoryDto();
    pData.patientId = this.patientId;
    pData.selectedLookups = this.lookUpData;
    this.subs.sink = this.familyService.AddFamilyHistory(pData).subscribe(
      (res: any) => {
        modal.hide();
        Object.assign(this.lookUpData , this.preserveLookUp );
        this.isAddingFHistory = false;
        this.GetFamilyHistoryByPatient();
        this.GetFamilyHistoryLookupData();
        // this.GetFamilyHistoryByPatient();
        this.toaster.success('Data saved successfully.');
      },
      (error: HttpResError) => {
        this.isAddingFHistory = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  openConfirmModal(data: FamilyHistoryListDto) {
    const modalDto = new LazyModalDto();
    modalDto.Title = 'Delete History';
    modalDto.Text = 'Do you want to delete this record ?';
    // modalDto.hideProceed = true;
    modalDto.callBack = this.deleteItem;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  deleteItem = (item: FamilyHistoryListDto) => {
    item['deleting'] = true;
    this.subs.sink = this.familyService.DeleteFamilyHistory(item.id).subscribe(
      (res: any) => {
        item['deleting'] = false;
        this.toaster.success('Record deleted successfully.');
        this.GetFamilyHistoryByPatient();
      },
      (error: HttpResError) => {
        item['deleting'] = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  OpenEditHistoryMOdal(item: FamilyHistoryListDto, editfHistoryModal: ModalDirective) {
    // this.familyHistoryEditObj = item;
    Object.assign(this.familyHistoryEditObj, item);
    editfHistoryModal.show();
  }

  UpdateHistory() {
    this.isAddingFHistory = true;
    this.subs.sink = this.familyService.EditFamilyHistory(this.familyHistoryEditObj).subscribe(
      (res: any) => {
        const rIndex = this.fhListData.findIndex(x => x.id === this.familyHistoryEditObj.id);
        this.fhListData[rIndex] = res;
        this.fhListData = [...this.fhListData];
        this.toaster.success('Data updated successfully.');
      },
      (error: HttpResError) => {
        this.isAddingFHistory = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
}
