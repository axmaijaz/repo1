import { Component, OnInit } from '@angular/core';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { SubSink } from 'src/app/SubSink';
import { InsuranceService } from 'src/app/core/insurance.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { InsurancePlanDto, AddInsurancePlanDto, CareGapDto, PayersListDto } from 'src/app/model/pcm/payers.model';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { AppUiService } from 'src/app/core/app-ui.service';
import { Location } from "@angular/common";
import { PatientDto } from 'src/app/model/Patient/patient.model';

@Component({
  selector: 'app-payers-manage',
  templateUrl: './payers-manage.component.html',
  styleUrls: ['./payers-manage.component.scss']
})
export class PayersManageComponent implements OnInit {

  private subs = new SubSink();
  loadingEditor = true;
  editorValue = '';
  isLoadingPayersList: boolean;
  addInsurancePLanObj = new AddInsurancePlanDto();
  facilityId: number;
  gridCheckAll: boolean;
  insurancePLanList: AddInsurancePlanDto[];
  addingInsurancePLan: boolean;
  gapGuidline = '';
  SearchParam = '';
  CareGapsList: CareGapDto[];
  selectedCareGap = new CareGapDto();
  searchWatch = new Subject<string>();
  PayersList = new Array<PayersListDto>();

  searchParam: string;
  loadingPayers: boolean;
  savingList: boolean;
  transferIng: boolean;
  PatientsList: PatientDto[];
  transferToPlanId: number;
  transferInsurancePLanList: AddInsurancePlanDto[];
  count: number;
  selected: number[] = [];
  selectedInsurancePLan: AddInsurancePlanDto;
  selectedGapIds = new Array<number>()
  gettingFacilityGaps: boolean;

  constructor(private toaster: ToastService,private location: Location, private appUi: AppUiService, private insuranceService: InsuranceService, private securityService: SecurityService) { }

  ngOnInit() {
  this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
  this.GetInsurancePlansByFacilityId();
  // this.GetAllPayers();
  this.GetAllCareGaps();
  this.SearchObserver();
  this.GetPayersByFacilityId();
  }
  public sidenavScroll = {
    axis: "yx",
    theme: "minimal-dark",
    scrollInertia: 0,
    scrollbarPosition: "outside",
    autoHideScrollbar: true,
  };

  SearchObserver() {
    this.searchWatch.pipe(debounceTime(1000)).subscribe(x => {
      this.searchParam = x;
      this.GetAllPayers();
    });
  }
  navigateBack() {
    this.location.back();
  }
  GetPayersByFacilityId() {
    this.gettingFacilityGaps = true;
    this.subs.sink = this.insuranceService.GetGapsByFacilityId(this.facilityId).subscribe(
      (res: number[]) => {
        this.selectedGapIds = res;
        this.gettingFacilityGaps = false;
      },
      (error: HttpResError) => {
        this.gettingFacilityGaps = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  selectFacilityGaps() {

    this.selectedGapIds.forEach(element => {
      const gap1 = this.CareGapsList.find(i => i.id === element);
      if (gap1) {
        // this.CareGapsList.forEach(x => x['checked'] = true );
        gap1['checked'] = true;
        this.addInsurancePLanObj.selectedGaps.push(gap1);
      }
    });
  }
  GetInsurancePlansByFacilityId() {
    this.isLoadingPayersList = true;
    this.subs.sink = this.insuranceService.GetInsurancePlansByFacilityId(this.facilityId).subscribe(
      (res: AddInsurancePlanDto[]) => {
        this.insurancePLanList = res;
        this.isLoadingPayersList = false;
      },
      (error: HttpResError) => {
        this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  AddEditInsurancePlan(modal: ModalDirective) {
    this.addingInsurancePLan = true;
    this.addInsurancePLanObj.facilityId = this.facilityId;
    this.subs.sink = this.insuranceService.AddEditInsurancePlan(this.addInsurancePLanObj).subscribe(
      (res: AddInsurancePlanDto) => {
        if (this.addInsurancePLanObj.id) {
          const index = this.insurancePLanList.findIndex(x => x.id === this.addInsurancePLanObj.id);
          this.insurancePLanList[index] = res;
        } else {
          this.insurancePLanList.unshift(res);
        }
        this.insurancePLanList = [...this.insurancePLanList];
        modal.hide();
        this.addingInsurancePLan = false;
      },
      (error: HttpResError) => {
        this.addingInsurancePLan = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  resetObj() {
    this.addInsurancePLanObj = new AddInsurancePlanDto();
    this.CareGapsList.forEach(x => x['checked'] = false);
  }
  GetAllPayers() {
    this.loadingPayers = true;
    this.subs.sink = this.insuranceService.GetAllPayers(this.searchParam).subscribe(
      (res: PayersListDto[]) => {
        this.loadingPayers = false;
        this.PayersList = res;
      },
      (error: HttpResError) => {
        this.loadingPayers = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  DeleteInsurancePlan(id, modal?: ModalDirective) {
    this.savingList = true;
    this.subs.sink = this.insuranceService.DeleteInsurancePlan(id).subscribe(
      (res: PayersListDto[]) => {
        this.GetInsurancePlansByFacilityId();
        this.savingList = false;
        if (modal) {
          modal.hide();
        }
        // this.PayersList = res;
      },
      (error: HttpResError) => {
        this.savingList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  AssignPatientsToInsurancePlan() {
    this.transferIng = true;
    const data = {
      insurancePlanId: this.transferToPlanId,
      patientIds: this.selected
    };
    this.subs.sink = this.insuranceService.AssignPatientsToInsurancePlan(data).subscribe(
      (res: any) => {
        this.selected.forEach(id => {
          this.PatientsList = this.PatientsList.filter(x => x.id !== id);
        });
        this.selected = [];
        this.count = this.PatientsList.length;
        this.transferIng = false;
        this.toaster.success('Patients transfered successfully');
      },
      (error: HttpResError) => {
        this.transferIng = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  openConfirmModal(data: any, modal: ModalDirective) {
    this.selectedInsurancePLan = data;
    this.selected = [];
    this.transferToPlanId = null;
    this.subs.sink = this.insuranceService.GetInsurancePlanPatientCount(data.id).subscribe(
      (res: any) => {
        if (res.patientCount) {
          this.PatientsList = res.patients;
          this.count = +res.patientCount;
          this.transferInsurancePLanList = this.insurancePLanList.filter(x => x.id !== data.id);
          modal.show();

        } else {
          const modalDto = new LazyModalDto();
          modalDto.Title = 'Delete Payer';
          // modalDto.Text = `This plan is assigned to ${res.patientCount} patients, Do you want to delete ?`;
          modalDto.Text = `Do you want to delete ?`;
          modalDto.callBack = this.callBack;
          modalDto.data = data;
          this.appUi.openLazyConfrimModal(modalDto);
          // this.DeleteInsurancePlan(data);
        }
      },
      (error: HttpResError) => {
        // this.loadingPayers = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  filterPatients() {
    const fPatients = this.PatientsList.filter(x => !(x.firstName + ' ' + x.lastName).toLocaleLowerCase().includes(this.SearchParam.toLocaleLowerCase()));
    this.PatientsList?.forEach(x => {
      if ((x.firstName + ' ' + x.lastName).toLocaleLowerCase().includes(this.SearchParam.toLocaleLowerCase())) {
        x['hidden'] = false;
      } else {
        x['hidden'] = true;
      }
    });
    if (!this.SearchParam) {
      this.PatientsList?.forEach(x => {
        x['hidden'] = false;
      });
    }
  }
  gridAllRowsCheckBoxChecked(e) {
    this.PatientsList.forEach((data: any) => {
      data.checked = e.target.checked;
    });
    if (e.target.checked) {
      this.selected = [];
      // Object.assign(this.selected, this.rows);
      this.PatientsList.forEach((data: any) => {
        if (data.checked && !data.hidden) {
          this.selected.push(data.id);
        } else {
          data.checked = false;
        }
      });
    } else {
      this.selected = [];
    }
  }
  rowCheckBoxChecked(e, row) {
    this.gridCheckAll = false;
    row.checked = e.target.checked;
    if (e.target.checked) {
      this.selected.push(row.id);
      // this.patientIds.push(row.id);
    } else {
      const index = this.selected.findIndex((x) => x === row.id);
      this.selected.splice(index, 1);

    }
  }
  callBack = (data: any) => {
    this.DeleteInsurancePlan(data.id);
  }
  GetAllCareGaps() {
    this.subs.sink = this.insuranceService.GetAllCareGaps().subscribe(
      (res: CareGapDto[]) => {
        this.CareGapsList = res;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  OpenEditInsurance(row: AddInsurancePlanDto, model: ModalDirective) {
    this.addInsurancePLanObj.id = row.id;
    this.addInsurancePLanObj.name = row.name;
    this.addInsurancePLanObj.payerId = row.payerId;
    this.addInsurancePLanObj.selectedGaps = row.selectedGaps;
    this.addInsurancePLanObj.facilityId = row.facilityId;
    this.addInsurancePLanObj.isCcmCovered = row.isCcmCovered;
    this.addInsurancePLanObj.isRpmCovered = row.isRpmCovered;
    this.CareGapsList.forEach(x => x['checked'] = false);
    this.addInsurancePLanObj.selectedGaps.forEach(x => {
      const gap = this.CareGapsList.find(i => i.id === x.id);
      console.log('g1',gap);
      if (gap) {
        gap['checked'] = true;
        gap.guideline = x.guideline;
      }
      console.log('g2',gap);
    });
    this.PayersList.push({id: row.payerId, payerName: row.payerName, payerId: '', insurancePlans: []});
    model.show();
  }
  selectRowForGuideline(item: any) {
    this.selectedCareGap = item;
    // this.gapGuidline = '';
    this.gapGuidline = item.guideline;
  }
  GapValueChanged(checked: boolean, gap: CareGapDto, index: number) {
   let gapData = {
    id: gap.id,
    guideline: gap.guideline
    }
    if (checked) {
      this.addInsurancePLanObj.selectedGaps.push(gapData);
    } else {
      const gIndex = this.addInsurancePLanObj.selectedGaps.findIndex(x => x.id === gap.id);
      this.addInsurancePLanObj.selectedGaps.splice(gIndex, 1);
    }
    const gap1 = this.CareGapsList.find(i => i.id === gap.id);
      if (gap1) {
        gap1['checked'] = checked;
      }
  }
 saveGuideline() {
  this.selectedCareGap.guideline = this.gapGuidline;
  let gap = this.addInsurancePLanObj.selectedGaps.find(x => x.id === this.selectedCareGap.id);
  if (gap) {
    gap.guideline = this.selectedCareGap.guideline;
  }
 }
 selectCoveredService(service){
  if(service == 'ccm'){
    if(this.addInsurancePLanObj.isCcmCovered){
      this.addInsurancePLanObj.isCcmCovered = false;
    }else{
      this.addInsurancePLanObj.isCcmCovered = true;
    }
  }
  if(service == 'rpm'){
    if(this.addInsurancePLanObj.isRpmCovered){
      this.addInsurancePLanObj.isRpmCovered = false;
    }else{
      this.addInsurancePLanObj.isRpmCovered = true;
    }
  }
 }
}
