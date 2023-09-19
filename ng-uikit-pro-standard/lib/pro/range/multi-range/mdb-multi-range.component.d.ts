import { ElementRef, EventEmitter, Renderer2, OnInit, AfterViewInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import * as ɵngcc0 from '@angular/core';
export declare const RANGE_VALUE_ACCESOR: any;
export declare class MdbMultiRangeInputComponent implements OnInit, AfterViewInit, ControlValueAccessor {
    private renderer;
    id: string;
    required: boolean;
    name: string;
    value: {
        first: number | string;
        second: number | string;
    };
    disabled: boolean;
    min: number;
    max: number;
    step: number;
    rangeValueChange: EventEmitter<{
        first: number;
        second: number;
    }>;
    firstInput: ElementRef;
    secondInput: ElementRef;
    firstRangeCloud: ElementRef;
    secondRangeCloud: ElementRef;
    rangeField: ElementRef;
    range: any;
    steps: number;
    stepLength: number;
    firstVisibility: boolean;
    secondVisibility: boolean;
    cloudRange: number;
    constructor(renderer: Renderer2);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    firstRangeInput(event: any): any;
    secondRangeInput(event: any): any;
    private moveValueCloud;
    focusRangeInput(element: string): void;
    blurRangeInput(element: string): void;
    checkIfSafari(): boolean;
    onChange: (_: any) => void;
    onTouched: () => void;
    writeValue(value: any): void;
    registerOnChange(fn: (_: any) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MdbMultiRangeInputComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<MdbMultiRangeInputComponent, "mdb-multi-range-input", never, { "value": "value"; "min": "min"; "max": "max"; "disabled": "disabled"; "id": "id"; "required": "required"; "name": "name"; "step": "step"; }, { "rangeValueChange": "rangeValueChange"; }, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWRiLW11bHRpLXJhbmdlLmNvbXBvbmVudC5kLnRzIiwic291cmNlcyI6WyJtZGItbXVsdGktcmFuZ2UuY29tcG9uZW50LmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNENBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBSZW5kZXJlcjIsIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5leHBvcnQgZGVjbGFyZSBjb25zdCBSQU5HRV9WQUxVRV9BQ0NFU09SOiBhbnk7XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBNZGJNdWx0aVJhbmdlSW5wdXRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQsIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgICBwcml2YXRlIHJlbmRlcmVyO1xuICAgIGlkOiBzdHJpbmc7XG4gICAgcmVxdWlyZWQ6IGJvb2xlYW47XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIHZhbHVlOiB7XG4gICAgICAgIGZpcnN0OiBudW1iZXIgfCBzdHJpbmc7XG4gICAgICAgIHNlY29uZDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIH07XG4gICAgZGlzYWJsZWQ6IGJvb2xlYW47XG4gICAgbWluOiBudW1iZXI7XG4gICAgbWF4OiBudW1iZXI7XG4gICAgc3RlcDogbnVtYmVyO1xuICAgIHJhbmdlVmFsdWVDaGFuZ2U6IEV2ZW50RW1pdHRlcjx7XG4gICAgICAgIGZpcnN0OiBudW1iZXI7XG4gICAgICAgIHNlY29uZDogbnVtYmVyO1xuICAgIH0+O1xuICAgIGZpcnN0SW5wdXQ6IEVsZW1lbnRSZWY7XG4gICAgc2Vjb25kSW5wdXQ6IEVsZW1lbnRSZWY7XG4gICAgZmlyc3RSYW5nZUNsb3VkOiBFbGVtZW50UmVmO1xuICAgIHNlY29uZFJhbmdlQ2xvdWQ6IEVsZW1lbnRSZWY7XG4gICAgcmFuZ2VGaWVsZDogRWxlbWVudFJlZjtcbiAgICByYW5nZTogYW55O1xuICAgIHN0ZXBzOiBudW1iZXI7XG4gICAgc3RlcExlbmd0aDogbnVtYmVyO1xuICAgIGZpcnN0VmlzaWJpbGl0eTogYm9vbGVhbjtcbiAgICBzZWNvbmRWaXNpYmlsaXR5OiBib29sZWFuO1xuICAgIGNsb3VkUmFuZ2U6IG51bWJlcjtcbiAgICBjb25zdHJ1Y3RvcihyZW5kZXJlcjogUmVuZGVyZXIyKTtcbiAgICBuZ09uSW5pdCgpOiB2b2lkO1xuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkO1xuICAgIGZpcnN0UmFuZ2VJbnB1dChldmVudDogYW55KTogYW55O1xuICAgIHNlY29uZFJhbmdlSW5wdXQoZXZlbnQ6IGFueSk6IGFueTtcbiAgICBwcml2YXRlIG1vdmVWYWx1ZUNsb3VkO1xuICAgIGZvY3VzUmFuZ2VJbnB1dChlbGVtZW50OiBzdHJpbmcpOiB2b2lkO1xuICAgIGJsdXJSYW5nZUlucHV0KGVsZW1lbnQ6IHN0cmluZyk6IHZvaWQ7XG4gICAgY2hlY2tJZlNhZmFyaSgpOiBib29sZWFuO1xuICAgIG9uQ2hhbmdlOiAoXzogYW55KSA9PiB2b2lkO1xuICAgIG9uVG91Y2hlZDogKCkgPT4gdm9pZDtcbiAgICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkO1xuICAgIHJlZ2lzdGVyT25DaGFuZ2UoZm46IChfOiBhbnkpID0+IHZvaWQpOiB2b2lkO1xuICAgIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB2b2lkKTogdm9pZDtcbiAgICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkO1xufVxuIl19