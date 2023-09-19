import { ElementRef, OnInit, Renderer2 } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare class MdbValidateDirective implements OnInit {
    private renderer;
    private el;
    private _validate;
    private _validateSuccess;
    private _validateError;
    mdbValidate: boolean;
    validate: boolean;
    validateSuccess: boolean;
    validateError: boolean;
    constructor(renderer: Renderer2, el: ElementRef);
    updateSuccessClass(): void;
    updateErrorClass(): void;
    ngOnInit(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MdbValidateDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<MdbValidateDirective, "[mdbValidate]", never, { "validate": "validate"; "validateSuccess": "validateSuccess"; "validateError": "validateError"; "mdbValidate": "mdbValidate"; }, {}, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGUuZGlyZWN0aXZlLmQudHMiLCJzb3VyY2VzIjpbInZhbGlkYXRlLmRpcmVjdGl2ZS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FBY0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbGVtZW50UmVmLCBPbkluaXQsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuZXhwb3J0IGRlY2xhcmUgY2xhc3MgTWRiVmFsaWRhdGVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIHByaXZhdGUgcmVuZGVyZXI7XG4gICAgcHJpdmF0ZSBlbDtcbiAgICBwcml2YXRlIF92YWxpZGF0ZTtcbiAgICBwcml2YXRlIF92YWxpZGF0ZVN1Y2Nlc3M7XG4gICAgcHJpdmF0ZSBfdmFsaWRhdGVFcnJvcjtcbiAgICBtZGJWYWxpZGF0ZTogYm9vbGVhbjtcbiAgICB2YWxpZGF0ZTogYm9vbGVhbjtcbiAgICB2YWxpZGF0ZVN1Y2Nlc3M6IGJvb2xlYW47XG4gICAgdmFsaWRhdGVFcnJvcjogYm9vbGVhbjtcbiAgICBjb25zdHJ1Y3RvcihyZW5kZXJlcjogUmVuZGVyZXIyLCBlbDogRWxlbWVudFJlZik7XG4gICAgdXBkYXRlU3VjY2Vzc0NsYXNzKCk6IHZvaWQ7XG4gICAgdXBkYXRlRXJyb3JDbGFzcygpOiB2b2lkO1xuICAgIG5nT25Jbml0KCk6IHZvaWQ7XG59XG4iXX0=