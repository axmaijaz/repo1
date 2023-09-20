import { ControlValueAccessor } from '@angular/forms';
import { ElementRef, Renderer2, AfterViewInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare const RANGE_VALUE_ACCESOR: any;
export declare class MdbRangeInputComponent implements ControlValueAccessor, AfterViewInit {
    private renderer;
    private cdRef;
    input: ElementRef;
    rangeCloud: ElementRef;
    rangeField: ElementRef;
    id: string;
    required: boolean;
    name: string;
    value: string;
    disabled: boolean;
    min: number;
    max: number;
    step: number;
    default: boolean;
    defaultRangeCounterClass: string;
    rangeValueChange: EventEmitter<any>;
    range: any;
    stepLength: number;
    steps: number;
    cloudRange: number;
    visibility: boolean;
    onchange(event: any): void;
    oninput(event: any): void;
    onclick(): void;
    onTouchStart(): void;
    onmouseleave(): void;
    constructor(renderer: Renderer2, cdRef: ChangeDetectorRef);
    focusRangeInput(): void;
    blurRangeInput(): void;
    coverage(event: any, value?: any): string | undefined;
    checkIfSafari(): boolean;
    ngAfterViewInit(): void;
    onChange: (_: any) => void;
    onTouched: () => void;
    writeValue(value: any): void;
    registerOnChange(fn: (_: any) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MdbRangeInputComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<MdbRangeInputComponent, "mdb-range-input", never, { "min": "min"; "max": "max"; "value": "value"; "disabled": "disabled"; "id": "id"; "required": "required"; "name": "name"; "step": "step"; "default": "default"; "defaultRangeCounterClass": "defaultRangeCounterClass"; }, { "rangeValueChange": "rangeValueChange"; }, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWRiLXJhbmdlLmNvbXBvbmVudC5kLnRzIiwic291cmNlcyI6WyJtZGItcmFuZ2UuY29tcG9uZW50LmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3Q0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEVsZW1lbnRSZWYsIFJlbmRlcmVyMiwgQWZ0ZXJWaWV3SW5pdCwgRXZlbnRFbWl0dGVyLCBDaGFuZ2VEZXRlY3RvclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuZXhwb3J0IGRlY2xhcmUgY29uc3QgUkFOR0VfVkFMVUVfQUNDRVNPUjogYW55O1xuZXhwb3J0IGRlY2xhcmUgY2xhc3MgTWRiUmFuZ2VJbnB1dENvbXBvbmVudCBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBBZnRlclZpZXdJbml0IHtcbiAgICBwcml2YXRlIHJlbmRlcmVyO1xuICAgIHByaXZhdGUgY2RSZWY7XG4gICAgaW5wdXQ6IEVsZW1lbnRSZWY7XG4gICAgcmFuZ2VDbG91ZDogRWxlbWVudFJlZjtcbiAgICByYW5nZUZpZWxkOiBFbGVtZW50UmVmO1xuICAgIGlkOiBzdHJpbmc7XG4gICAgcmVxdWlyZWQ6IGJvb2xlYW47XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIHZhbHVlOiBzdHJpbmc7XG4gICAgZGlzYWJsZWQ6IGJvb2xlYW47XG4gICAgbWluOiBudW1iZXI7XG4gICAgbWF4OiBudW1iZXI7XG4gICAgc3RlcDogbnVtYmVyO1xuICAgIGRlZmF1bHQ6IGJvb2xlYW47XG4gICAgZGVmYXVsdFJhbmdlQ291bnRlckNsYXNzOiBzdHJpbmc7XG4gICAgcmFuZ2VWYWx1ZUNoYW5nZTogRXZlbnRFbWl0dGVyPGFueT47XG4gICAgcmFuZ2U6IGFueTtcbiAgICBzdGVwTGVuZ3RoOiBudW1iZXI7XG4gICAgc3RlcHM6IG51bWJlcjtcbiAgICBjbG91ZFJhbmdlOiBudW1iZXI7XG4gICAgdmlzaWJpbGl0eTogYm9vbGVhbjtcbiAgICBvbmNoYW5nZShldmVudDogYW55KTogdm9pZDtcbiAgICBvbmlucHV0KGV2ZW50OiBhbnkpOiB2b2lkO1xuICAgIG9uY2xpY2soKTogdm9pZDtcbiAgICBvblRvdWNoU3RhcnQoKTogdm9pZDtcbiAgICBvbm1vdXNlbGVhdmUoKTogdm9pZDtcbiAgICBjb25zdHJ1Y3RvcihyZW5kZXJlcjogUmVuZGVyZXIyLCBjZFJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpO1xuICAgIGZvY3VzUmFuZ2VJbnB1dCgpOiB2b2lkO1xuICAgIGJsdXJSYW5nZUlucHV0KCk6IHZvaWQ7XG4gICAgY292ZXJhZ2UoZXZlbnQ6IGFueSwgdmFsdWU/OiBhbnkpOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgY2hlY2tJZlNhZmFyaSgpOiBib29sZWFuO1xuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkO1xuICAgIG9uQ2hhbmdlOiAoXzogYW55KSA9PiB2b2lkO1xuICAgIG9uVG91Y2hlZDogKCkgPT4gdm9pZDtcbiAgICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkO1xuICAgIHJlZ2lzdGVyT25DaGFuZ2UoZm46IChfOiBhbnkpID0+IHZvaWQpOiB2b2lkO1xuICAgIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB2b2lkKTogdm9pZDtcbiAgICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkO1xufVxuIl19