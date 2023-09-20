import { AfterViewInit, ElementRef, OnDestroy, OnInit, Renderer2, ChangeDetectorRef } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare class SidenavComponent implements AfterViewInit, OnDestroy, OnInit {
    el: ElementRef;
    renderer: Renderer2;
    private _cdRef;
    windwosWidth: number;
    shown: boolean;
    slimSidenav: boolean;
    isBrowser: any;
    private _sidenavTransform;
    class: string;
    fixed: boolean;
    sidenavBreakpoint: any;
    side: string;
    private _side;
    sideNav: ElementRef;
    overlay: any;
    constructor(platformId: string, el: ElementRef, renderer: Renderer2, _cdRef: ChangeDetectorRef);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    windwosResize(): void;
    show(): void;
    hide(): void;
    toggle(): void;
    toggleSlim(): void;
    showOverlay(): void;
    hideOverlay(): void;
    setShown(value: boolean): void;
    ngOnDestroy(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<SidenavComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<SidenavComponent, "mdb-sidenav, mdb-side-nav", never, { "fixed": "fixed"; "side": "side"; "class": "class"; "sidenavBreakpoint": "sidenavBreakpoint"; }, {}, never, ["*"]>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lkZW5hdi5jb21wb25lbnQuZC50cyIsInNvdXJjZXMiOlsic2lkZW5hdi5jb21wb25lbnQuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEJBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgRWxlbWVudFJlZiwgT25EZXN0cm95LCBPbkluaXQsIFJlbmRlcmVyMiwgQ2hhbmdlRGV0ZWN0b3JSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIFNpZGVuYXZDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3ksIE9uSW5pdCB7XG4gICAgZWw6IEVsZW1lbnRSZWY7XG4gICAgcmVuZGVyZXI6IFJlbmRlcmVyMjtcbiAgICBwcml2YXRlIF9jZFJlZjtcbiAgICB3aW5kd29zV2lkdGg6IG51bWJlcjtcbiAgICBzaG93bjogYm9vbGVhbjtcbiAgICBzbGltU2lkZW5hdjogYm9vbGVhbjtcbiAgICBpc0Jyb3dzZXI6IGFueTtcbiAgICBwcml2YXRlIF9zaWRlbmF2VHJhbnNmb3JtO1xuICAgIGNsYXNzOiBzdHJpbmc7XG4gICAgZml4ZWQ6IGJvb2xlYW47XG4gICAgc2lkZW5hdkJyZWFrcG9pbnQ6IGFueTtcbiAgICBzaWRlOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfc2lkZTtcbiAgICBzaWRlTmF2OiBFbGVtZW50UmVmO1xuICAgIG92ZXJsYXk6IGFueTtcbiAgICBjb25zdHJ1Y3RvcihwbGF0Zm9ybUlkOiBzdHJpbmcsIGVsOiBFbGVtZW50UmVmLCByZW5kZXJlcjogUmVuZGVyZXIyLCBfY2RSZWY6IENoYW5nZURldGVjdG9yUmVmKTtcbiAgICBuZ09uSW5pdCgpOiB2b2lkO1xuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkO1xuICAgIHdpbmR3b3NSZXNpemUoKTogdm9pZDtcbiAgICBzaG93KCk6IHZvaWQ7XG4gICAgaGlkZSgpOiB2b2lkO1xuICAgIHRvZ2dsZSgpOiB2b2lkO1xuICAgIHRvZ2dsZVNsaW0oKTogdm9pZDtcbiAgICBzaG93T3ZlcmxheSgpOiB2b2lkO1xuICAgIGhpZGVPdmVybGF5KCk6IHZvaWQ7XG4gICAgc2V0U2hvd24odmFsdWU6IGJvb2xlYW4pOiB2b2lkO1xuICAgIG5nT25EZXN0cm95KCk6IHZvaWQ7XG59XG4iXX0=