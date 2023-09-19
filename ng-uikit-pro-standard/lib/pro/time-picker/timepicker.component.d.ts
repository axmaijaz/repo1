import { AfterContentChecked, AfterViewInit, ElementRef, EventEmitter, OnInit, Renderer2, ChangeDetectorRef, NgZone } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import * as ɵngcc0 from '@angular/core';
export declare const TIME_PIRCKER_VALUE_ACCESSOT: any;
export declare class ClockPickerComponent implements OnInit, AfterViewInit, ControlValueAccessor, AfterContentChecked {
    elem: ElementRef;
    renderer: Renderer2;
    private _cdRef;
    private _ngZone;
    private _document;
    hoursPlate: ElementRef;
    minutesPlate: ElementRef;
    plate: ElementRef;
    svg: ElementRef;
    g: ElementRef;
    hand: ElementRef;
    fg: ElementRef;
    bg: ElementRef;
    bearing: ElementRef;
    twelvehour: boolean;
    darktheme: boolean;
    placeholder: String;
    label: string;
    duration: number;
    showClock: boolean;
    buttonLabel: string;
    disabled: boolean;
    tabIndex: any;
    outlineInput: boolean;
    openOnFocus: boolean;
    readonly: boolean;
    timeChanged: EventEmitter<string>;
    isOpen: boolean;
    isMobile: any;
    touchDevice: boolean;
    showHours: boolean;
    moveEvent: string;
    tapEvent: string;
    elements: HTMLCollectionOf<Element>;
    elementNumber: any;
    dialRadius: number;
    outerRadius: number;
    innerRadius: number;
    tickRadius: number;
    diameter: number;
    isBrowser: any;
    hoursTicks: any;
    minutesTicks: any;
    selectedHours: any;
    endHours: string;
    touchSupported: any;
    mousedownEvent: any;
    mousemoveEvent: any;
    mouseupEvent: any;
    isMouseDown: boolean;
    documentClickFun: Function;
    constructor(elem: ElementRef, renderer: Renderer2, _cdRef: ChangeDetectorRef, _ngZone: NgZone, _document: any, platformId: string);
    ontouchmove(event: any): void;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngAfterContentChecked(): void;
    checkDraw(): void;
    mousedown(e: any, space?: any): void;
    hideKeyboard(): void;
    onFocusInput(): void;
    openBtnClicked(): void;
    private _handleOutsideClick;
    closeBtnClicked(): void;
    close(): void;
    clearTimeInput(): void;
    setHour(hour: String): void;
    setMinute(min: String): void;
    setAmPm(ampm: String): void;
    showHoursClock(): void;
    showMinutesClock(): void;
    generateTick(): void;
    setHand(x: any, y: any, roundBy5: any): void;
    offset(obj: any): {
        left: number;
        top: number;
    };
    private _getFormattedTime;
    onChangeCb: (_: any) => void;
    onTouchedCb: () => void;
    writeValue(value: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ClockPickerComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<ClockPickerComponent, "mdb-time-picker", never, { "twelvehour": "twelvehour"; "darktheme": "darktheme"; "placeholder": "placeholder"; "label": "label"; "duration": "duration"; "showClock": "showClock"; "disabled": "disabled"; "outlineInput": "outlineInput"; "openOnFocus": "openOnFocus"; "readonly": "readonly"; "buttonLabel": "buttonLabel"; "tabIndex": "tabIndex"; }, { "timeChanged": "timeChanged"; }, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXBpY2tlci5jb21wb25lbnQuZC50cyIsInNvdXJjZXMiOlsidGltZXBpY2tlci5jb21wb25lbnQuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0ZBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJDb250ZW50Q2hlY2tlZCwgQWZ0ZXJWaWV3SW5pdCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBPbkluaXQsIFJlbmRlcmVyMiwgQ2hhbmdlRGV0ZWN0b3JSZWYsIE5nWm9uZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5leHBvcnQgZGVjbGFyZSBjb25zdCBUSU1FX1BJUkNLRVJfVkFMVUVfQUNDRVNTT1Q6IGFueTtcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIENsb2NrUGlja2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0LCBDb250cm9sVmFsdWVBY2Nlc3NvciwgQWZ0ZXJDb250ZW50Q2hlY2tlZCB7XG4gICAgZWxlbTogRWxlbWVudFJlZjtcbiAgICByZW5kZXJlcjogUmVuZGVyZXIyO1xuICAgIHByaXZhdGUgX2NkUmVmO1xuICAgIHByaXZhdGUgX25nWm9uZTtcbiAgICBwcml2YXRlIF9kb2N1bWVudDtcbiAgICBob3Vyc1BsYXRlOiBFbGVtZW50UmVmO1xuICAgIG1pbnV0ZXNQbGF0ZTogRWxlbWVudFJlZjtcbiAgICBwbGF0ZTogRWxlbWVudFJlZjtcbiAgICBzdmc6IEVsZW1lbnRSZWY7XG4gICAgZzogRWxlbWVudFJlZjtcbiAgICBoYW5kOiBFbGVtZW50UmVmO1xuICAgIGZnOiBFbGVtZW50UmVmO1xuICAgIGJnOiBFbGVtZW50UmVmO1xuICAgIGJlYXJpbmc6IEVsZW1lbnRSZWY7XG4gICAgdHdlbHZlaG91cjogYm9vbGVhbjtcbiAgICBkYXJrdGhlbWU6IGJvb2xlYW47XG4gICAgcGxhY2Vob2xkZXI6IFN0cmluZztcbiAgICBsYWJlbDogc3RyaW5nO1xuICAgIGR1cmF0aW9uOiBudW1iZXI7XG4gICAgc2hvd0Nsb2NrOiBib29sZWFuO1xuICAgIGJ1dHRvbkxhYmVsOiBzdHJpbmc7XG4gICAgZGlzYWJsZWQ6IGJvb2xlYW47XG4gICAgdGFiSW5kZXg6IGFueTtcbiAgICBvdXRsaW5lSW5wdXQ6IGJvb2xlYW47XG4gICAgb3Blbk9uRm9jdXM6IGJvb2xlYW47XG4gICAgcmVhZG9ubHk6IGJvb2xlYW47XG4gICAgdGltZUNoYW5nZWQ6IEV2ZW50RW1pdHRlcjxzdHJpbmc+O1xuICAgIGlzT3BlbjogYm9vbGVhbjtcbiAgICBpc01vYmlsZTogYW55O1xuICAgIHRvdWNoRGV2aWNlOiBib29sZWFuO1xuICAgIHNob3dIb3VyczogYm9vbGVhbjtcbiAgICBtb3ZlRXZlbnQ6IHN0cmluZztcbiAgICB0YXBFdmVudDogc3RyaW5nO1xuICAgIGVsZW1lbnRzOiBIVE1MQ29sbGVjdGlvbk9mPEVsZW1lbnQ+O1xuICAgIGVsZW1lbnROdW1iZXI6IGFueTtcbiAgICBkaWFsUmFkaXVzOiBudW1iZXI7XG4gICAgb3V0ZXJSYWRpdXM6IG51bWJlcjtcbiAgICBpbm5lclJhZGl1czogbnVtYmVyO1xuICAgIHRpY2tSYWRpdXM6IG51bWJlcjtcbiAgICBkaWFtZXRlcjogbnVtYmVyO1xuICAgIGlzQnJvd3NlcjogYW55O1xuICAgIGhvdXJzVGlja3M6IGFueTtcbiAgICBtaW51dGVzVGlja3M6IGFueTtcbiAgICBzZWxlY3RlZEhvdXJzOiBhbnk7XG4gICAgZW5kSG91cnM6IHN0cmluZztcbiAgICB0b3VjaFN1cHBvcnRlZDogYW55O1xuICAgIG1vdXNlZG93bkV2ZW50OiBhbnk7XG4gICAgbW91c2Vtb3ZlRXZlbnQ6IGFueTtcbiAgICBtb3VzZXVwRXZlbnQ6IGFueTtcbiAgICBpc01vdXNlRG93bjogYm9vbGVhbjtcbiAgICBkb2N1bWVudENsaWNrRnVuOiBGdW5jdGlvbjtcbiAgICBjb25zdHJ1Y3RvcihlbGVtOiBFbGVtZW50UmVmLCByZW5kZXJlcjogUmVuZGVyZXIyLCBfY2RSZWY6IENoYW5nZURldGVjdG9yUmVmLCBfbmdab25lOiBOZ1pvbmUsIF9kb2N1bWVudDogYW55LCBwbGF0Zm9ybUlkOiBzdHJpbmcpO1xuICAgIG9udG91Y2htb3ZlKGV2ZW50OiBhbnkpOiB2b2lkO1xuICAgIG5nT25Jbml0KCk6IHZvaWQ7XG4gICAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQ7XG4gICAgbmdBZnRlckNvbnRlbnRDaGVja2VkKCk6IHZvaWQ7XG4gICAgY2hlY2tEcmF3KCk6IHZvaWQ7XG4gICAgbW91c2Vkb3duKGU6IGFueSwgc3BhY2U/OiBhbnkpOiB2b2lkO1xuICAgIGhpZGVLZXlib2FyZCgpOiB2b2lkO1xuICAgIG9uRm9jdXNJbnB1dCgpOiB2b2lkO1xuICAgIG9wZW5CdG5DbGlja2VkKCk6IHZvaWQ7XG4gICAgcHJpdmF0ZSBfaGFuZGxlT3V0c2lkZUNsaWNrO1xuICAgIGNsb3NlQnRuQ2xpY2tlZCgpOiB2b2lkO1xuICAgIGNsb3NlKCk6IHZvaWQ7XG4gICAgY2xlYXJUaW1lSW5wdXQoKTogdm9pZDtcbiAgICBzZXRIb3VyKGhvdXI6IFN0cmluZyk6IHZvaWQ7XG4gICAgc2V0TWludXRlKG1pbjogU3RyaW5nKTogdm9pZDtcbiAgICBzZXRBbVBtKGFtcG06IFN0cmluZyk6IHZvaWQ7XG4gICAgc2hvd0hvdXJzQ2xvY2soKTogdm9pZDtcbiAgICBzaG93TWludXRlc0Nsb2NrKCk6IHZvaWQ7XG4gICAgZ2VuZXJhdGVUaWNrKCk6IHZvaWQ7XG4gICAgc2V0SGFuZCh4OiBhbnksIHk6IGFueSwgcm91bmRCeTU6IGFueSk6IHZvaWQ7XG4gICAgb2Zmc2V0KG9iajogYW55KToge1xuICAgICAgICBsZWZ0OiBudW1iZXI7XG4gICAgICAgIHRvcDogbnVtYmVyO1xuICAgIH07XG4gICAgcHJpdmF0ZSBfZ2V0Rm9ybWF0dGVkVGltZTtcbiAgICBvbkNoYW5nZUNiOiAoXzogYW55KSA9PiB2b2lkO1xuICAgIG9uVG91Y2hlZENiOiAoKSA9PiB2b2lkO1xuICAgIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQ7XG4gICAgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZDtcbiAgICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZDtcbn1cbiJdfQ==