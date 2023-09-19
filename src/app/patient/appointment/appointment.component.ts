import { Component, OnInit} from '@angular/core';
import { CalendarView, CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { CcmDataService } from 'src/app/core/ccm-data.service';
import { SecurityService } from 'src/app/core/security/security.service';
import * as moment from 'moment';
import { ToastService } from 'ng-uikit-pro-standard';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})

export class AppointmentComponent implements OnInit {
  followUpDataObj = {
    patientId: 0,
    followUpDate: '',
    recentPcpAppointment: '',
    recentHospitalizationDate : '',
  };

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate : Date | string= new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
    // {
    //   start: subDays(startOfDay(new Date()), 1),
    //   end: addDays(new Date(), 1),
    //   title: 'A 3 day event',
    //   color: colors.red,
    //   actions: this.actions,
    //   allDay: true,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true
    //   },
    //   draggable: true
    // },
    // {
    //   start: startOfDay(new Date()),
    //   title: 'An event with no end date',
    //   color: colors.yellow,
    //   actions: this.actions
    // },
    // {
    //   start: subDays(endOfMonth(new Date()), 3),
    //   end: addDays(endOfMonth(new Date()), 3),
    //   title: 'A long event that spans 2 months',
    //   color: colors.blue,
    //   allDay: true
    // },
    // {
    //   start: addHours(startOfDay(new Date()), 2),
    //   end: new Date(),
    //   title: 'A draggable and resizable event',
    //   color: colors.yellow,
    //   actions: this.actions,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true
    //   },
    //   draggable: true
    // }
  ];

  activeDayIsOpen = true;

  constructor(private securityService: SecurityService, private ccmService: CcmDataService, private toaster: ToastService) { }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: "lg" });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      }
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(event => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  ngOnInit() {
    this.getFollowUpDate();
  }

  getFollowUpDate() {
    this.ccmService.getfollowUpDate(this.securityService.securityObject.id).subscribe(
      res => {

        Object.assign(this.followUpDataObj, res);
        // this.toaster.success('Data Updated Successfully');
        if (this.followUpDataObj.followUpDate) {
          this.followUpDataObj.followUpDate = new Date(this.followUpDataObj.followUpDate).toLocaleString();
          // this.followUpDataObj.followUpDate = moment(this.followUpDataObj.followUpDate).format('YYYY-MM-DD hh:mm A');
          this.viewDate = this.followUpDataObj.followUpDate;
        }

        if (this.followUpDataObj.recentPcpAppointment) {
          this.followUpDataObj.recentPcpAppointment = moment(this.followUpDataObj.recentPcpAppointment).format('YYYY-MM-DD hh:mm A');
        }

        if (this.followUpDataObj.recentHospitalizationDate ) {

          this.followUpDataObj.recentHospitalizationDate  = this.followUpDataObj.recentHospitalizationDate .slice(0, 10);
        }
        // startDateTime  = moment(this.followUpDataObj.followUpDate).hours() - 1 + '.' + '05'; /// for minutes
        const hours = moment(this.followUpDataObj.followUpDate).hours();
        const apDate = new Date(this.followUpDataObj.followUpDate).toLocaleDateString();
        const cEvent = {
            start: addHours(apDate, hours),
            title: `Upcoming Appointment ${this.followUpDataObj.followUpDate}`,
            color: colors.blue,
            actions: []
            // actions: this.actions
          };
          this.events = [...this.events, cEvent];
      },
      err => {
        this.toaster.error('Error Getting Data');
      }
    );
  }
}
