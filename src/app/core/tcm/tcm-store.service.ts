import { Injectable } from '@angular/core';
import { TcmEncounterDto, TcmInitialCommDto } from 'src/app/model/Tcm/tcm.model';
import { Subject } from 'rxjs';
import { CreateFacilityUserDto } from 'src/app/model/Facility/facility.model';

@Injectable({
  providedIn: 'root'
})
export class TcmStoreService {
  patientId: number;
  tcmId: number;
  tcmDataLoaded = new Subject<boolean>();
  tcmData = new TcmEncounterDto();
  viewDischargeDate: Date | string;
  gettingTcmData: boolean;
  calculateDate: number;
  checkIsSuccessfull = new TcmInitialCommDto();
  facilityUserList = new Array<CreateFacilityUserDto>();
  constructor() { }
  clearData() {
    this.patientId = 0;
    this.tcmId = 0;
    this.checkIsSuccessfull = new TcmInitialCommDto();
  }
}
