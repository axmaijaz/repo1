import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { ApiExceptionsService } from 'src/app/core/Exceptions/api-exceptions.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { SubSink } from 'src/app/SubSink';
import { Location } from '@angular/common';
import { ClientExceptionLoggerDto } from 'src/app/model/Exception/Exception.model';

@Component({
  selector: 'app-front-end-exceptions',
  templateUrl: './front-end-exceptions.component.html',
  styleUrls: ['./front-end-exceptions.component.scss']
})
export class FrontEndExceptionsComponent implements OnInit {
  isLoadingExceptions: boolean;
  private subs = new SubSink();
  rows = new Array<ClientExceptionLoggerDto>();
  tempRows = new Array<ClientExceptionLoggerDto>();
  viewClientExceptionObj = new ClientExceptionLoggerDto();
  constructor(private location: Location, private exceptionService: ApiExceptionsService, private toaster: ToastService,
   ) { }

  ngOnInit(): void {
    this.GetClientExceptionList()
  }

  GetClientExceptionList() {
    this.isLoadingExceptions = true;
    this.subs.sink = this.exceptionService.GetClientExceptionList()
      .subscribe(
        (res: ClientExceptionLoggerDto[]) => {
          if (res) {
            this.isLoadingExceptions = false;
            res.forEach(element => {
              element.createdOn = moment.utc(element.createdOn).local().format('YYYY-MM-DD hh:mm A');
              element.updatedOn = moment.utc(element.updatedOn).local().format('YYYY-MM-DD hh:mm A');

            });

            //  const formatDate = res.date;
            // res.date = moment(res.date).format("yyyy-MM-DD");
            this.rows = res;
            console.log(this.rows)
            this.tempRows = res;
          }
        },
        (error: HttpResError) => {
          this.isLoadingExceptions = false;
          this.toaster.error(error.message, error.error);
        }
      );
  }
  openViewExceptionModal(modal: ModalDirective, item: ClientExceptionLoggerDto) {
    Object.assign(this.viewClientExceptionObj, item);
    modal.show();
  }
}
