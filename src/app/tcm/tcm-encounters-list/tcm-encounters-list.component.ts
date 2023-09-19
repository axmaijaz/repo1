import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { ECalendarValue, IDatePickerConfig } from 'ng2-date-picker';
import { AppUiService } from 'src/app/core/app-ui.service';
import { CcmDataService } from 'src/app/core/ccm-data.service';
import { TcmStoreService } from 'src/app/core/tcm/tcm-store.service';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { tcmStatus2Enum } from 'src/app/model/Tcm/tcm.enum';
import { AddTcmEncounterDto, TcmEncounterCloseDto } from 'src/app/model/Tcm/tcm.model';
import { TcmDataService } from 'src/app/tcm-data.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-tcm-encounters-list',
  templateUrl: './tcm-encounters-list.component.html',
  styleUrls: ['./tcm-encounters-list.component.scss']
})
export class TcmEncountersListComponent implements OnInit {
  @ViewChild ('ClosedStatusModal') ClosedStatusModal: ModalDirective;
  @ViewChild ('HospitalizationDateModal') HospitalizationDateModal: ModalDirective;
  public onlydatePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "YYYY-MM-DD"
  };
  followUpDataObj = {
    patientId: 0,
    followUpDate: "",
    recentPcpAppointment: "",
    recentHospitalizationDate : "",
    lastTcmStatus: tcmStatus2Enum,
    lastTcmEncounterId: 0
  };
  IsLoading = true;
  PatientId: number;
  creatingTcm: boolean;
  tcmStatusEnum = tcmStatus2Enum;
  tcmList: [];
  addTcmEncounterDto = new AddTcmEncounterDto();
  // tcmClosedStatusEnum = ClosedStatus;
  tcmEncounterCloseDto = new TcmEncounterCloseDto();
  checkEncounter: any[];
  isShowAddButton = true;
  // followUpDataObj: any;
  constructor(private route: ActivatedRoute,private appUi: AppUiService, private toaster: ToastService,
    private tcmSevice: TcmDataService,private ccmService: CcmDataService, private location: Location,
     private router: Router, public tcmStore: TcmStoreService) { }

  ngOnInit() {
    this.PatientId = +this.route.snapshot.paramMap.get('id');
    this.getPatientTcmList();
  }
  createTcmEncounter() {
    this.creatingTcm = true;
    this.addTcmEncounterDto.patientId = this.PatientId;
    this.addTcmEncounterDto.hospitalizationDate = this.followUpDataObj.recentHospitalizationDate;
    this.tcmSevice.createTcm(this.addTcmEncounterDto).subscribe(res => {
      this.creatingTcm = false;
      this.router.navigateByUrl(`/tcm/dischargeOverview/${this.PatientId}/${res}`);
    }, (error: HttpResError) => {
      this.creatingTcm = false;
    });
  }
  updateHospitalizationDate() {
    this.creatingTcm = true;
    this.followUpDataObj.patientId = this.PatientId;
    this.ccmService
      .changefollowUpDate(this.followUpDataObj)
      .subscribe(
        res => {
          this.creatingTcm = false;
          this.HospitalizationDateModal.hide();
          this.createTcmEncounter();
          // this.toaster.success("Data Updated Successfully");
        },
        error => {
          this.creatingTcm = false;
          this.toaster.error(error.message, error.error || error.error);
        }
      );
  }

  getPatientTcmList() {
    this.IsLoading = true;
    this.tcmSevice.getTcmListByPatientId(this.PatientId).subscribe((res: any) => {
      this.IsLoading = false;
      this.tcmList = res;
if (this.tcmList) {
  this.checkEncounter = this.tcmList.filter((res: any) => {
    return res.tcmStatus == 1 || res.tcmStatus == 2;
  })
  if (this.checkEncounter.length > 0 ) {
    this.isShowAddButton = true;
  } else {
    this.isShowAddButton = false;
  }
}
      // this.tcmList.forEach(obj => {
      //   obj.closedStatus
      // });
    }, (error: HttpResError) => {
      this.IsLoading = false;
    });
  }
  singleRowData(row: any) {
    this.tcmEncounterCloseDto.TcmEncounterId = row.id;
    this.tcmEncounterCloseDto.ClosedStatus = row.closedStatus;
  }
  setTcmEncounterClosedStatus() {
    this.ClosedStatusModal.hide();
    this.tcmSevice.SetTcmEncounterClosedStatus(this.tcmEncounterCloseDto).subscribe(
      (res: any) => {
       this.getPatientTcmList();
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
      }
    );
  }
  navigateBack() {
    this.location.back();
  }
  openConfirmModal(data: any) {
    this.ClosedStatusModal.hide();
    const modalDto = new LazyModalDto();
    modalDto.Title = "Close TCM Status";
    modalDto.Text = `Do you want to Close this tcm ?`;
    modalDto.callBack = this.callBack;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack = (data: any) => {
    this.setTcmEncounterClosedStatus();
  }
}
