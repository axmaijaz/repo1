import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { SubSink } from 'src/app/SubSink';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { SurgicalHistoryService } from 'src/app/core/surgical-history.service';
import { data } from 'jquery';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { SurgicalSystemDto, SurgicalProceduresDto, AddSurgicalHDto, SHListDto } from 'src/app/model/SurgicalHistory/surgicalHistory.model';
import { ActivatedRoute } from '@angular/router';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { AppUiService } from 'src/app/core/app-ui.service';
import moment from 'moment';
import { SecurityService } from 'src/app/core/security/security.service';
import { UserType } from 'src/app/Enums/UserType.enum';

@Component({
  selector: 'app-surgical-history',
  templateUrl: './surgical-history.component.html',
  styleUrls: ['./surgical-history.component.scss']
})
export class SurgicalHistoryComponent implements OnInit , OnDestroy {
  @ViewChild('listItems', { read: ElementRef }) public listItems: ElementRef<any>;
  @Input() awId: number;
@Input() awDisable: boolean;
  selectedProcedure: number;
  private subs = new SubSink();
  isLoadingSystems: boolean;
  systemsList: SurgicalSystemDto[];
  proceduresList: SurgicalProceduresDto[];
  activeSystem: SurgicalSystemDto;
  isLoadingProcedures: boolean;
  patientId: number;
  dateOperated: string | Date;
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD',
    appendTo: 'body'
  };
  savingProvedure: boolean;
  patientProceduresList = new Array<SHListDto>();
  isLoadingSH: boolean;
  surgeonName: string;
  notes: string;
  selectedId: number;
  nkdaCheck = false;
  constructor(private toaster: ToastService, private surgicalService: SurgicalHistoryService,
    private appUi: AppUiService, private route: ActivatedRoute, private securityService: SecurityService,) { }
  ngOnInit() {
    // this.patientId = +this.route.snapshot.paramMap.get('id');
    this.patientId = +this.route.parent.parent.snapshot.paramMap.get('id');
    if (!this.patientId) {
      this.patientId = +this.route.snapshot.paramMap.get('id');
    }
    if (this.securityService.securityObject.userType === UserType.Patient) {
      this.patientId = this.securityService.securityObject.id;
    }
    this.GetSurgicalHistoriesByPatientId();
    this.GetSurgicalSystems();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  GetSurgicalSystems() {
    this.isLoadingSystems = true;
    this.subs.sink = this.surgicalService.GetSurgicalSystems().subscribe(
      (res: any) => {
        this.systemsList = res;
        if (this.systemsList.length > 0) {
          this.activeSystem = this.systemsList[0];
          this.GetSurgicalProceduresBySystem();
        }
        this.isLoadingSystems = false;
      },
      (error: HttpResError) => {
        this.isLoadingSystems = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetSurgicalProceduresBySystem() {
    this.proceduresList = [];
    this.isLoadingProcedures = true;
    this.subs.sink = this.surgicalService.GetSurgicalProcedures(this.activeSystem.id).subscribe(
      (res: any) => {
        this.proceduresList = res;
        if (this.nkdaCheck === true) {
          this.selectedProcedure = this.proceduresList.find(x => x.name.toLocaleLowerCase().includes(`other`)).id;
        }
        this.isLoadingProcedures = false;
      },
      (error: HttpResError) => {
        this.isLoadingProcedures = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetSurgicalHistoriesByPatientId() {
    this.isLoadingSH = true;
    this.subs.sink = this.surgicalService.GetSurgicalHistoriesByPatientId(this.patientId, this.awId).subscribe(
      (res: any) => {
        this.patientProceduresList = res;
        const resP = this.patientProceduresList.find(x => x.surgeonName === `Not significant` && x.notes === `No surgical history`);
        if (resP && this.patientProceduresList && this.patientProceduresList.length > 1) {
          this.deleteImmunization(resP);
        }
        this.isLoadingSH = false;
      },
      (error: HttpResError) => {
        this.isLoadingSH = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  selectProcedure(item: SurgicalProceduresDto) {
    if (item['value'] === item.id) {
      item['value'] = null;
    } else {
      item['value'] = item.id;
    }
  }
  openEditModel(row: SHListDto, addSurgicalModal: ModalDirective) {
    this.selectedProcedure = row.surgicalProcedureId;
    this.dateOperated = row.dateOperated;
    this.surgeonName = row.surgeonName;
    this.notes = row.notes;
    this.selectedId = row.id;
    if (row.surgicalSystemId && (this.activeSystem.id !== row.surgicalSystemId)) {
      this.activeSystem = this.systemsList.find(x => x.id === row.surgicalSystemId);
      this.GetSurgicalProceduresBySystem();
    }
    addSurgicalModal.show();
  }
  newSurgicalHistory() {
    this.selectedId = 0;
    this.selectedProcedure = 0;
    this.dateOperated = '';
    this.surgeonName = '';
    this.notes = '';
  }
  saveProcedure(modal: ModalDirective) {
    this.savingProvedure = true;
    const aData = new AddSurgicalHDto();
    aData.dateOperated = this.dateOperated;
    aData.surgicalProcedureId = this.selectedProcedure;
    aData.patientId = this.patientId;
    aData.surgeonName = this.surgeonName;
    aData.notes = this.notes;
    aData.id = this.selectedId;
    this.subs.sink = this.surgicalService.AddEditPatientSurgicalHistory(aData).subscribe(
      (res: any) => {
        // this.proceduresList = res;
        this.selectedProcedure = 0;
        this.dateOperated = '';
        this.surgeonName = '';
        this.notes = '';
        modal.hide();

          this.GetSurgicalHistoriesByPatientId();
        // }
        // if (this.selectedId) {
        //   const rData = this.patientProceduresList.findIndex(x => x.id === this.selectedId);
        //   if (rData > -1) {
        //     this.patientProceduresList[rData] = res;
        //   }
        // } else {
        //   this.patientProceduresList.unshift(res);
        // }
        this.patientProceduresList = [...this.patientProceduresList];
        this.savingProvedure = false;
      },
      (error: HttpResError) => {
        this.savingProvedure = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  nkdaChecked() {
    if (this.nkdaCheck) {
      this.activeSystem = this.systemsList.find(x => x.name === `Other`);
      this.GetSurgicalProceduresBySystem();
      this.dateOperated = moment().format('YYYY-MM-DD');
      this.surgeonName = `Not significant`;
      this.notes = `No surgical history`;
    } else {
      this.newSurgicalHistory();
    }
  }
  openConfirmModal(dat: any) {
    const modalDto = new LazyModalDto();
    modalDto.Title = 'Delete Surgical History';
    modalDto.Text = 'Are you sure to delete Surgical history record';
    modalDto.callBack = this.deleteImmunization;
    modalDto.data = dat;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  deleteImmunization = (row: any) => {
    // if (confirm("Are you sure to delete Immunization")) {
    this.isLoadingSH = true;
    this.surgicalService
      .DeletePatientImmunization(row.id)
      .subscribe(
        (res: any) => {
          this.isLoadingSH = false;
          this.toaster.success('Record deleted successfully');
          this.GetSurgicalHistoriesByPatientId();
        },
        (error: HttpResError) => {
          this.isLoadingSH = false;
          this.toaster.error(error.error, error.message);
        }
      );
    // }
  }
  scrollLeft(){
    this.listItems.nativeElement.scrollLeft -= 150;
  }

  scrollRight(){
    this.listItems.nativeElement.scrollLeft += 150;
  }
}
