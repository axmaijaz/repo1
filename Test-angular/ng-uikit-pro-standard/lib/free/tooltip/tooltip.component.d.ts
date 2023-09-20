import { AfterViewInit, ElementRef } from '@angular/core';
import { TooltipConfig } from './tooltip.service';
import * as ɵngcc0 from '@angular/core';
export declare class TooltipContainerComponent implements AfterViewInit {
    elem: ElementRef;
    classMap: any;
    placement: string;
    popupClass: string;
    animation: boolean;
    containerClass: string;
    tooltipInner: ElementRef;
    tooltipArrow: ElementRef;
    show: boolean;
    readonly tooltipClasses: string;
    readonly isBs3: boolean;
    constructor(config: TooltipConfig, elem: ElementRef);
    ngAfterViewInit(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<TooltipContainerComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<TooltipContainerComponent, "mdb-tooltip-container", never, { "containerClass": "containerClass"; }, {}, never, ["*"]>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5jb21wb25lbnQuZC50cyIsInNvdXJjZXMiOlsidG9vbHRpcC5jb21wb25lbnQuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFjQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFRvb2x0aXBDb25maWcgfSBmcm9tICcuL3Rvb2x0aXAuc2VydmljZSc7XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBUb29sdGlwQ29udGFpbmVyQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG4gICAgZWxlbTogRWxlbWVudFJlZjtcbiAgICBjbGFzc01hcDogYW55O1xuICAgIHBsYWNlbWVudDogc3RyaW5nO1xuICAgIHBvcHVwQ2xhc3M6IHN0cmluZztcbiAgICBhbmltYXRpb246IGJvb2xlYW47XG4gICAgY29udGFpbmVyQ2xhc3M6IHN0cmluZztcbiAgICB0b29sdGlwSW5uZXI6IEVsZW1lbnRSZWY7XG4gICAgdG9vbHRpcEFycm93OiBFbGVtZW50UmVmO1xuICAgIHNob3c6IGJvb2xlYW47XG4gICAgcmVhZG9ubHkgdG9vbHRpcENsYXNzZXM6IHN0cmluZztcbiAgICByZWFkb25seSBpc0JzMzogYm9vbGVhbjtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWc6IFRvb2x0aXBDb25maWcsIGVsZW06IEVsZW1lbnRSZWYpO1xuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkO1xufVxuIl19