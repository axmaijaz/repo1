import {

  DepartmentType,
  ComplaintStatus,
  ComplaintPriority,
  ComplaintTypeEnum,
} from 'src/app/Enums/complaints.enum';
import { SortOrder } from 'src/app/Enums/filterPatient.enum';
import { PagingData } from './app.model';

export class PagedPatientComplaintListDto {
  pagingData: PagingData;
  // resolved: number;
  // pending: number;
  // totalComplaints: number;

  complaintStatusStats: ComplaintStatusStatsDto[] = [];
  complaintsList: ComplaintForListDto[] = [];
  departmentStats: DepartmentStatsDto[] = [];
}
export class ComplaintStatusStatsDto {
  status: string;
  totalCount: number;
  perDayCount: number;
  perWeekCount: number;
  perMonthCount: number;
}
export class DepartmentStatsDto {
  departmentType: DepartmentType;
  closedCount: number;
  perDayCount: number;
  perWeekCount: number;
  perMonthCount: number;
}

export class ComplaintForListDto {
  id: number;
  patientEmrId = '';
  fullName = '';
  facilityName = '';
  assignedFacilityUserName = '';
  // complaintType: ComplaintTypeEnum;
  departmentType: DepartmentType;
  complaintStatus: ComplaintStatus;
  complaintPriority: ComplaintPriority;
  details = '';
  ticketNo = '';
  comments: string[];
  updatedOn: Date | string;
  complaintType: string;
  complaintTypeId: number;
  complaintSubType: string;
  complaintSubTypeId: number;
  actionDate: string;
}

export class AddComplaintDto {
  complaintTypeId: number;
  complaintSubTypeId: number;
  id: number;
  patientId: number;
  complaintType: number;
  departmentType: number;
  details = '';
  comment = '';
}
export class EditComplaintDto {
  id: number;
  // complaintType: number;
  complaintTypeId: number;
  complaintSubTypeId: number;
  departmentType: number;
  complaintStatus: number;
  assignedFacilityUserId: number;
  complaintPriority: ComplaintPriority;
  details = '';
  comment = '';
  actionDate: string;
}

export class ComplaintsDashboardFilterDto {
  complaintStatus: ComplaintStatus = -1;
  pageNumber = 1;
  pageSize = 20;
  facilityUserIds= [0];
  departmentTypes = '';
  updatedOn = '';
  sortBy = '';
  sortOrder: SortOrder = 0;
  facilityId = 0;
  createdOnFrom = '';
  createdOnTo = '';
  complaintTypeIds = '';
  complaintSubTypeIds = '';
  ticketNumber = '';
  nameAndEMRID = '';
  phoneNo = '';
  dOB = '';
;
}
export class ComplaintListDto {
  id: number;
  patientEmrId?: any;
  fullName?: any;
  complaintType: string;
  complaintTypeId: number
  complaintSubTypeId: number;
  complaintSubType: string;
  departmentType: number;
  complaintStatus: number;
  details = '';
  ticketNo = '';
  comments: any[];
  updatedOn = '';
  actionDate: string;
}

export class ComplaintDetailDto {
  id: number;
  patientEmrId: string;
  fullName: string;
  facilityName: string;
  assignedFacilityUserName: string;
  // complaintType: ComplaintTypeEnum;
  departmentType: DepartmentType;
  complaintStatus: ComplaintStatus;
  details: string;
  ticketNo: string;
  patientSecondaryPhoneNo: string;
  patientDob: string;
  patientPrimaryPhoneNo: string;
  comments: string[] = [];
  patientComplaintDocuments: ComplaintDocDto[] = [];
  patientComplaintComments: ComplaintCommentDto[] = [];
  patientComplaintRecording: ComplaintRecordingDto;
  logDetails: string;
  updatedOn: Date | string;
  patientId: number;
  facilityId: number;
  complaintTypeId: number;
  actionDate: string;
}

export class ComplaintDocDto {
  id: number;
  title: string;
  path: string;
}
export class ComplaintRecordingDto {
  id: number;
  title: string;
  path: string;
}

export class ComplaintCommentDto {
  id: number;
  comment: string;
}
