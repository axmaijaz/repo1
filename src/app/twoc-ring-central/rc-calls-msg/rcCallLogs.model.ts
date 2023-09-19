export class To {
  name: string;
  extensionId: string;
  extensionNumber: string;
}

export class From {
  name: string;
  extensionNumber: string;
}

export class Extension {
  uri: string;
  id: number;
}

export class Record {
  uri: string;
  id: string;
  sessionId: string;
  startTime: Date;
  duration: number;
  type: string;
  direction: string;
  action: string;
  result: string;
  to: To;
  from: From;
  extension: Extension;
  telephonySessionId: string;
}

export class Paging {
  page: number;
  perPage: number;
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

export class RCCallDto {
  uri: string;
  records: Record[];
  paging: Paging;
  navigation: Navigation;
}
