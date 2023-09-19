export class To {
  phoneNumber: string;
  name: string;
  location: string;
}

export class From {
  phoneNumber: string;
  name: string;
  location: string;
}

export class Attachment {
  id: any;
  uri: string;
  type: string;
  contentType: string;
  size?: number;
  width?: number;
  height?: number;
}

export class Conversation {
  id: string;
  uri: string;
}

export class Record {
  uri: string;
  id: any;
  to: To[];
  from: From;
  type: string;
  creationTime: Date;
  readStatus: string;
  priority: string;
  attachments: Attachment[];
  direction: string;
  availability: string;
  subject: string;
  messageStatus: string;
  conversationId: any;
  conversation: Conversation;
  lastModifiedTime: Date;
  smsSendingAttemptsCount?: number;
}

export class Paging {
  page: number;
  totalPages: number;
  perPage: number;
  totalElements: number;
  pageStart: number;
  pageEnd: number;
}

export class FirstPage {
  uri: string;
}

export class LastPage {
  uri: string;
}

export class Navigation {
  firstPage: FirstPage;
  lastPage: LastPage;
}

export class RingCentralMessagesDto {
  uri: string;
  records: Record[];
  paging: Paging;
  navigation: Navigation;
}
export class RCPhoneRecordDto {
  uri: string
  id: number
  country: Country
  contactCenterProvider: any
  extension: any
  label?: string
  location: string
  paymentType: string
  phoneNumber: string
  status: string
  type: string
  usageType: string
  features: string[]
}

export class Country {
  id: string
  uri: string
  name: string
  isoCode: any
  callingCode: any
}
