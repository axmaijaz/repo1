import { EventEmitter, OnChanges, OnInit, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare const CHECKBOX_VALUE_ACCESSOR: any;
export declare class MdbCheckboxChange {
    element: CheckboxComponent;
    checked: boolean;
}
export declare class CheckboxComponent implements OnInit, OnChanges {
    private _cdRef;
    inputEl: any;
    private defaultId;
    class: string;
    id: string;
    required: boolean;
    name: string;
    value: string;
    checked: boolean;
    filledIn: boolean;
    indeterminate: boolean;
    disabled: boolean;
    rounded: boolean;
    checkboxPosition: string;
    default: boolean;
    inline: boolean;
    tabIndex: number;
    change: EventEmitter<MdbCheckboxChange>;
    private checkboxClicked;
    constructor(_cdRef: ChangeDetectorRef);
    onLabelClick(event: any): void;
    onDocumentClick(): void;
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    readonly changeEvent: MdbCheckboxChange;
    toggle(): void;
    onCheckboxClick(event: any): void;
    onCheckboxChange(event: any): void;
    onBlur(): void;
    onChange: (_: any) => void;
    onTouched: () => void;
    writeValue(value: any): void;
    registerOnChange(fn: (_: any) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CheckboxComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<CheckboxComponent, "mdb-checkbox", never, { "id": "id"; "checked": "checked"; "filledIn": "filledIn"; "indeterminate": "indeterminate"; "rounded": "rounded"; "checkboxPosition": "checkboxPosition"; "default": "default"; "inline": "inline"; "value": "value"; "disabled": "disabled"; "class": "class"; "required": "required"; "name": "name"; "tabIndex": "tabIndex"; }, { "change": "change"; }, never, ["*"]>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3guY29tcG9uZW50LmQudHMiLCJzb3VyY2VzIjpbImNoZWNrYm94LmNvbXBvbmVudC5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUNBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyLCBPbkNoYW5nZXMsIE9uSW5pdCwgU2ltcGxlQ2hhbmdlcywgQ2hhbmdlRGV0ZWN0b3JSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmV4cG9ydCBkZWNsYXJlIGNvbnN0IENIRUNLQk9YX1ZBTFVFX0FDQ0VTU09SOiBhbnk7XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBNZGJDaGVja2JveENoYW5nZSB7XG4gICAgZWxlbWVudDogQ2hlY2tib3hDb21wb25lbnQ7XG4gICAgY2hlY2tlZDogYm9vbGVhbjtcbn1cbmV4cG9ydCBkZWNsYXJlIGNsYXNzIENoZWNrYm94Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuICAgIHByaXZhdGUgX2NkUmVmO1xuICAgIGlucHV0RWw6IGFueTtcbiAgICBwcml2YXRlIGRlZmF1bHRJZDtcbiAgICBjbGFzczogc3RyaW5nO1xuICAgIGlkOiBzdHJpbmc7XG4gICAgcmVxdWlyZWQ6IGJvb2xlYW47XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIHZhbHVlOiBzdHJpbmc7XG4gICAgY2hlY2tlZDogYm9vbGVhbjtcbiAgICBmaWxsZWRJbjogYm9vbGVhbjtcbiAgICBpbmRldGVybWluYXRlOiBib29sZWFuO1xuICAgIGRpc2FibGVkOiBib29sZWFuO1xuICAgIHJvdW5kZWQ6IGJvb2xlYW47XG4gICAgY2hlY2tib3hQb3NpdGlvbjogc3RyaW5nO1xuICAgIGRlZmF1bHQ6IGJvb2xlYW47XG4gICAgaW5saW5lOiBib29sZWFuO1xuICAgIHRhYkluZGV4OiBudW1iZXI7XG4gICAgY2hhbmdlOiBFdmVudEVtaXR0ZXI8TWRiQ2hlY2tib3hDaGFuZ2U+O1xuICAgIHByaXZhdGUgY2hlY2tib3hDbGlja2VkO1xuICAgIGNvbnN0cnVjdG9yKF9jZFJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpO1xuICAgIG9uTGFiZWxDbGljayhldmVudDogYW55KTogdm9pZDtcbiAgICBvbkRvY3VtZW50Q2xpY2soKTogdm9pZDtcbiAgICBuZ09uSW5pdCgpOiB2b2lkO1xuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkO1xuICAgIHJlYWRvbmx5IGNoYW5nZUV2ZW50OiBNZGJDaGVja2JveENoYW5nZTtcbiAgICB0b2dnbGUoKTogdm9pZDtcbiAgICBvbkNoZWNrYm94Q2xpY2soZXZlbnQ6IGFueSk6IHZvaWQ7XG4gICAgb25DaGVja2JveENoYW5nZShldmVudDogYW55KTogdm9pZDtcbiAgICBvbkJsdXIoKTogdm9pZDtcbiAgICBvbkNoYW5nZTogKF86IGFueSkgPT4gdm9pZDtcbiAgICBvblRvdWNoZWQ6ICgpID0+IHZvaWQ7XG4gICAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZDtcbiAgICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAoXzogYW55KSA9PiB2b2lkKTogdm9pZDtcbiAgICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCk6IHZvaWQ7XG4gICAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZDtcbn1cbiJdfQ==