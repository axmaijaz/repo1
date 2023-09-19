import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng-uikit-pro-standard';
import { EventBusService, EventTypes } from 'src/app/core/event-bus.service';

@Component({
  selector: 'app-patient-alert',
  templateUrl: './patient-alert.component.html',
  styleUrls: ['./patient-alert.component.scss']
})
export class PatientAlertComponent implements OnInit {
  @ViewChild('basicModal') startTimerModal: ModalDirective;
  constructor(private eventBus: EventBusService) { }

  ngOnInit() {
    this.eventBus.on(EventTypes.patientAlertModal).subscribe(res => {
      this.startTimerModal.show();
    });
  }

}
