import { ElementRef, OnInit, Renderer2, NgZone, AfterViewInit } from '@angular/core';
import { ScrollSpyService } from './scroll-spy.service';
import * as ɵngcc0 from '@angular/core';
export declare class ScrollSpyWindowDirective implements OnInit, AfterViewInit {
    private document;
    private el;
    private renderer;
    private ngZone;
    private scrollSpyService;
    private id;
    scrollSpyId: string;
    private _scrollSpyId;
    offset: number;
    constructor(document: any, el: ElementRef, renderer: Renderer2, ngZone: NgZone, scrollSpyService: ScrollSpyService);
    isElementInViewport(): boolean;
    updateActiveState(scrollSpyId: string, id: string): void;
    onScroll(): void;
    listenToScroll(): void;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ScrollSpyWindowDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<ScrollSpyWindowDirective, "[mdbScrollSpyWindow]", never, { "offset": "offset"; "scrollSpyId": "mdbScrollSpyWindow"; }, {}, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLXNweS13aW5kb3cuZGlyZWN0aXZlLmQudHMiLCJzb3VyY2VzIjpbInNjcm9sbC1zcHktd2luZG93LmRpcmVjdGl2ZS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVsZW1lbnRSZWYsIE9uSW5pdCwgUmVuZGVyZXIyLCBOZ1pvbmUsIEFmdGVyVmlld0luaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFNjcm9sbFNweVNlcnZpY2UgfSBmcm9tICcuL3Njcm9sbC1zcHkuc2VydmljZSc7XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBTY3JvbGxTcHlXaW5kb3dEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQge1xuICAgIHByaXZhdGUgZG9jdW1lbnQ7XG4gICAgcHJpdmF0ZSBlbDtcbiAgICBwcml2YXRlIHJlbmRlcmVyO1xuICAgIHByaXZhdGUgbmdab25lO1xuICAgIHByaXZhdGUgc2Nyb2xsU3B5U2VydmljZTtcbiAgICBwcml2YXRlIGlkO1xuICAgIHNjcm9sbFNweUlkOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfc2Nyb2xsU3B5SWQ7XG4gICAgb2Zmc2V0OiBudW1iZXI7XG4gICAgY29uc3RydWN0b3IoZG9jdW1lbnQ6IGFueSwgZWw6IEVsZW1lbnRSZWYsIHJlbmRlcmVyOiBSZW5kZXJlcjIsIG5nWm9uZTogTmdab25lLCBzY3JvbGxTcHlTZXJ2aWNlOiBTY3JvbGxTcHlTZXJ2aWNlKTtcbiAgICBpc0VsZW1lbnRJblZpZXdwb3J0KCk6IGJvb2xlYW47XG4gICAgdXBkYXRlQWN0aXZlU3RhdGUoc2Nyb2xsU3B5SWQ6IHN0cmluZywgaWQ6IHN0cmluZyk6IHZvaWQ7XG4gICAgb25TY3JvbGwoKTogdm9pZDtcbiAgICBsaXN0ZW5Ub1Njcm9sbCgpOiB2b2lkO1xuICAgIG5nT25Jbml0KCk6IHZvaWQ7XG4gICAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQ7XG59XG4iXX0=