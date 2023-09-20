import { ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare class MdbStickyDirective implements OnDestroy, AfterViewInit {
    stickyAfter: string;
    stickyAfterAlias: string;
    isBrowser: boolean;
    el: HTMLElement | any;
    parentEl: HTMLElement | any;
    fillerEl: HTMLElement | any;
    stickyOffsetTop: number;
    diff: any;
    original: any;
    constructor(el: ElementRef, platformId: string);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    attach(): void;
    detach(): void;
    scrollHandler: () => void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MdbStickyDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<MdbStickyDirective, "[mdbSticky]", never, { "stickyAfter": "stickyAfter"; "stickyAfterAlias": "sticky-after"; }, {}, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RpY2t5LWNvbnRlbnQuZGlyZWN0aXZlLmQudHMiLCJzb3VyY2VzIjpbInN0aWNreS1jb250ZW50LmRpcmVjdGl2ZS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbGVtZW50UmVmLCBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIE1kYlN0aWNreURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCB7XG4gICAgc3RpY2t5QWZ0ZXI6IHN0cmluZztcbiAgICBzdGlja3lBZnRlckFsaWFzOiBzdHJpbmc7XG4gICAgaXNCcm93c2VyOiBib29sZWFuO1xuICAgIGVsOiBIVE1MRWxlbWVudCB8IGFueTtcbiAgICBwYXJlbnRFbDogSFRNTEVsZW1lbnQgfCBhbnk7XG4gICAgZmlsbGVyRWw6IEhUTUxFbGVtZW50IHwgYW55O1xuICAgIHN0aWNreU9mZnNldFRvcDogbnVtYmVyO1xuICAgIGRpZmY6IGFueTtcbiAgICBvcmlnaW5hbDogYW55O1xuICAgIGNvbnN0cnVjdG9yKGVsOiBFbGVtZW50UmVmLCBwbGF0Zm9ybUlkOiBzdHJpbmcpO1xuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkO1xuICAgIG5nT25EZXN0cm95KCk6IHZvaWQ7XG4gICAgYXR0YWNoKCk6IHZvaWQ7XG4gICAgZGV0YWNoKCk6IHZvaWQ7XG4gICAgc2Nyb2xsSGFuZGxlcjogKCkgPT4gdm9pZDtcbn1cbiJdfQ==