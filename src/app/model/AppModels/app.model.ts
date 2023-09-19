export class PagingData {
  pageNumber = 1;
  pageSize = 10;
  pageCount = 0;
  elementsCount = 0;
}
export class Page {
  // The number of elements in the page
  size = 0;
  // The total number of elements
  totalElements = 0;
  // The total number of pages
  totalPages = 0;
  // The current page number
  pageNumber = 1;
}
export class VerifyModalDto {
  Title: string;
  callBack: Function;
  data: any;
}

export class LazyModalDto {
  Title: string;
  Text: string;
  data: any;
  hideProceed?: boolean;
  callBack: Function;
  sBtnText?: string;
  rejectButtonText?: string;
  acceptButtonText?: string;
  rejectCallBack?: Function;
}
export enum RCVIewState {
  expand = 1,
  minimize,
  hidden,
  show,
}
export enum TwoCModulesEnum {
  CCM = 0,
  RPM = 1,
  TCM = 2,
  BHI = 3,
  PrCM = 4,
  AWV = 5
}
export class AppStatistics {
  totalOrganizations: number;
  totalFacilities: number;
  totalPatients: number;
  totalFacilityUsers: number;
}
export class AnnouncementListDto {
  id = 0;
  announcement: string;
  url: string;
  isActiveState: string;
}
export class AddEditAnnouncement {
  id = 0;
  announcement: string;
  url: string;
}
export class ChangeAnnouncementStatus{
  id: number;
  isActive: boolean;
}
