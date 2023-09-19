import { Component, OnInit } from '@angular/core';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { UserType } from 'src/app/Enums/UserType.enum';
import { CreateFacilityUserDto } from 'src/app/model/Facility/facility.model';
import { ActivatedRoute } from '@angular/router';
import { TimeTableDto, UserTimeTable, SelectedSlotDto } from './configAlert.model';
import { ToastService } from 'ng-uikit-pro-standard';
import { DataFilterService } from 'src/app/core/data-filter.service';

@Component({
  selector: 'app-alert-manager',
  templateUrl: './alert-manager.component.html',
  styleUrls: ['./alert-manager.component.scss']
})
export class AlertManagerComponent implements OnInit {
  selected247 = false;
  daysCheckBoxes = {};
  weekDaysList = [
    { id: 0, name: 'Monday' },
    { id: 1, name: 'Tuesday' },
    { id: 2, name: 'Wednesday' },
    { id: 3, name: 'Thursday' },
    { id: 4, name: 'Friday' },
    { id: 5, name: 'Saturday' },
    { id: 6, name: 'Sunday' }
  ];

  dayHoursList = [
    { id: 1, slot: 1, displayTime: '12' , dataVal: '00:00'},
    { id: 2, slot: 2, displayTime: '01' , dataVal: '01:00'},
    { id: 3, slot: 3, displayTime: '02' , dataVal: '02:00'},
    { id: 4, slot: 4, displayTime: '03' , dataVal: '03:00'},
    { id: 5, slot: 5, displayTime: '04' , dataVal: '04:00'},
    { id: 6, slot: 6, displayTime: '05' , dataVal: '05:00'},
    { id: 7, slot: 7, displayTime: '06' , dataVal: '06:00'},
    { id: 8, slot: 8, displayTime: '07' , dataVal: '07:00'},
    { id: 9, slot: 9, displayTime: '08' , dataVal: '08:00'},
    { id: 10, slot: 10, displayTime: '09' , dataVal: '09:00'},
    { id: 11, slot: 11, displayTime: '10' , dataVal: '10:00'},
    { id: 12, slot: 12, displayTime: '11' , dataVal: '11:00'},
    { id: 13, slot: 13, displayTime: '12' , dataVal: '12:00'},
    { id: 14, slot: 14, displayTime: '01' , dataVal: '13:00'},
    { id: 15, slot: 15, displayTime: '02' , dataVal: '14:00'},
    { id: 16, slot: 16, displayTime: '03' , dataVal: '15:00'},
    { id: 17, slot: 17, displayTime: '04' , dataVal: '16:00'},
    { id: 18, slot: 18, displayTime: '05' , dataVal: '17:00'},
    { id: 19, slot: 19, displayTime: '06' , dataVal: '18:00'},
    { id: 20, slot: 20, displayTime: '07' , dataVal: '19:00'},
    { id: 21, slot: 21, displayTime: '08' , dataVal: '20:00'},
    { id: 22, slot: 22, displayTime: '09' , dataVal: '21:00'},
    { id: 23, slot: 23, displayTime: '10' , dataVal: '22:00'},
    { id: 24, slot: 24, displayTime: '11' , dataVal: '23:00'}
  ];
  colors = ['navy', 'olive', 'orange', 'purple', 'red',
  'silver', 'teal', 'white', 'yellow', 'aqua', 'Magenta', 'blue', 'fuchsia', 'gray', 'green',
'lime', 'maroon'];
  patientId: number;
  facilityId: number;
  dummySelect = {
    2: 5
  };
  notificationUser = new CreateFacilityUserDto();
  providerList = new Array<CreateFacilityUserDto>();
  SelectedTimeSolts = new Array<SelectedSlotDto>(); /// her left side would be id of (weekDay) and right side would be id of (dayHour)
  SelectingSlot = { dayId: 0, hourId: 0 };

  constructor(
    private facilityService: FacilityService,
    private toaster: ToastService,
    private securityService: SecurityService,
    private dataFilterService: DataFilterService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.patientId = +this.route.snapshot.paramMap.get('id');
    if (
      this.securityService.securityObject.userType === UserType.FacilityUser
    ) {
      this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
      this.loadCareProviders();
    } else {
      this.facilityId = 0;
    }
  }
  getScheduleByFacilityId() {
    this.facilityService.getScheduleByFacilityId(this.facilityId)
      .subscribe(
        (res: Array<any>) => {
          if (res) {
            res.forEach(item => {
              const tempSelectedSlot = new SelectedSlotDto();
              const First = this.dayHoursList.find(x => x.dataVal === item.startHour).id;
              const Last = this.dayHoursList.find(x => x.dataVal === item.endHour)?.id;
              this.SelectingSlot.dayId = this.weekDaysList.find(val => val.name === item.dayName).id;
              this.SelectingSlot.hourId = 0;
              this.notificationUser = this.providerList.find(provider => provider.userId === item.applicationUserId);
              this.fillInBetweenTimeSlots(First, Last);
            });
          }
        },
        error => {
        }
      );
  }
  loadCareProviders() {
    this.facilityService
      .getCareProvidersByFacilityId(this.facilityId)
      .subscribe(
        (res: any) => {
          if (res) {
            this.providerList = res;
            if (this.providerList && this.providerList.length > 0) {
              this.providerList.forEach((element, index) => {
                element['color'] = this.colors[index];
              });
            }
            this.getScheduleByFacilityId();
          }
        },
        error => {
        }
      );
  }

  cellClicked( wDay: { id: number; name: string }, dHour: { id: number; slot: number; displayTime: string } ) {
    if (!this.notificationUser || !this.notificationUser['color']) {
      window.alert('No User Selected');
      return;
    }
    if (this.SlotAlreadyAssigned(wDay, dHour)) {
      window.alert('Slot Already Asssigned to current selected User');
      return;
    }
    // if ( this.SelectingSlot.dayId === 0 || wDay.id !== this.SelectingSlot.dayId ) {
    if ( wDay.id !== this.SelectingSlot.dayId ) {
      this.SelectingSlot.dayId = wDay.id;
      this.SelectingSlot.hourId = dHour.id;
    } else {
      if ( wDay.id === this.SelectingSlot.dayId && dHour.id !== this.SelectingSlot.hourId ) {
        this.fillInBetweenTimeSlots(dHour.id, this.SelectingSlot.hourId);
      } else {
      }
    }
  }
  fillInBetweenTimeSlots(first: number, last: number) {
    let var1 = 0;
    let var2 = 0;

    if (first > last) {
      var1 = last;
      var2 = first;
    } else {
      var2 = last;
      var1 = first;
    }
    for (let i = var1; i <= var2; i++) {
      this.SelectedTimeSolts.push({hourId: i, dayId: this.SelectingSlot.dayId, userId: this.notificationUser.id, color: this.notificationUser['color']});
      // list.push(i);
    }
    this.SelectingSlot.dayId = 0;
    this.SelectingSlot.hourId = 0;
  }
  IsSelected( wDay: { id: number; name: string }, dHour: { id: number; slot: number; displayTime: string } ) {
    let find  = false;
    this.SelectedTimeSolts.forEach(item => {
      if (item.dayId === wDay.id && item.hourId === dHour.id) {
        find = true;
      }
    }
    );
    return find;
  }

  getUsersOfSlot(wDay: { id: number; name: string }, dHour: { id: number; slot: number; displayTime: string }) {
    const usersOfSlotObj = new Array<SelectedSlotDto>();
    this.SelectedTimeSolts.forEach(item => {
      let tempObj = new SelectedSlotDto();
        if (item.dayId === wDay.id && item.hourId === dHour.id) {
          tempObj = item;
          tempObj['color'] = this.getUserColor(wDay, dHour, item.userId);
          usersOfSlotObj.push(tempObj);
        }
    });
    return usersOfSlotObj;
  }
  SlotAlreadyAssigned( wDay: { id: number; name: string }, dHour: { id: number; slot: number; displayTime: string } ) {
    let find  = false;
    this.SelectedTimeSolts.forEach(item => {
      if (item.dayId === wDay.id && item.hourId === dHour.id && item.userId === this.notificationUser.id) {
        find = true;
      }
    }
    );
    return find;
  }
  getUserColor( wDay: { id: number; name: string }, dHour: { id: number; slot: number; displayTime: string }, userId: number ) {
    let slotColor  = '';
    this.SelectedTimeSolts.forEach(item => {
      if (item.dayId === wDay.id && item.hourId === dHour.id && item.userId === userId) {
        slotColor = item['color'];
        // if (item.userId !== this.notificationUser.id) {
        //   slotColor = 'white';
        // }
      }
    });
    if (slotColor) {
      return slotColor;
    } else {
      return '#ff9292';
    }
  }
  dayChecked(isCheck: boolean, wDay: { id: number; name: string }) {
    if (!this.notificationUser || !this.notificationUser['color']) {
      window.alert('No User Selected');
      this.daysCheckBoxes = {};
      return;
    }
    if (isCheck) {
      for (let i = 1; i <= 24; i++) {
        this.SelectedTimeSolts.push({hourId: i, dayId: wDay.id, userId: this.notificationUser.id, color: this.notificationUser['color']});
      }
    } else {
      const result = new Array<any>();
      this.SelectedTimeSolts.forEach(item => {
        if (item.userId === this.notificationUser.id && item.dayId === wDay.id) {
        } else {
          result.push(item);
        }
      });
      this.SelectedTimeSolts = result;
    }
  }
  weekSelected(isCheck: boolean) {
    if (!this.notificationUser || !this.notificationUser['color']) {
      window.alert('No User Selected');
      this.selected247 = false;
      return;
    }
    if (isCheck) {
      for (let wDay = 0; wDay <= 6 ; wDay++) {
        for (let i = 1; i <= 24; i++) {
          this.SelectedTimeSolts.push({hourId: i, dayId: wDay, userId: this.notificationUser.id, color: this.notificationUser['color']});
        }
      }
      for (let wDay = 0; wDay <= 6 ; wDay++) {
        this.daysCheckBoxes[wDay] = true;
      }
    } else {
      const result = new Array<any>();
      this.SelectedTimeSolts.forEach(item => {
        if (item.userId === this.notificationUser.id) {
        } else {
          result.push(item);
        }
      });
      this.SelectedTimeSolts = result;
      this.daysCheckBoxes = {};
    }
  }
  SaveCareProvidersSchedule() {
    const timeTable = new TimeTableDto();
    if (this.SelectedTimeSolts.length > 0) {
        let slot = this.SelectedTimeSolts[0];
        this.SelectedTimeSolts.forEach((item, index, arr) => {
          if (slot.userId !== item.userId || slot.dayId !== item.dayId) {
            const UserTime = new UserTimeTable();
          const usrId = this.providerList.find(x => x.id === slot.userId).userId;
          UserTime.applicationUserId = usrId;
          UserTime.schedule.push({
            dayName: slot.dayId, startHour: this.getSlotDataVal(slot.hourId), endHour: this.getSlotDataVal(arr[index - 1].hourId)
          });
          timeTable.timeTable.push(UserTime);
          slot = item;
        }
        if (index === arr.length - 1) {
          const UserTime = new UserTimeTable();
          const usrId = this.providerList.find(x => x.id === item.userId).userId;
          UserTime.applicationUserId = usrId;
          UserTime.schedule.push({
            dayName: slot.dayId, startHour: this.getSlotDataVal(slot.hourId), endHour: this.getSlotDataVal(item.hourId)
          });
          timeTable.timeTable.push(UserTime);
        }
      });
      timeTable.facilityId = this.facilityId;
      this.facilityService.AddCareProviderSchedule(timeTable).subscribe(res => {
        // this.SelectingSlot = { dayId: 0, hourId: 0 };
        // this.SelectedTimeSolts = new Array<SelectedSlotDto>();
        this.toaster.success('Data Saved Successfully');
        // this.daysCheckBoxes = {};
        // this.selected247 = false;
      }, err => {
        this.toaster.error('Error Saving Data');
      });
    } else {
      this.toaster.warning('Please Fill Schedule');
    }
  }

  getSlotDataVal(slotHour: number): string {
    return this.dayHoursList.find(x => x.id === slotHour).dataVal;
  }

  isAllSlotsFilled() {
    if (this.SelectedTimeSolts) {
      this.dataFilterService.distictArrayByProperty(this.SelectedTimeSolts, 'userId');
    }
  }
}
