import { EventEmitter, ElementRef, Renderer2, OnInit } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export interface SortedData {
    data: any[];
    sortOrder: string;
    sortBy: string;
}
export declare class MdbTableSortDirective implements OnInit {
    private el;
    private renderer;
    sortedInto: boolean;
    order: string;
    dataSource: Array<any>;
    sortBy: string;
    sortEnd: EventEmitter<any[]>;
    sorted: EventEmitter<SortedData>;
    constructor(el: ElementRef, renderer: Renderer2);
    onclick(): void;
    trimWhiteSigns(headElement: any): string;
    moveArrayItem(arr: any, oldIndex: number, newIndex: number): any;
    sortDataBy(key: string | any): void;
    ngOnInit(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MdbTableSortDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<MdbTableSortDirective, "[mdbTableSort]", never, { "dataSource": "mdbTableSort"; "sortBy": "sortBy"; }, { "sortEnd": "sortEnd"; "sorted": "sorted"; }, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWRiLXRhYmxlLXNvcnQuZGlyZWN0aXZlLmQudHMiLCJzb3VyY2VzIjpbIm1kYi10YWJsZS1zb3J0LmRpcmVjdGl2ZS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyLCBFbGVtZW50UmVmLCBSZW5kZXJlcjIsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuZXhwb3J0IGludGVyZmFjZSBTb3J0ZWREYXRhIHtcbiAgICBkYXRhOiBhbnlbXTtcbiAgICBzb3J0T3JkZXI6IHN0cmluZztcbiAgICBzb3J0Qnk6IHN0cmluZztcbn1cbmV4cG9ydCBkZWNsYXJlIGNsYXNzIE1kYlRhYmxlU29ydERpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgcHJpdmF0ZSBlbDtcbiAgICBwcml2YXRlIHJlbmRlcmVyO1xuICAgIHNvcnRlZEludG86IGJvb2xlYW47XG4gICAgb3JkZXI6IHN0cmluZztcbiAgICBkYXRhU291cmNlOiBBcnJheTxhbnk+O1xuICAgIHNvcnRCeTogc3RyaW5nO1xuICAgIHNvcnRFbmQ6IEV2ZW50RW1pdHRlcjxhbnlbXT47XG4gICAgc29ydGVkOiBFdmVudEVtaXR0ZXI8U29ydGVkRGF0YT47XG4gICAgY29uc3RydWN0b3IoZWw6IEVsZW1lbnRSZWYsIHJlbmRlcmVyOiBSZW5kZXJlcjIpO1xuICAgIG9uY2xpY2soKTogdm9pZDtcbiAgICB0cmltV2hpdGVTaWducyhoZWFkRWxlbWVudDogYW55KTogc3RyaW5nO1xuICAgIG1vdmVBcnJheUl0ZW0oYXJyOiBhbnksIG9sZEluZGV4OiBudW1iZXIsIG5ld0luZGV4OiBudW1iZXIpOiBhbnk7XG4gICAgc29ydERhdGFCeShrZXk6IHN0cmluZyB8IGFueSk6IHZvaWQ7XG4gICAgbmdPbkluaXQoKTogdm9pZDtcbn1cbiJdfQ==