import { ElementRef, QueryList, EventEmitter, ChangeDetectorRef, AfterContentInit, OnDestroy } from '@angular/core';
import { RouterLinkWithHref, Router } from '@angular/router';
import * as ɵngcc0 from '@angular/core';
export interface IAccordionAnimationState {
    state: string;
    accordionEl: ElementRef;
}
export declare class SBItemBodyComponent implements AfterContentInit, OnDestroy {
    el: ElementRef;
    private _cdRef;
    private router;
    customClass: string;
    animationStateChange: EventEmitter<IAccordionAnimationState>;
    routerLinks: QueryList<RouterLinkWithHref>;
    bodyEl: ElementRef;
    autoExpand: boolean;
    collapsed: boolean;
    id: string;
    height: string;
    private _destroy$;
    expandAnimationState: string;
    ariaLabelledBy: string;
    constructor(el: ElementRef, _cdRef: ChangeDetectorRef, router: Router);
    toggle(collapsed: boolean): void;
    animationCallback(): void;
    openSidenavOnActiveLink(): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<SBItemBodyComponent, [null, null, { optional: true; }]>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<SBItemBodyComponent, "mdb-item-body, mdb-accordion-item-body", ["sbItemBody"], { "customClass": "customClass"; }, { "animationStateChange": "animationStateChange"; }, ["routerLinks"], ["*"]>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ItaXRlbS5ib2R5LmQudHMiLCJzb3VyY2VzIjpbInNiLWl0ZW0uYm9keS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRWxlbWVudFJlZiwgUXVlcnlMaXN0LCBFdmVudEVtaXR0ZXIsIENoYW5nZURldGVjdG9yUmVmLCBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlckxpbmtXaXRoSHJlZiwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmV4cG9ydCBpbnRlcmZhY2UgSUFjY29yZGlvbkFuaW1hdGlvblN0YXRlIHtcbiAgICBzdGF0ZTogc3RyaW5nO1xuICAgIGFjY29yZGlvbkVsOiBFbGVtZW50UmVmO1xufVxuZXhwb3J0IGRlY2xhcmUgY2xhc3MgU0JJdGVtQm9keUNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSB7XG4gICAgZWw6IEVsZW1lbnRSZWY7XG4gICAgcHJpdmF0ZSBfY2RSZWY7XG4gICAgcHJpdmF0ZSByb3V0ZXI7XG4gICAgY3VzdG9tQ2xhc3M6IHN0cmluZztcbiAgICBhbmltYXRpb25TdGF0ZUNoYW5nZTogRXZlbnRFbWl0dGVyPElBY2NvcmRpb25BbmltYXRpb25TdGF0ZT47XG4gICAgcm91dGVyTGlua3M6IFF1ZXJ5TGlzdDxSb3V0ZXJMaW5rV2l0aEhyZWY+O1xuICAgIGJvZHlFbDogRWxlbWVudFJlZjtcbiAgICBhdXRvRXhwYW5kOiBib29sZWFuO1xuICAgIGNvbGxhcHNlZDogYm9vbGVhbjtcbiAgICBpZDogc3RyaW5nO1xuICAgIGhlaWdodDogc3RyaW5nO1xuICAgIHByaXZhdGUgX2Rlc3Ryb3kkO1xuICAgIGV4cGFuZEFuaW1hdGlvblN0YXRlOiBzdHJpbmc7XG4gICAgYXJpYUxhYmVsbGVkQnk6IHN0cmluZztcbiAgICBjb25zdHJ1Y3RvcihlbDogRWxlbWVudFJlZiwgX2NkUmVmOiBDaGFuZ2VEZXRlY3RvclJlZiwgcm91dGVyOiBSb3V0ZXIpO1xuICAgIHRvZ2dsZShjb2xsYXBzZWQ6IGJvb2xlYW4pOiB2b2lkO1xuICAgIGFuaW1hdGlvbkNhbGxiYWNrKCk6IHZvaWQ7XG4gICAgb3BlblNpZGVuYXZPbkFjdGl2ZUxpbmsoKTogdm9pZDtcbiAgICBuZ0FmdGVyQ29udGVudEluaXQoKTogdm9pZDtcbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkO1xufVxuIl19