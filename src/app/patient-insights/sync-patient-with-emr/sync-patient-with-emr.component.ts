import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sync-patient-with-emr',
  templateUrl: './sync-patient-with-emr.component.html',
  styleUrls: ['./sync-patient-with-emr.component.scss']
})
export class SyncPatientWithEmrComponent implements OnInit {
  careplanView: any
  constructor() { }

  ngOnInit(): void {
  }

}
