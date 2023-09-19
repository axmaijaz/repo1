import { ElementRef, OnInit, OnChanges, SimpleChanges, Renderer2 } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare class EasyPieChartComponent implements OnInit, OnChanges {
    el: ElementRef;
    private _r;
    percent: any;
    options: any;
    pieChart: any;
    isBrowser: any;
    constructor(el: ElementRef, platformId: string, _r: Renderer2);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<EasyPieChartComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<EasyPieChartComponent, "mdb-easy-pie-chart", never, { "options": "options"; "percent": "percent"; }, {}, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQtc21hbGxwaWUuY29tcG9uZW50LmQudHMiLCJzb3VyY2VzIjpbImNoYXJ0LXNtYWxscGllLmNvbXBvbmVudC5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFVQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVsZW1lbnRSZWYsIE9uSW5pdCwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzLCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIEVhc3lQaWVDaGFydENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcbiAgICBlbDogRWxlbWVudFJlZjtcbiAgICBwcml2YXRlIF9yO1xuICAgIHBlcmNlbnQ6IGFueTtcbiAgICBvcHRpb25zOiBhbnk7XG4gICAgcGllQ2hhcnQ6IGFueTtcbiAgICBpc0Jyb3dzZXI6IGFueTtcbiAgICBjb25zdHJ1Y3RvcihlbDogRWxlbWVudFJlZiwgcGxhdGZvcm1JZDogc3RyaW5nLCBfcjogUmVuZGVyZXIyKTtcbiAgICBuZ09uSW5pdCgpOiB2b2lkO1xuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkO1xufVxuIl19