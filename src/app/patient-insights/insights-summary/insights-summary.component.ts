import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-insights-summary',
  templateUrl: './insights-summary.component.html',
  styleUrls: ['./insights-summary.component.scss']
})
export class InsightsSummaryComponent implements OnInit {
  showEMrActions = false;
  PatientId: number;
  viewType = '';
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.showEMrActions = location.href.includes('embedded')
    this.PatientId = +this.route.snapshot.paramMap.get('id');
    if (!this.PatientId) {
      this.PatientId = +this.route.pathFromRoot[3].snapshot.paramMap.get("id");
    }
    if (location.href.includes('embedded')) {
      this.viewType = 'embedded'
    } else {
      this.viewType = 'summary'
    }
  }

}
