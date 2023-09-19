import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpErrorHandlerService } from '../shared/http-handler/http-error-handler.service';
import { SecurityService } from './security/security.service';
import { catchError } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ChatGroupDto, SearchedChatUsersDto } from '../model/chat/chat.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class TwocChatService {
  private baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  constructor(
    private http: HttpClient,
    private httpErrorService: HttpErrorHandlerService
  ) {}
  GetPersonalChatGroup(senderUserId: string, recepientUserId: string) {
    return this.http.get<ChatGroupDto>(this.baseUrl + `Chat/GetPersonalChatGroup?senderUserId=${senderUserId}&recepientUserId=${recepientUserId}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetChatChannelsByUserId(userId: string) {
    return this.http.get<string[]>(this.baseUrl + `Chat/GetChatChannelsByUserId/${userId}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }


  GetChatGroupsByUserId(userId: string) {
    return this.http.get<ChatGroupDto[]>(this.baseUrl + `Chat/GetChatGroupsByUserId/${userId}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SearchChatUsers(AppUserId: string, CurrentFacilityId: number, SearchString: string, UserTypeToSearch: number) {
    return this.http.get<SearchedChatUsersDto[]>(this.baseUrl + `Chat/SearchChatUsers?AppUserId=${AppUserId}&CurrentFacilityId=${CurrentFacilityId}
    &SearchString=${SearchString}&UserTypeToSearch=${UserTypeToSearch}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
