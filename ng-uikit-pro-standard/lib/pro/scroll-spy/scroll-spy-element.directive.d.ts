import { ElementRef, OnInit, Renderer2, NgZone, AfterViewInit } from '@angular/core';
import { ScrollSpyService } from './scroll-spy.service';
import * as ɵngcc0 from '@angular/core';
export declare class ScrollSpyElementDirective implements OnInit, AfterViewInit {
    private el;
    private renderer;
    private ngZone;
    private scrollSpyService;
    private id;
    scrollSpyId: string;
    private _scrollSpyId;
    offset: number;
    constructor(el: ElementRef, renderer: Renderer2, ngZone: NgZone, scrollSpyService: ScrollSpyService);
    isElementInViewport(): boolean;
    updateActiveState(scrollSpyId: string, id: string): void;
    onScroll(): void;
    listenToScroll(): void;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ScrollSpyElementDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<ScrollSpyElementDirective, "[mdbScrollSpyElement]", never, { "offset": "offset"; "scrollSpyId": "mdbScrollSpyElement"; }, {}, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLXNweS1lbGVtZW50LmRpcmVjdGl2ZS5kLnRzIiwic291cmNlcyI6WyJzY3JvbGwtc3B5LWVsZW1lbnQuZGlyZWN0aXZlLmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbGVtZW50UmVmLCBPbkluaXQsIFJlbmRlcmVyMiwgTmdab25lLCBBZnRlclZpZXdJbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTY3JvbGxTcHlTZXJ2aWNlIH0gZnJvbSAnLi9zY3JvbGwtc3B5LnNlcnZpY2UnO1xuZXhwb3J0IGRlY2xhcmUgY2xhc3MgU2Nyb2xsU3B5RWxlbWVudERpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG4gICAgcHJpdmF0ZSBlbDtcbiAgICBwcml2YXRlIHJlbmRlcmVyO1xuICAgIHByaXZhdGUgbmdab25lO1xuICAgIHByaXZhdGUgc2Nyb2xsU3B5U2VydmljZTtcbiAgICBwcml2YXRlIGlkO1xuICAgIHNjcm9sbFNweUlkOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfc2Nyb2xsU3B5SWQ7XG4gICAgb2Zmc2V0OiBudW1iZXI7XG4gICAgY29uc3RydWN0b3IoZWw6IEVsZW1lbnRSZWYsIHJlbmRlcmVyOiBSZW5kZXJlcjIsIG5nWm9uZTogTmdab25lLCBzY3JvbGxTcHlTZXJ2aWNlOiBTY3JvbGxTcHlTZXJ2aWNlKTtcbiAgICBpc0VsZW1lbnRJblZpZXdwb3J0KCk6IGJvb2xlYW47XG4gICAgdXBkYXRlQWN0aXZlU3RhdGUoc2Nyb2xsU3B5SWQ6IHN0cmluZywgaWQ6IHN0cmluZyk6IHZvaWQ7XG4gICAgb25TY3JvbGwoKTogdm9pZDtcbiAgICBsaXN0ZW5Ub1Njcm9sbCgpOiB2b2lkO1xuICAgIG5nT25Jbml0KCk6IHZvaWQ7XG4gICAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQ7XG59XG4iXX0=