import { Component, OnInit } from '@angular/core';
import { AnalyticService } from '../core/analytics.service';
import { PatientTasksData, MonthlyChargesDto } from '../model/analytic.model';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-monthly-charges-report',
  templateUrl: './monthly-charges-report.component.html',
  styleUrls: ['./monthly-charges-report.component.scss']
})
export class MonthlyChargesReportComponent implements OnInit {
  public datePickerConfig2: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD',
  };
  insurance: Array<any>;
  dataSource: any;
  startDate = '2020-06-10';
  endDate = '2020-06-14';
  filterBy = 'ServiceStartDate';
  data: any;
  monthlyChargesDto = new Array<MonthlyChargesDto>();
  constructor(private analyticService: AnalyticService) {
    this.getCharges();
  }

  ngOnInit() {
  }
  getCharges() {
    this.dataSource = {
      // remoteOperations: true,
      fields: [
        {
          caption: 'Count Patients',
          dataField: 'countPatients',
          summaryType: 'sum',
          area: 'data',
          // selector: this.primaryClaims
        },
        {
          caption: 'Scheduling Provider',
          dataField: 'schedulingProviderName',
          width: 150,
          area: 'row',
          // selector: this.citySelector
        },
        {
          caption: 'month',
          dataField: 'date',
          dataType: 'date',
          width: 150,
          area: 'row',
          // selector: this.citySelector
        },

        // { dataField: '[Date].[Calendar Year]', area: 'row' },
        // { dataField: '[ate].[Month of Year]', area: 'row' },

      //   {
      //     dataField: "date",
      //     dataType: "date",
      //     area: "column"
      // }, {
      //     groupName: "date",
      //     groupInterval: "year",
      //     expanded: true
      // },
      // {
      //     groupName: "date",
      //     groupInterval: "month",
      //     // visible: false
      // },
        {
          caption: 'serviceLocationName',
          width: 120,
          dataField: 'serviceLocationName',
          area: 'row',
        },
        // {
        //   caption: 'CPT',
        //   dataField: 'Category',
        //   width: 150,
        //   area: 'row',
        //   // selector: this.citySelector
        // },
        {
          caption: 'Procedure Code ID',
          dataField: 'procedureCodeID',
          width: 150,
          area: 'row',
          // selector: this.citySelector
        },
        {
          caption: 'Claim ID',
          dataField: 'claimID',
          width: 150,
          area: 'row',
          // selector: this.citySelector
        },{
          caption: 'Patient Name',
          dataField: 'patientName',
          width: 150,
          area: 'row',
          // selector: this.citySelector
        },
        {
          caption: 'Charges Amount',
          dataField: 'allowedAmount',
          // dataType: 'number',
          summaryType: 'sum',
          format: "currency",
          area: 'data',
        },
        {
          caption: 'Adjusted Amount',
          dataField: 'adjustedCharges',
          // dataType: 'number',
          summaryType: 'sum',
          format: "currency",
          area: 'data',
        },
        {
          caption: 'Collected Amount',
          dataField: 'collectedAmount',
          // dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          area: 'data',
        },
        {
          caption: 'Primary Claims',
          dataField: 'countPrimaryClaims',
          // dataType: 'number',
          summaryType: 'sum',
          // format: 'currency',
          area: 'data',
        },
        {
          caption: 'Secondary Claims',
          dataField: 'countSecondaryClaims',
          summaryType: 'sum',
          // format: 'currency',
          area: 'data',
        },
        {
          caption: 'Patient Claims',
          dataField: 'countPatientClaims',
          summaryType: 'sum',
          // format: 'currency',
          area: 'data',
        },

        {
          caption: 'Total Days',
          dataField: 'totalDays',
          summaryType: 'sum',
          // format: 'currency',
          area: 'data',
        },
        {
          caption: 'Percentage',
          dataField: 'percentage',
          summaryType: 'sum',
          dataType: "number",
          area: "data",
          summaryDisplayMode: "percentOfGrandTotal"
          // selector: this.primaryClaims
        },
        {
          caption: 'Montly Report',
          width: 120,
          dataField: 'monthlyReport',
          area: 'column',
          selector: this.procedure,
        },

      ],
      // load: this.data
      load: (loadOptions) => {
        var d = $.Deferred();
        // $.getJSON(environment.baseUrl + `Charges/NORTHERN ARIZONA MEDICAL GROUP/2019-01-01/2019-01-05/CreatedDate`).done(function (data) {
        $.getJSON(
          environment.baseUrl +
            `Charges/GetChargesReport/NORTHERN ARIZONA MEDICAL GROUP/${this.startDate}/${this.endDate}/${this.filterBy}`
        )
          .done(function (data: Array<MonthlyChargesDto>) {

            console.log(data);
            d.resolve(data);
          })
          .fail(d.reject);
        return d.promise();
      },
    };
  }
  procedure(data) {
    return data.monthlyReport = 'Monthly Report';
  }
//   percentOfColumnTotal(e) {
//     return percentOfParent(e, ROW);
// },

}
