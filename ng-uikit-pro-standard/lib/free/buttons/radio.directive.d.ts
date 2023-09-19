import { ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import * as ɵngcc0 from '@angular/core';
export declare const RADIO_CONTROL_VALUE_ACCESSOR: any;
/**
 * Create radio buttons or groups of buttons.
 * A value of a selected button is bound to a variable specified via ngModel.
 */
export declare class ButtonRadioDirective implements ControlValueAccessor, OnInit {
    protected el: ElementRef;
    private renderer;
    onChange: any;
    onTouched: any;
    radioElementsArray: Array<any>;
    /** Radio button value, will be set to `ngModel` */
    mdbRadio: any;
    /** If `true` — radio button can be unchecked */
    uncheckable: boolean;
    /** Current value of radio component or group */
    value: any;
    readonly isActive: boolean;
    onClick(event?: any): void;
    constructor(el: ElementRef, renderer: Renderer2);
    ngOnInit(): void;
    onBlur(): void;
    writeValue(value: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ButtonRadioDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<ButtonRadioDirective, "[mdbRadio]", never, { "value": "value"; "uncheckable": "uncheckable"; "mdbRadio": "mdbRadio"; }, {}, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8uZGlyZWN0aXZlLmQudHMiLCJzb3VyY2VzIjpbInJhZGlvLmRpcmVjdGl2ZS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRWxlbWVudFJlZiwgT25Jbml0LCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuZXhwb3J0IGRlY2xhcmUgY29uc3QgUkFESU9fQ09OVFJPTF9WQUxVRV9BQ0NFU1NPUjogYW55O1xuLyoqXG4gKiBDcmVhdGUgcmFkaW8gYnV0dG9ucyBvciBncm91cHMgb2YgYnV0dG9ucy5cbiAqIEEgdmFsdWUgb2YgYSBzZWxlY3RlZCBidXR0b24gaXMgYm91bmQgdG8gYSB2YXJpYWJsZSBzcGVjaWZpZWQgdmlhIG5nTW9kZWwuXG4gKi9cbmV4cG9ydCBkZWNsYXJlIGNsYXNzIEJ1dHRvblJhZGlvRGlyZWN0aXZlIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uSW5pdCB7XG4gICAgcHJvdGVjdGVkIGVsOiBFbGVtZW50UmVmO1xuICAgIHByaXZhdGUgcmVuZGVyZXI7XG4gICAgb25DaGFuZ2U6IGFueTtcbiAgICBvblRvdWNoZWQ6IGFueTtcbiAgICByYWRpb0VsZW1lbnRzQXJyYXk6IEFycmF5PGFueT47XG4gICAgLyoqIFJhZGlvIGJ1dHRvbiB2YWx1ZSwgd2lsbCBiZSBzZXQgdG8gYG5nTW9kZWxgICovXG4gICAgbWRiUmFkaW86IGFueTtcbiAgICAvKiogSWYgYHRydWVgIOKAlCByYWRpbyBidXR0b24gY2FuIGJlIHVuY2hlY2tlZCAqL1xuICAgIHVuY2hlY2thYmxlOiBib29sZWFuO1xuICAgIC8qKiBDdXJyZW50IHZhbHVlIG9mIHJhZGlvIGNvbXBvbmVudCBvciBncm91cCAqL1xuICAgIHZhbHVlOiBhbnk7XG4gICAgcmVhZG9ubHkgaXNBY3RpdmU6IGJvb2xlYW47XG4gICAgb25DbGljayhldmVudD86IGFueSk6IHZvaWQ7XG4gICAgY29uc3RydWN0b3IoZWw6IEVsZW1lbnRSZWYsIHJlbmRlcmVyOiBSZW5kZXJlcjIpO1xuICAgIG5nT25Jbml0KCk6IHZvaWQ7XG4gICAgb25CbHVyKCk6IHZvaWQ7XG4gICAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZDtcbiAgICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkO1xuICAgIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpOiB2b2lkO1xufVxuIl19