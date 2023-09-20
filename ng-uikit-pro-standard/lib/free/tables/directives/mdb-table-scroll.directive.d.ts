import { ElementRef, Renderer2, OnInit } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare class MdbTableScrollDirective implements OnInit {
    private renderer;
    private el;
    scrollY: boolean;
    maxHeight: any;
    scrollX: boolean;
    maxWidth: any;
    constructor(renderer: Renderer2, el: ElementRef);
    wrapTableWithVerticalScrollingWrapper(tableWrapper: ElementRef): void;
    wrapTableWithHorizontalScrollingWrapper(tableWrapper: ElementRef): void;
    wrapTableWithHorizontalAndVerticalScrollingWrapper(tableWrapper: ElementRef): void;
    ngOnInit(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MdbTableScrollDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<MdbTableScrollDirective, "[mdbTableScroll]", never, { "scrollY": "scrollY"; "maxHeight": "maxHeight"; "scrollX": "scrollX"; "maxWidth": "maxWidth"; }, {}, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWRiLXRhYmxlLXNjcm9sbC5kaXJlY3RpdmUuZC50cyIsInNvdXJjZXMiOlsibWRiLXRhYmxlLXNjcm9sbC5kaXJlY3RpdmUuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFZQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVsZW1lbnRSZWYsIFJlbmRlcmVyMiwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBNZGJUYWJsZVNjcm9sbERpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgcHJpdmF0ZSByZW5kZXJlcjtcbiAgICBwcml2YXRlIGVsO1xuICAgIHNjcm9sbFk6IGJvb2xlYW47XG4gICAgbWF4SGVpZ2h0OiBhbnk7XG4gICAgc2Nyb2xsWDogYm9vbGVhbjtcbiAgICBtYXhXaWR0aDogYW55O1xuICAgIGNvbnN0cnVjdG9yKHJlbmRlcmVyOiBSZW5kZXJlcjIsIGVsOiBFbGVtZW50UmVmKTtcbiAgICB3cmFwVGFibGVXaXRoVmVydGljYWxTY3JvbGxpbmdXcmFwcGVyKHRhYmxlV3JhcHBlcjogRWxlbWVudFJlZik6IHZvaWQ7XG4gICAgd3JhcFRhYmxlV2l0aEhvcml6b250YWxTY3JvbGxpbmdXcmFwcGVyKHRhYmxlV3JhcHBlcjogRWxlbWVudFJlZik6IHZvaWQ7XG4gICAgd3JhcFRhYmxlV2l0aEhvcml6b250YWxBbmRWZXJ0aWNhbFNjcm9sbGluZ1dyYXBwZXIodGFibGVXcmFwcGVyOiBFbGVtZW50UmVmKTogdm9pZDtcbiAgICBuZ09uSW5pdCgpOiB2b2lkO1xufVxuIl19