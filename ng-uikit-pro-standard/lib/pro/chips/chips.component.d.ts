import { EventEmitter, ChangeDetectorRef, ElementRef } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any;
export declare class MaterialChipsComponent {
    private _cdRef;
    chipsInput: ElementRef;
    initialInput: ElementRef;
    placeholder: string;
    addAreaDisplayed: boolean;
    isTagsFocused: boolean;
    values: string[];
    labelToAdd: string;
    focused: string;
    selected: string;
    noop: any;
    keyCodes: {
        backspace: number;
        delete: number;
    };
    tagsfocusedChange: EventEmitter<{}>;
    labelsChange: EventEmitter<string[]>;
    readonly tagsfocused: boolean;
    private onTouchedCallback;
    private onChangeCallback;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    constructor(_cdRef: ChangeDetectorRef);
    removeValue(value: string): void;
    handleKeydown(event: any): void;
    private _removeLast;
    addValue(value: string, event: any): void;
    writeValue(value: string[]): void;
    onFocus(): void;
    focusOutFunction(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MaterialChipsComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<MaterialChipsComponent, "mdb-material-chips", never, { "placeholder": "placeholder"; "tagsfocused": "tagsfocused"; }, { "tagsfocusedChange": "tagsfocusedChange"; "labelsChange": "labelsChange"; }, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcHMuY29tcG9uZW50LmQudHMiLCJzb3VyY2VzIjpbImNoaXBzLmNvbXBvbmVudC5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0NBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyLCBDaGFuZ2VEZXRlY3RvclJlZiwgRWxlbWVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuZXhwb3J0IGRlY2xhcmUgY29uc3QgQ1VTVE9NX0lOUFVUX0NPTlRST0xfVkFMVUVfQUNDRVNTT1I6IGFueTtcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIE1hdGVyaWFsQ2hpcHNDb21wb25lbnQge1xuICAgIHByaXZhdGUgX2NkUmVmO1xuICAgIGNoaXBzSW5wdXQ6IEVsZW1lbnRSZWY7XG4gICAgaW5pdGlhbElucHV0OiBFbGVtZW50UmVmO1xuICAgIHBsYWNlaG9sZGVyOiBzdHJpbmc7XG4gICAgYWRkQXJlYURpc3BsYXllZDogYm9vbGVhbjtcbiAgICBpc1RhZ3NGb2N1c2VkOiBib29sZWFuO1xuICAgIHZhbHVlczogc3RyaW5nW107XG4gICAgbGFiZWxUb0FkZDogc3RyaW5nO1xuICAgIGZvY3VzZWQ6IHN0cmluZztcbiAgICBzZWxlY3RlZDogc3RyaW5nO1xuICAgIG5vb3A6IGFueTtcbiAgICBrZXlDb2Rlczoge1xuICAgICAgICBiYWNrc3BhY2U6IG51bWJlcjtcbiAgICAgICAgZGVsZXRlOiBudW1iZXI7XG4gICAgfTtcbiAgICB0YWdzZm9jdXNlZENoYW5nZTogRXZlbnRFbWl0dGVyPHt9PjtcbiAgICBsYWJlbHNDaGFuZ2U6IEV2ZW50RW1pdHRlcjxzdHJpbmdbXT47XG4gICAgcmVhZG9ubHkgdGFnc2ZvY3VzZWQ6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSBvblRvdWNoZWRDYWxsYmFjaztcbiAgICBwcml2YXRlIG9uQ2hhbmdlQ2FsbGJhY2s7XG4gICAgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZDtcbiAgICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZDtcbiAgICBjb25zdHJ1Y3RvcihfY2RSZWY6IENoYW5nZURldGVjdG9yUmVmKTtcbiAgICByZW1vdmVWYWx1ZSh2YWx1ZTogc3RyaW5nKTogdm9pZDtcbiAgICBoYW5kbGVLZXlkb3duKGV2ZW50OiBhbnkpOiB2b2lkO1xuICAgIHByaXZhdGUgX3JlbW92ZUxhc3Q7XG4gICAgYWRkVmFsdWUodmFsdWU6IHN0cmluZywgZXZlbnQ6IGFueSk6IHZvaWQ7XG4gICAgd3JpdGVWYWx1ZSh2YWx1ZTogc3RyaW5nW10pOiB2b2lkO1xuICAgIG9uRm9jdXMoKTogdm9pZDtcbiAgICBmb2N1c091dEZ1bmN0aW9uKCk6IHZvaWQ7XG59XG4iXX0=