import { id } from '@swimlane/ngx-datatable';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { AppUiService } from 'src/app/core/app-ui.service';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { PriorAuthService } from 'src/app/core/PriorAuth/prior-auth.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { LazyModalDto, PagingData } from 'src/app/model/AppModels/app.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { CreateFacilityUserDto } from 'src/app/model/Facility/facility.model';
import { PACaseStatus, PAPatientInformedStatus, PARequestStatus, PriorAuthDto, PAPatientsScreenParamsDto } from 'src/app/model/PriorAuth/prioAuth.model';
import { SubSink } from 'src/app/SubSink';
import { AddPriorAuthComponent } from '../add-prior-auth/add-prior-auth.component';
import { PcmService } from 'src/app/core/pcm/pcm.service';
import { Location } from '@angular/common';
import moment from 'moment';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { UserType } from 'src/app/Enums/UserType.enum';
import { ECalendarValue, IDatePickerConfig } from 'ng2-date-picker';
import FileSaver from 'file-saver';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-prior-auth-list',
  templateUrl: './prior-auth-list.component.html',
  styleUrls: ['./prior-auth-list.component.scss']
})
export class PriorAuthListComponent implements OnInit, OnDestroy, AfterViewInit {
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD',
  };
  // dateFormat: "mm-dd-yyyy"
  public datePickerConfig2: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'MM-DD-YYYY',
  };
  @ViewChild('searchPatient') searchPatient: ElementRef;
  isLoading: boolean;
  rows = [];
  private subs = new SubSink();
  objectURLStrAW: string;
  @ViewChild('viewPdfModal') viewPdfModal: ModalDirective;
  facilityUserList = new Array<CreateFacilityUserDto>();
  facilityId: number;
  priorAuthList = new Array<PriorAuthDto>();
  paRequestStatusEnum = PARequestStatus;
  paCaseStatusEnum = PACaseStatus;
  paPatientInformedStatusEnum = PAPatientInformedStatus;
  pagingData = new PagingData();
  filterPatientDto = new PAPatientsScreenParamsDto();
  processingDoc: boolean;
  pnumber: string;
  pagingObj = new Array<{display: string, active: boolean}>();
  daterange: any = {};
  sortingOrder = false;
  selectedDateRange: any;
  pagesArray = [];
  public options: any = {
    locale: { format: 'MM-DD-YYYY',
    cancelLabel: 'Clear',
    // displayFormat: 'DD-MM-YYYY'
  },
    alwaysShowCalendars: false,
  };
 public scrollbarOptionsTimeline = {
    axis: 'y',
    theme: 'light-3',
    scrollInertia: 2,
    scrollButtons: { enable: true },
    autoHideScrollbar: true,
    scrollbarPosition: 'inside'
  };
  lastPagePagination: number;
  currentpage: any;
  firstelement: number;
  thirdelement: number;
  firstpage: { display: string; active: boolean; };
  thirdpage: { display: string; active: boolean; };
  currentpagepage: { display: string; active: boolean; };
  forthelement: number;
  constructor(private toaster: ToastService, private priorAuthService: PriorAuthService, private pcmService: PcmService, private location: Location,
    private appUi: AppUiService, private facilityService: FacilityService, private securityService: SecurityService) { }

  ngOnInit() {
    this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    this.GetPriorAuthsByFacilityId();
    this.getFacilityUsersList();
  }
  ngAfterViewInit() {
    this.subs.sink = fromEvent(this.searchPatient.nativeElement, 'keyup')
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(1000)
      )
      .subscribe((text: string) => {
        this.GetPriorAuthsByFacilityId();
      });
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  selectedDate(value: any, datepicker?: any) {
    datepicker.start = value.start;
    datepicker.end = value.end;
    this.filterPatientDto.fromRequestDate = value.start.format('YYYY-MM-DD');
    this.filterPatientDto.toRequestDate = value.end.format('YYYY-MM-DD');
    this.daterange.label = value.label;
    // this.filterPatients();
  }
  clearDate() {
    this.daterange = {};
    this.selectedDateRange = [];
    this.filterPatientDto.fromRequestDate = '';
    this.filterPatientDto.toRequestDate = '';
    // this.filterPatients();
  }
  getPatientListExcelFile() {
    // thi
    this.subs.sink = this.pcmService
      .getPatientListExcelFile(this.filterPatientDto)
      .subscribe(
        (res: any) => {
          // this.facilityList = res;
          this.isLoading = false;
          FileSaver.saveAs(new Blob([res] , { type: 'application/csv' } ), `PriorAuthList.csv`);
        },
        (error: HttpResError) => {
          this.isLoading = false;
          this.toaster.error(error.error, error.message);
        }
      );
  }
  resetFilter() {
    this.daterange = {};
    this.selectedDateRange = [];
    this.filterPatientDto = new PAPatientsScreenParamsDto();
    this.filterPatientDto.PageNumber = 1;
  }

  openConfirmModal(data: any) {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Delete Prior Auth";
    modalDto.Text = "Are you sure to delete Prior Auth";
    modalDto.callBack = this.callBack;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack = (id: number) => {
    this.deletePriorAuth(id);
  }
  viewDoc(path: string) {
    // doc.path
    this.processingDoc = true;
    let nUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
    nUrl =  environment.appUrl;
    nUrl = nUrl + 'success/loading';
    const importantStuff = window.open(nUrl);
      // const importantStuff = window.open("", "_blank");
      this.subs.sink = this.pcmService.getPublicPath(path).subscribe(
        (res: any) => {
          this.processingDoc = false;
          // // importantStuff.location.href = res;
          // var win = window.open(res, '_blank');
          // // win.opener = null;
          // win.focus();
          if (path.toLocaleLowerCase().includes('.pdf')) {
            fetch(res).then(async (fdata: any) => {
              const slknasl = await fdata.blob();
              const blob = new Blob([slknasl], { type: 'application/pdf' });
              const objectURL = URL.createObjectURL(blob);
              importantStuff.close();
              this.objectURLStrAW = objectURL;
              this.viewPdfModal.show();
              // importantStuff.location.href = objectURL;
              // window.open(objectURL, '_blank');
            });
          } else {
            // window.open(res, "_blank");
            importantStuff.location.href = res;
            // setTimeout(() => {
            //   importantStuff.close();
            // }, 2000);
          }
        },
        err => {
          this.processingDoc = false;
          // this.preLoader = 0;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  deletePriorAuth(iD: number) {
    this.subs.sink = this.priorAuthService.DeletePriorAuth(iD).subscribe(
      (res: any) => {
        // this.facilityUserList = res;
        this.priorAuthList = this.priorAuthList.filter(x => {
         return x.id !== iD;
        });
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  goBack() {
    this.location.back();
  }
  getFacilityUsersList() {
    this.subs.sink = this.facilityService.getFacilityUserList(this.facilityId).subscribe(
      (res: any) => {
        this.facilityUserList = res;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  sort(sortBy: string) {
    this.sortingOrder = !this.sortingOrder;
    if (this.sortingOrder) {
      this.filterPatientDto.sortOrder = 0;
    } else {
      this.filterPatientDto.sortOrder = 1;
    }
    this.filterPatientDto.sortBy = sortBy;
    this.GetPriorAuthsByFacilityId();

  }
 GetPaginationFunction(){

    this.pagingObj.forEach((element,index) => {
      if(element.active) {
        this.currentpage   = element.display;
      }
    });
    this.lastPagePagination = this.pagingObj.length;
    if (+this.currentpage === 1) {
      this.firstelement = +this.currentpage;
      this.thirdelement = +this.currentpage + 1;
      this.currentpage =  +this.currentpage - 1;
      this.firstpage = this.pagingObj[this.firstelement];
      this.thirdpage = this.pagingObj[this.thirdelement];
      this.currentpagepage = this.pagingObj[+this.currentpage ];
      this.pagesArray = [this.currentpagepage, this.firstpage, this.thirdpage];

    } else if (+this.currentpage ===  +this.lastPagePagination) {
      this.firstelement = +this.currentpage - 3;
          this.currentpage =  +this.currentpage -2;
          this.thirdelement = +this.currentpage + 1;
          this.firstpage = this.pagingObj[this.firstelement];
          this.thirdpage = this.pagingObj[this.thirdelement];
          this.currentpagepage = this.pagingObj[+this.currentpage ];
          this.pagesArray = [this.firstpage,this.currentpagepage,this.thirdpage];
        } else{
      this.firstelement = +this.currentpage - 2;
      this.currentpage =  +this.currentpage -1;
      this.thirdelement = +this.currentpage + 1;
      this.firstpage = this.pagingObj[this.firstelement];
      this.thirdpage = this.pagingObj[this.thirdelement];
      this.currentpagepage = this.pagingObj[+this.currentpage ];
      this.pagesArray = [this.firstpage,this.currentpagepage,this.thirdpage];
    }


    // console.log('First Element',this.pagingObj[this.firstelement],this.firstelement)
    // console.log('Third Elemet',this.pagingObj[this.thirdelement],this.thirdelement)
    // console.log('Center Elemet',this.currentpagepage[+this.currentpage],this.currentpage)


 }
  GetPriorAuthsByFacilityId() {
    const fPDto = new PAPatientsScreenParamsDto();
    for (const filterProp in this.filterPatientDto) {
      if (
        this.filterPatientDto[filterProp] === null ||
        this.filterPatientDto[filterProp] === undefined
      ) {
        this.filterPatientDto[filterProp] = fPDto[filterProp];
        // this.FilterPatientDto[filterProp] = 0;
      }
    }
    if (this.securityService.securityObject.userType === UserType.FacilityUser) {
        this.filterPatientDto.FacilityId = this.facilityId;
    }
    if (this.filterPatientDto.caseTypeId.length == 0) {
      this.filterPatientDto.caseTypeId = null;
    }
    if (this.filterPatientDto.caseStatus.length == 0) {
      this.filterPatientDto.caseStatus = null;
    }
    if (this.filterPatientDto.reqStatus.length == 0) {
      this.filterPatientDto.reqStatus = null;
    }
    this.isLoading = true;
    this.subs.sink = this.priorAuthService.GetPriorAuthsByFacilityId(this.filterPatientDto).subscribe(
      (res: any) => {
        this.isLoading = false;
        res.priorAuthPatientsList.forEach(x => {
          if (x.paCaseStepId === null) {
            x.paCaseStepName = 'N/A';
          }
        });
        this.priorAuthList = res.priorAuthPatientsList;
        this.pagingData = res.pagingData;
        this.calculatePaging();
        this.GetPaginationFunction();
      },
      (error: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  calculatePaging() {
    const nPagingObj = [];
    const res = Math.ceil(this.pagingData.elementsCount / this.pagingData.pageSize);
    for (let index = 1; index <= res; index++) {
      const isActive = index === this.pagingData.pageNumber;
      const pObj = {
        display: index.toString(),
        active: isActive
      };
      nPagingObj.push(pObj);
    }
    this.pagingObj = nPagingObj;
  }
  setNewModelProps(addEditPriorRef: AddPriorAuthComponent) {
    addEditPriorRef.priorAuthAddEditDto = new PriorAuthDto();
    addEditPriorRef.priorAuthAddEditDto.requestDate = moment().format('YYYY-MM-DD');
    addEditPriorRef.priorAuthAddEditDto.receivedDate = moment().format('YYYY-MM-DD');
  }
  OpenEditMOdel(addEditPriorRef: AddPriorAuthComponent, row: PriorAuthDto) {
    Object.assign(addEditPriorRef.priorAuthAddEditDto, row);
    addEditPriorRef.filterPatientDto.SearchParam = row.patientName;
    addEditPriorRef.getFilterPatientsList2();
    addEditPriorRef.FillSteps();
    addEditPriorRef.ShowAddEditModal();
  }
popoverToggle(popover) {
      if(popover){
        popover.toggle();
      }
  }
  PreviousFirst(){
    this.filterPatientDto['pageNumber'] = 1;
  }
  Previous() {
    this.filterPatientDto['pageNumber'] = this.pagingData.pageNumber - 1;
  }
  Last(){
    this.filterPatientDto['pageNumber'] = this.pagingObj.length ;
  }
  Next() {
    this.filterPatientDto['pageNumber'] = this.pagingData.pageNumber + 1;
  }
}
