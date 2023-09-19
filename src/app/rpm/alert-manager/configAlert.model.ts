export class TimeTableDto {
  facilityId = 0;
  timeTable = new Array<UserTimeTable>();
}
export class UserTimeTable {
  applicationUserId = '';
  isAllWeekend = false;
  schedule = new Array<{
    dayName: number;
    startHour: string;
    endHour: string;
  }>();
}
export class SelectedSlotDto {
  dayId: number;
  hourId: number;
  userId: number;
  color: string;
}
