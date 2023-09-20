import { ElementRef, Renderer2, AfterViewInit, AfterViewChecked, OnInit, DoCheck, OnChanges, SimpleChanges } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare class MdbInputDirective implements AfterViewChecked, OnInit, AfterViewInit, DoCheck, OnChanges {
    private _elRef;
    private _renderer;
    wrongTextContainer: any;
    rightTextContainer: any;
    el: ElementRef | any;
    elLabel: ElementRef | any;
    elIcon: Element | any;
    element: any;
    mdbInputDirective: MdbInputDirective;
    customRegex: any;
    mdbValidate: boolean;
    validateSuccess: boolean;
    validateError: boolean;
    focusCheckbox: boolean;
    focusRadio: boolean;
    errorMessage: string;
    successMessage: string;
    isBrowser: any;
    isClicked: boolean;
    constructor(_elRef: ElementRef, _renderer: Renderer2, platformId: string);
    onfocus(): void;
    onblur(): void;
    onchange(): void;
    oniput(): void;
    onkeydown(event: any): void;
    oncut(): void;
    onpaste(): void;
    ondrop(): void;
    updateErrorMsg(value: string): void;
    updateSuccessMsg(value: string): void;
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngDoCheck(): void;
    validationFunction(): void;
    ngAfterViewInit(): void;
    ngAfterViewChecked(): void;
    resize(): void;
    delayedResize(): void;
    initComponent(): void;
    private checkValue;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MdbInputDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<MdbInputDirective, "[mdbInputDirective]", never, { "mdbValidate": "mdbValidate"; "validateSuccess": "validateSuccess"; "validateError": "validateError"; "focusCheckbox": "focusCheckbox"; "focusRadio": "focusRadio"; "mdbInputDirective": "mdbInputDirective"; "customRegex": "customRegex"; "errorMessage": "errorMessage"; "successMessage": "successMessage"; }, {}, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWRiLWlucHV0LmRpcmVjdGl2ZS5kLnRzIiwic291cmNlcyI6WyJtZGItaW5wdXQuZGlyZWN0aXZlLmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5Q0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbGVtZW50UmVmLCBSZW5kZXJlcjIsIEFmdGVyVmlld0luaXQsIEFmdGVyVmlld0NoZWNrZWQsIE9uSW5pdCwgRG9DaGVjaywgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBNZGJJbnB1dERpcmVjdGl2ZSBpbXBsZW1lbnRzIEFmdGVyVmlld0NoZWNrZWQsIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgRG9DaGVjaywgT25DaGFuZ2VzIHtcbiAgICBwcml2YXRlIF9lbFJlZjtcbiAgICBwcml2YXRlIF9yZW5kZXJlcjtcbiAgICB3cm9uZ1RleHRDb250YWluZXI6IGFueTtcbiAgICByaWdodFRleHRDb250YWluZXI6IGFueTtcbiAgICBlbDogRWxlbWVudFJlZiB8IGFueTtcbiAgICBlbExhYmVsOiBFbGVtZW50UmVmIHwgYW55O1xuICAgIGVsSWNvbjogRWxlbWVudCB8IGFueTtcbiAgICBlbGVtZW50OiBhbnk7XG4gICAgbWRiSW5wdXREaXJlY3RpdmU6IE1kYklucHV0RGlyZWN0aXZlO1xuICAgIGN1c3RvbVJlZ2V4OiBhbnk7XG4gICAgbWRiVmFsaWRhdGU6IGJvb2xlYW47XG4gICAgdmFsaWRhdGVTdWNjZXNzOiBib29sZWFuO1xuICAgIHZhbGlkYXRlRXJyb3I6IGJvb2xlYW47XG4gICAgZm9jdXNDaGVja2JveDogYm9vbGVhbjtcbiAgICBmb2N1c1JhZGlvOiBib29sZWFuO1xuICAgIGVycm9yTWVzc2FnZTogc3RyaW5nO1xuICAgIHN1Y2Nlc3NNZXNzYWdlOiBzdHJpbmc7XG4gICAgaXNCcm93c2VyOiBhbnk7XG4gICAgaXNDbGlja2VkOiBib29sZWFuO1xuICAgIGNvbnN0cnVjdG9yKF9lbFJlZjogRWxlbWVudFJlZiwgX3JlbmRlcmVyOiBSZW5kZXJlcjIsIHBsYXRmb3JtSWQ6IHN0cmluZyk7XG4gICAgb25mb2N1cygpOiB2b2lkO1xuICAgIG9uYmx1cigpOiB2b2lkO1xuICAgIG9uY2hhbmdlKCk6IHZvaWQ7XG4gICAgb25pcHV0KCk6IHZvaWQ7XG4gICAgb25rZXlkb3duKGV2ZW50OiBhbnkpOiB2b2lkO1xuICAgIG9uY3V0KCk6IHZvaWQ7XG4gICAgb25wYXN0ZSgpOiB2b2lkO1xuICAgIG9uZHJvcCgpOiB2b2lkO1xuICAgIHVwZGF0ZUVycm9yTXNnKHZhbHVlOiBzdHJpbmcpOiB2b2lkO1xuICAgIHVwZGF0ZVN1Y2Nlc3NNc2codmFsdWU6IHN0cmluZyk6IHZvaWQ7XG4gICAgbmdPbkluaXQoKTogdm9pZDtcbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZDtcbiAgICBuZ0RvQ2hlY2soKTogdm9pZDtcbiAgICB2YWxpZGF0aW9uRnVuY3Rpb24oKTogdm9pZDtcbiAgICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZDtcbiAgICBuZ0FmdGVyVmlld0NoZWNrZWQoKTogdm9pZDtcbiAgICByZXNpemUoKTogdm9pZDtcbiAgICBkZWxheWVkUmVzaXplKCk6IHZvaWQ7XG4gICAgaW5pdENvbXBvbmVudCgpOiB2b2lkO1xuICAgIHByaXZhdGUgY2hlY2tWYWx1ZTtcbn1cbiJdfQ==