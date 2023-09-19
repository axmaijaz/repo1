import { AfterContentInit, EventEmitter, OnDestroy, OnInit, QueryList } from '@angular/core';
import { ScrollSpyLinkDirective } from './scroll-spy-link.directive';
import { ScrollSpyService } from './scroll-spy.service';
import { Subscription } from 'rxjs';
import * as ɵngcc0 from '@angular/core';
export declare class ScrollSpyDirective implements OnInit, AfterContentInit, OnDestroy {
    private scrollSpyService;
    links: QueryList<ScrollSpyLinkDirective>;
    id: string;
    private _id;
    activeLinkChange: EventEmitter<any>;
    activeSub: Subscription;
    constructor(scrollSpyService: ScrollSpyService);
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ScrollSpyDirective, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<ScrollSpyDirective, "[mdbScrollSpy]", never, { "id": "mdbScrollSpy"; }, { "activeLinkChange": "activeLinkChange"; }, ["links"], ["*"]>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLXNweS5kaXJlY3RpdmUuZC50cyIsInNvdXJjZXMiOlsic2Nyb2xsLXNweS5kaXJlY3RpdmUuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7QUFJQTs7Ozs7Ozs7Ozs7OztBQVdBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJDb250ZW50SW5pdCwgRXZlbnRFbWl0dGVyLCBPbkRlc3Ryb3ksIE9uSW5pdCwgUXVlcnlMaXN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTY3JvbGxTcHlMaW5rRGlyZWN0aXZlIH0gZnJvbSAnLi9zY3JvbGwtc3B5LWxpbmsuZGlyZWN0aXZlJztcbmltcG9ydCB7IFNjcm9sbFNweVNlcnZpY2UgfSBmcm9tICcuL3Njcm9sbC1zcHkuc2VydmljZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIFNjcm9sbFNweURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95IHtcbiAgICBwcml2YXRlIHNjcm9sbFNweVNlcnZpY2U7XG4gICAgbGlua3M6IFF1ZXJ5TGlzdDxTY3JvbGxTcHlMaW5rRGlyZWN0aXZlPjtcbiAgICBpZDogc3RyaW5nO1xuICAgIHByaXZhdGUgX2lkO1xuICAgIGFjdGl2ZUxpbmtDaGFuZ2U6IEV2ZW50RW1pdHRlcjxhbnk+O1xuICAgIGFjdGl2ZVN1YjogU3Vic2NyaXB0aW9uO1xuICAgIGNvbnN0cnVjdG9yKHNjcm9sbFNweVNlcnZpY2U6IFNjcm9sbFNweVNlcnZpY2UpO1xuICAgIG5nT25Jbml0KCk6IHZvaWQ7XG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCk6IHZvaWQ7XG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZDtcbn1cbiJdfQ==