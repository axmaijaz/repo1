import { OnDestroy, OnInit, OnChanges, EventEmitter, ElementRef, SimpleChanges } from '@angular/core';
import { Colors } from './colors.interface';
import * as ɵngcc0 from '@angular/core';
export declare class BaseChartDirective implements OnDestroy, OnChanges, OnInit, Colors {
    element: ElementRef;
    static defaultColors: Array<number[]>;
    data: number[] | any[];
    datasets: any[];
    labels: Array<any>;
    options: any;
    chartType: string;
    colors: Array<any>;
    legend: boolean;
    chartClick: EventEmitter<any>;
    chartHover: EventEmitter<any>;
    ctx: any;
    chart: any;
    cvs: any;
    initFlag: boolean;
    isBrowser: any;
    constructor(element: ElementRef, platformId: string);
    ngOnInit(): any;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): any;
    getChartBuilder(ctx: any): any;
    getPointDataAtEvent(event: any): any;
    private updateChartData;
    private getDatasets;
    private refresh;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<BaseChartDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<BaseChartDirective, "canvas[mdbChart]", ["mdb-base-chart"], { "labels": "labels"; "options": "options"; "legend": "legend"; "data": "data"; "datasets": "datasets"; "chartType": "chartType"; "colors": "colors"; }, { "chartClick": "chartClick"; "chartHover": "chartHover"; }, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQuZGlyZWN0aXZlLmQudHMiLCJzb3VyY2VzIjpbImNoYXJ0LmRpcmVjdGl2ZS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9uRGVzdHJveSwgT25Jbml0LCBPbkNoYW5nZXMsIEV2ZW50RW1pdHRlciwgRWxlbWVudFJlZiwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29sb3JzIH0gZnJvbSAnLi9jb2xvcnMuaW50ZXJmYWNlJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIEJhc2VDaGFydERpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uRGVzdHJveSwgT25DaGFuZ2VzLCBPbkluaXQsIENvbG9ycyB7XG4gICAgZWxlbWVudDogRWxlbWVudFJlZjtcbiAgICBzdGF0aWMgZGVmYXVsdENvbG9yczogQXJyYXk8bnVtYmVyW10+O1xuICAgIGRhdGE6IG51bWJlcltdIHwgYW55W107XG4gICAgZGF0YXNldHM6IGFueVtdO1xuICAgIGxhYmVsczogQXJyYXk8YW55PjtcbiAgICBvcHRpb25zOiBhbnk7XG4gICAgY2hhcnRUeXBlOiBzdHJpbmc7XG4gICAgY29sb3JzOiBBcnJheTxhbnk+O1xuICAgIGxlZ2VuZDogYm9vbGVhbjtcbiAgICBjaGFydENsaWNrOiBFdmVudEVtaXR0ZXI8YW55PjtcbiAgICBjaGFydEhvdmVyOiBFdmVudEVtaXR0ZXI8YW55PjtcbiAgICBjdHg6IGFueTtcbiAgICBjaGFydDogYW55O1xuICAgIGN2czogYW55O1xuICAgIGluaXRGbGFnOiBib29sZWFuO1xuICAgIGlzQnJvd3NlcjogYW55O1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEVsZW1lbnRSZWYsIHBsYXRmb3JtSWQ6IHN0cmluZyk7XG4gICAgbmdPbkluaXQoKTogYW55O1xuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkO1xuICAgIG5nT25EZXN0cm95KCk6IGFueTtcbiAgICBnZXRDaGFydEJ1aWxkZXIoY3R4OiBhbnkpOiBhbnk7XG4gICAgZ2V0UG9pbnREYXRhQXRFdmVudChldmVudDogYW55KTogYW55O1xuICAgIHByaXZhdGUgdXBkYXRlQ2hhcnREYXRhO1xuICAgIHByaXZhdGUgZ2V0RGF0YXNldHM7XG4gICAgcHJpdmF0ZSByZWZyZXNoO1xufVxuIl19