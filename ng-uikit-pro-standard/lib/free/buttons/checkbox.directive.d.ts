import { OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import * as ɵngcc0 from '@angular/core';
export declare const CHECKBOX_CONTROL_VALUE_ACCESSOR: any;
/**
 * Add checkbox functionality to any element
 */
export declare class ButtonCheckboxDirective implements ControlValueAccessor, OnInit {
    /** Truthy value, will be set to ngModel */
    btnCheckboxTrue: any;
    /** Falsy value, will be set to ngModel */
    btnCheckboxFalse: any;
    state: boolean;
    protected value: any;
    protected isDisabled: boolean;
    protected onChange: any;
    protected onTouched: any;
    onClick(): void;
    ngOnInit(): any;
    protected readonly trueValue: boolean;
    protected readonly falseValue: boolean;
    toggle(state: boolean): void;
    writeValue(value: any): void;
    setDisabledState(isDisabled: boolean): void;
    registerOnChange(fn: (_: any) => {}): void;
    registerOnTouched(fn: () => {}): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ButtonCheckboxDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<ButtonCheckboxDirective, "[mdbCheckbox]", never, { "btnCheckboxTrue": "btnCheckboxTrue"; "btnCheckboxFalse": "btnCheckboxFalse"; }, {}, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3guZGlyZWN0aXZlLmQudHMiLCJzb3VyY2VzIjpbImNoZWNrYm94LmRpcmVjdGl2ZS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVCQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5leHBvcnQgZGVjbGFyZSBjb25zdCBDSEVDS0JPWF9DT05UUk9MX1ZBTFVFX0FDQ0VTU09SOiBhbnk7XG4vKipcbiAqIEFkZCBjaGVja2JveCBmdW5jdGlvbmFsaXR5IHRvIGFueSBlbGVtZW50XG4gKi9cbmV4cG9ydCBkZWNsYXJlIGNsYXNzIEJ1dHRvbkNoZWNrYm94RGlyZWN0aXZlIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uSW5pdCB7XG4gICAgLyoqIFRydXRoeSB2YWx1ZSwgd2lsbCBiZSBzZXQgdG8gbmdNb2RlbCAqL1xuICAgIGJ0bkNoZWNrYm94VHJ1ZTogYW55O1xuICAgIC8qKiBGYWxzeSB2YWx1ZSwgd2lsbCBiZSBzZXQgdG8gbmdNb2RlbCAqL1xuICAgIGJ0bkNoZWNrYm94RmFsc2U6IGFueTtcbiAgICBzdGF0ZTogYm9vbGVhbjtcbiAgICBwcm90ZWN0ZWQgdmFsdWU6IGFueTtcbiAgICBwcm90ZWN0ZWQgaXNEaXNhYmxlZDogYm9vbGVhbjtcbiAgICBwcm90ZWN0ZWQgb25DaGFuZ2U6IGFueTtcbiAgICBwcm90ZWN0ZWQgb25Ub3VjaGVkOiBhbnk7XG4gICAgb25DbGljaygpOiB2b2lkO1xuICAgIG5nT25Jbml0KCk6IGFueTtcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgdHJ1ZVZhbHVlOiBib29sZWFuO1xuICAgIHByb3RlY3RlZCByZWFkb25seSBmYWxzZVZhbHVlOiBib29sZWFuO1xuICAgIHRvZ2dsZShzdGF0ZTogYm9vbGVhbik6IHZvaWQ7XG4gICAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZDtcbiAgICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkO1xuICAgIHJlZ2lzdGVyT25DaGFuZ2UoZm46IChfOiBhbnkpID0+IHt9KTogdm9pZDtcbiAgICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4ge30pOiB2b2lkO1xufVxuIl19