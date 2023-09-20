import { OnInit, EventEmitter, ChangeDetectorRef, OnChanges, SimpleChanges, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MdbTableDirective } from '../directives/mdb-table.directive';
import * as ɵngcc0 from '@angular/core';
export interface MdbPaginationIndex {
    first: number;
    last: number;
}
export declare class MdbTablePaginationComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    private cdRef;
    tableEl: MdbTableDirective;
    searchPagination: boolean;
    searchDataSource: any;
    ofKeyword: string;
    dashKeyword: string;
    paginationAlign: string;
    hideDescription: boolean;
    private _destroy$;
    maxVisibleItems: number;
    firstItemIndex: number;
    lastItemIndex: number;
    lastVisibleItemIndex: number;
    activePageNumber: number;
    allItemsLength: number;
    nextShouldBeDisabled: boolean;
    previousShouldBeDisabled: boolean;
    searchText: string;
    pagination: Subject<MdbPaginationIndex>;
    nextPageClick: EventEmitter<MdbPaginationIndex>;
    previousPageClick: EventEmitter<MdbPaginationIndex>;
    firstPageClick: EventEmitter<MdbPaginationIndex>;
    lastPageClick: EventEmitter<MdbPaginationIndex>;
    constructor(cdRef: ChangeDetectorRef);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    setMaxVisibleItemsNumberTo(value: number): void;
    searchTextObs(): Observable<any>;
    disableNextButton(data: any): void;
    calculateFirstItemIndex(): void;
    calculateLastItemIndex(): void;
    paginationChange(): Observable<any>;
    calculateHowManyPagesShouldBe(): number;
    previousPage(): void;
    nextPage(): void;
    firstPage(): void;
    lastPage(): void;
    nextPageObservable(): Observable<any>;
    previousPageObservable(): Observable<any>;
    checkIfNextShouldBeDisabled(): true | undefined;
    checkIfPreviousShouldBeDisabled(): true | undefined;
    ngOnDestroy(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MdbTablePaginationComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<MdbTablePaginationComponent, "mdb-table-pagination", never, { "searchPagination": "searchPagination"; "searchDataSource": "searchDataSource"; "ofKeyword": "ofKeyword"; "dashKeyword": "dashKeyword"; "paginationAlign": "paginationAlign"; "hideDescription": "hideDescription"; "tableEl": "tableEl"; }, { "nextPageClick": "nextPageClick"; "previousPageClick": "previousPageClick"; "firstPageClick": "firstPageClick"; "lastPageClick": "lastPageClick"; }, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWRiLXRhYmxlLXBhZ2luYXRpb24uY29tcG9uZW50LmQudHMiLCJzb3VyY2VzIjpbIm1kYi10YWJsZS1wYWdpbmF0aW9uLmNvbXBvbmVudC5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0RBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT25Jbml0LCBFdmVudEVtaXR0ZXIsIENoYW5nZURldGVjdG9yUmVmLCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgTWRiVGFibGVEaXJlY3RpdmUgfSBmcm9tICcuLi9kaXJlY3RpdmVzL21kYi10YWJsZS5kaXJlY3RpdmUnO1xuZXhwb3J0IGludGVyZmFjZSBNZGJQYWdpbmF0aW9uSW5kZXgge1xuICAgIGZpcnN0OiBudW1iZXI7XG4gICAgbGFzdDogbnVtYmVyO1xufVxuZXhwb3J0IGRlY2xhcmUgY2xhc3MgTWRiVGFibGVQYWdpbmF0aW9uQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gICAgcHJpdmF0ZSBjZFJlZjtcbiAgICB0YWJsZUVsOiBNZGJUYWJsZURpcmVjdGl2ZTtcbiAgICBzZWFyY2hQYWdpbmF0aW9uOiBib29sZWFuO1xuICAgIHNlYXJjaERhdGFTb3VyY2U6IGFueTtcbiAgICBvZktleXdvcmQ6IHN0cmluZztcbiAgICBkYXNoS2V5d29yZDogc3RyaW5nO1xuICAgIHBhZ2luYXRpb25BbGlnbjogc3RyaW5nO1xuICAgIGhpZGVEZXNjcmlwdGlvbjogYm9vbGVhbjtcbiAgICBwcml2YXRlIF9kZXN0cm95JDtcbiAgICBtYXhWaXNpYmxlSXRlbXM6IG51bWJlcjtcbiAgICBmaXJzdEl0ZW1JbmRleDogbnVtYmVyO1xuICAgIGxhc3RJdGVtSW5kZXg6IG51bWJlcjtcbiAgICBsYXN0VmlzaWJsZUl0ZW1JbmRleDogbnVtYmVyO1xuICAgIGFjdGl2ZVBhZ2VOdW1iZXI6IG51bWJlcjtcbiAgICBhbGxJdGVtc0xlbmd0aDogbnVtYmVyO1xuICAgIG5leHRTaG91bGRCZURpc2FibGVkOiBib29sZWFuO1xuICAgIHByZXZpb3VzU2hvdWxkQmVEaXNhYmxlZDogYm9vbGVhbjtcbiAgICBzZWFyY2hUZXh0OiBzdHJpbmc7XG4gICAgcGFnaW5hdGlvbjogU3ViamVjdDxNZGJQYWdpbmF0aW9uSW5kZXg+O1xuICAgIG5leHRQYWdlQ2xpY2s6IEV2ZW50RW1pdHRlcjxNZGJQYWdpbmF0aW9uSW5kZXg+O1xuICAgIHByZXZpb3VzUGFnZUNsaWNrOiBFdmVudEVtaXR0ZXI8TWRiUGFnaW5hdGlvbkluZGV4PjtcbiAgICBmaXJzdFBhZ2VDbGljazogRXZlbnRFbWl0dGVyPE1kYlBhZ2luYXRpb25JbmRleD47XG4gICAgbGFzdFBhZ2VDbGljazogRXZlbnRFbWl0dGVyPE1kYlBhZ2luYXRpb25JbmRleD47XG4gICAgY29uc3RydWN0b3IoY2RSZWY6IENoYW5nZURldGVjdG9yUmVmKTtcbiAgICBuZ09uSW5pdCgpOiB2b2lkO1xuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkO1xuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkO1xuICAgIHNldE1heFZpc2libGVJdGVtc051bWJlclRvKHZhbHVlOiBudW1iZXIpOiB2b2lkO1xuICAgIHNlYXJjaFRleHRPYnMoKTogT2JzZXJ2YWJsZTxhbnk+O1xuICAgIGRpc2FibGVOZXh0QnV0dG9uKGRhdGE6IGFueSk6IHZvaWQ7XG4gICAgY2FsY3VsYXRlRmlyc3RJdGVtSW5kZXgoKTogdm9pZDtcbiAgICBjYWxjdWxhdGVMYXN0SXRlbUluZGV4KCk6IHZvaWQ7XG4gICAgcGFnaW5hdGlvbkNoYW5nZSgpOiBPYnNlcnZhYmxlPGFueT47XG4gICAgY2FsY3VsYXRlSG93TWFueVBhZ2VzU2hvdWxkQmUoKTogbnVtYmVyO1xuICAgIHByZXZpb3VzUGFnZSgpOiB2b2lkO1xuICAgIG5leHRQYWdlKCk6IHZvaWQ7XG4gICAgZmlyc3RQYWdlKCk6IHZvaWQ7XG4gICAgbGFzdFBhZ2UoKTogdm9pZDtcbiAgICBuZXh0UGFnZU9ic2VydmFibGUoKTogT2JzZXJ2YWJsZTxhbnk+O1xuICAgIHByZXZpb3VzUGFnZU9ic2VydmFibGUoKTogT2JzZXJ2YWJsZTxhbnk+O1xuICAgIGNoZWNrSWZOZXh0U2hvdWxkQmVEaXNhYmxlZCgpOiB0cnVlIHwgdW5kZWZpbmVkO1xuICAgIGNoZWNrSWZQcmV2aW91c1Nob3VsZEJlRGlzYWJsZWQoKTogdHJ1ZSB8IHVuZGVmaW5lZDtcbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkO1xufVxuIl19