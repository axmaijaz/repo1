import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AVCallDto } from '../model/chat/chat.model';

@Injectable({
  providedIn: 'root'
})
export class VideoCallingService {
  public loadCallingSubject = new Subject<boolean>();
  public isCallingComponentLoadedSubject = new Subject<boolean>();
  public newCallReqSubject = new Subject<AVCallDto>();
  public isCallingComponentLoaded = false;
  public ActiveOnAnotherCall = false;
  constructor() { }
  loadCallingComponent() {
    this.loadCallingSubject.next(true);
  }
  makeNewCall(data: AVCallDto) {
    if (this.isCallingComponentLoaded) {
      this.newCallReqSubject.next(data);
    } else {
      this.loadCallingComponent();
      this.isCallingComponentLoadedSubject.subscribe((loaded: boolean) => {
        this.newCallReqSubject.next(data);
      });
    }
  }
}
