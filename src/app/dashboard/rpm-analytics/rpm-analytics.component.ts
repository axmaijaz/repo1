import { Component, OnInit } from '@angular/core';
import { RpmService } from 'src/app/core/rpm.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { RpmAnalyticsDto, RpmDailyReadingsFilterEnum } from 'src/app/model/rpm/rpm.analytics.model';

@Component({
  selector: 'app-rpm-analytics',
  templateUrl: './rpm-analytics.component.html',
  styleUrls: ['./rpm-analytics.component.scss']
})
export class RpmAnalyticsComponent implements OnInit {
  rpmGraphisLoading = true;
  rpmAnalyticsData = new RpmAnalyticsDto();
  startDate = '';
  endDate = '';
  filter: RpmDailyReadingsFilterEnum = RpmDailyReadingsFilterEnum.Last24Hours;
  barCHarData = [];
  barchartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: 'right',
      // labels: {
      //     fontColor: "white",
      //     boxWidth: 20,
      //     padding: 20
      // }
    }
  };
  chartColors: Array<any> = [
    {
      backgroundColor: 'rgba(105, 0, 132, .2)',
      borderColor: 'rgba(200, 99, 132, .7)',
      borderWidth: 2,
    },
    {
      backgroundColor: 'rgba(0, 137, 132, .2)',
      borderColor: 'rgba(0, 10, 130, .7)',
      borderWidth: 2,
    }
  ];
  constructor(private rpmService: RpmService) { }

  ngOnInit(): void {
    this.getRpmAnalytics();
  }

  getRpmAnalytics() {
    this.rpmGraphisLoading = true;
    this.rpmService.GetRpmDailyReadingsSummary(this.filter, this.startDate, this.endDate)
        .subscribe(
          (res: RpmAnalyticsDto) => {
            this.barCHarData = [];
            this.rpmAnalyticsData = res;
            if (this.rpmAnalyticsData?.groupedReadings?.length) {
              this.rpmAnalyticsData?.groupedReadings.forEach(element => {
                const newData = {};
                newData['label'] = element.name;
                newData['data'] = [{x: element.patientsCount, y: element.readingsCount}];
                this.barCHarData.push(newData);
              });
            }
            this.rpmGraphisLoading = false;
          },
          (err: HttpResError) => {
            this.rpmGraphisLoading = false;
          }
        );
  }

}
