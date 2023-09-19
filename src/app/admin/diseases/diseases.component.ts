import { CcmDataService } from './../../core/ccm-data.service';
import { Disease } from './../../model/admin/disease.model';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { PagingData } from 'src/app/model/AppModels/app.model';
import { ToastService } from 'ng-uikit-pro-standard';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { SubSink } from 'src/app/SubSink';

@Component({
  selector: "app-diseases",
  templateUrl: "./diseases.component.html",
  styleUrls: ["./diseases.component.scss"]
})
export class DiseasesComponent implements OnInit, AfterViewInit, OnDestroy {
  private subs = new SubSink();
  isLoading = false;
  rows = new Array<Disease>();
  pagingData = new PagingData();

  constructor(
    private dataService: CcmDataService,
    private toaster: ToastService
  ) {}

  ngAfterViewInit() {
    this.cellOverflowVisible();
    const rightRowCells = document.getElementsByClassName(
      "datatable-row-right"
    );
    rightRowCells[0].setAttribute(
      "style",
      "transform: translate3d(-17px, 0px, 0px)"
    );
  }

  private cellOverflowVisible() {
    const cells = document.getElementsByClassName(
      "datatable-body-cell overflow-visible"
    );
    for (let i = 0, len = cells.length; i < len; i++) {
      cells[i].setAttribute("style", "overflow: visible !important");
    }
  }

  ngOnInit() {
    // this.dataService.getPagedDiseases(this.pagingData.pageNumber, this.pagingData.pageSize)
    // .subscribe((data: any) => {
    //   this.isLoading = true;
    //   if (data) {
    //     this.isLoading = false;
    //     this.rows = data;
    //   }
    // },
    // error => {
    //   this.isLoading = false;
    //   console.log(error);
    // });
    this.setPage({ offset: 0 });
  }
  setPage(pageInfo) {
    this.pagingData.pageNumber = pageInfo.offset;
    this.isLoading = true;
    this.subs.sink = this.dataService
      .getPagedDiseases(
        this.pagingData.pageNumber + 1,
        this.pagingData.pageSize
      )
      .subscribe(
        (res: any) => {
          this.rows = res.diseaseList;
          this.pagingData = res.pagingData;
          this.pagingData.pageSize = 10;
          this.pagingData.pageNumber = res.pagingData.pageNumber - 1;
          this.isLoading = false;
        },
        (err: HttpResError) => {
          this.isLoading = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
