import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'src/app/SubSink';
import { Location } from '@angular/common';
import { ApiExceptionsService } from 'src/app/core/Exceptions/api-exceptions.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { ExceptionLoggerDto } from 'src/app/model/Exceptions/apiExceptions.model';
import * as moment from 'moment';
import { DataFilterService } from 'src/app/core/data-filter.service';
import { ClonerService } from './../../core/cloner.service';
import { SecurityService } from 'src/app/core/security/security.service';

@Component({
  selector: 'app-exception-list',
  templateUrl: './exception-list.component.html',
  styleUrls: ['./exception-list.component.scss']
})
export class ExceptionListComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  isLoadingExceptions: boolean;
  rows = new Array<ExceptionLoggerDto>();
  tempRows = new Array<ExceptionLoggerDto>();
  ViewExceptionObj = new ExceptionLoggerDto();
  displayInvoiceObj1: { key: string; value: any[]; moduleTotal: number}[];
  historySummary = { apisCount: 0, today: 0, last3days: 0, week: 0};


  constructor(private location: Location, private exceptionService: ApiExceptionsService, private toaster: ToastService,
    private securityService: SecurityService,
    private filterData: DataFilterService, private cloner: ClonerService) { }

  ngOnInit(): void {
    this.GetExceptionList();
  }
  navigateBack() {
    this.location.back();
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  GetExceptionList() {
    this.isLoadingExceptions = true;
    this.subs.sink = this.exceptionService.GetExceptionList()
      .subscribe(
        (res: ExceptionLoggerDto[]) => {
          if (res) {
            this.isLoadingExceptions = false;
            res.forEach(element => {
              // element.logTime = new Date(element.logTime).toLocaleDateString();
              element.logTime = moment.utc(element.logTime).local().format('YYYY-MM-DD hh:mm A');
            });
            //  const formatDate = res.date;
            // res.date = moment(res.date).format("yyyy-MM-DD");
            this.rows = res;
            this.tempRows = res;
            this.createSummaryReport();
          }
        },
        (error: HttpResError) => {
          this.isLoadingExceptions = false;
          this.toaster.error(error.message, error.error);
        }
      );
  }
  createSummaryReport() {
    this.displayInvoiceObj1 = this.filterData.groupByProp(this.rows, 'path') as any;
    this.displayInvoiceObj1?.forEach(element => {
      let amount = 0;
      element.moduleTotal = element.value?.length || 0;
    });

    this.historySummary = { today: 0, last3days: 0, week: 0, apisCount: 0};
    this.rows.forEach(element => {
      const last24hours = moment(element.logTime, 'YYYY-MM-DD hh:mm A').isBetween(moment().subtract(24, 'hours'), moment());
      const last72hours = moment(element.logTime, 'YYYY-MM-DD hh:mm A').isBetween(moment().subtract(72, 'hours'), moment());
      const last168hours = moment(element.logTime, 'YYYY-MM-DD hh:mm A').isBetween(moment().subtract(168, 'hours'), moment());
      this.historySummary.today = last24hours ? this.historySummary.today + 1 : this.historySummary.today;
      this.historySummary.last3days = last72hours ? this.historySummary.last3days + 1 : this.historySummary.last3days;
      this.historySummary.week = last168hours ? this.historySummary.week + 1 : this.historySummary.week;
    });
    this.historySummary.apisCount = this.displayInvoiceObj1?.length | 0;
    this.displayInvoiceObj1 = this.displayInvoiceObj1.sort((a, b) => b.value?.length - a.value?.length);
    this.displayInvoiceObj1 = this.displayInvoiceObj1.filter((a, b) => a.value?.length > 3);


  }
  ExceptionModalCosed() {
    this.ViewExceptionObj = new ExceptionLoggerDto();
    var opar1 = document.getElementById('exceptionStackTraceRef');
      if (opar1) {
        opar1.innerHTML = '';
      }
  }

  openViewExceptionModal(modal: ModalDirective, item: ExceptionLoggerDto) {
    // Object.assign(this.ViewExceptionObj, item);
    this.ViewExceptionObj = this.cloner.deepClone(item)
    modal.show();
    setTimeout(() => {
      this.highlight();
    }, 1000);
  }
  highlight() {
    if (!this.ViewExceptionObj || !this.ViewExceptionObj.exceptionStackTrace) {
      var opar1 = document.getElementById('exceptionStackTraceRef');
      if (opar1 && opar1.innerHTML) {
        opar1.innerHTML = '';
      }
      return;
    }
    var opar1 = document.getElementById('exceptionStackTraceRef');
      if (opar1) {
        opar1.innerHTML = this.ViewExceptionObj.exceptionStackTrace;
      }
    var opar = document.getElementById('exceptionStackTraceRef').innerHTML;
    var paragraph = document.getElementById('exceptionStackTraceRef');
    var search = 'line';
    search = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); //https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex

    var re = new RegExp(search, 'g');
    var m;

    if (search.length > 0)
      paragraph.innerHTML = opar.replace(re, `<span class='highlightText'>$&</span>`);
    else paragraph.innerHTML = opar;
  }
  async TryApi(item: ExceptionLoggerDto) {
    var tokenRes = this.securityService.securityObject;
    if (item.loggedUserId) {
      tokenRes = await this.securityService.GetTokenByUserId(item.loggedUserId)
    }
    item['loading'] = true;
    this.subs.sink = this.exceptionService.TryApi(item.httpMethod, item.path, item.queryString, item.requestBody, tokenRes)
      .subscribe(
        (res: any) => {
          item['loading'] = false;
          this.toaster.success('Take a back seat', 'Everything is working fine.');
        },
        (error: HttpResError) => {
          item['loading'] = false;
          this.toaster.error(error.message, error.error);
        }
      );
  }
  deleteException(id: number) {
    // this.isLoadingExceptions = true;
    this.subs.sink = this.exceptionService.DeleteException(id)
      .subscribe(
        (res) => {
        this.GetExceptionList();
        },
        (error: HttpResError) => {
          // this.isLoadingExceptions = false;
          this.toaster.error(error.message, error.error);
        }
      );
  }
  updateFilter(event) {
    const val = +event.target.value;
    // filter our data
    const temp = this.tempRows.filter(function (d) { return d.id === val || !val; });


    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }
}
