import { Validator, AbstractControl } from '@angular/forms';
import * as ɵngcc0 from '@angular/core';
export declare class EqualValidatorDirective implements Validator {
    validateEqual: string;
    reverse: string;
    constructor(validateEqual: string, reverse: string);
    private readonly isReverse;
    validate(c: AbstractControl): {
        [key: string]: any;
    } | null;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<EqualValidatorDirective, [{ attribute: "validateEqual"; }, { attribute: "reverse"; }]>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<EqualValidatorDirective, "[mdb-validateEqual][formControlName],[validateEqual][formControl],[validateEqual][ngModel]", never, {}, {}, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXF1YWwtdmFsaWRhdG9yLmRpcmVjdGl2ZS5kLnRzIiwic291cmNlcyI6WyJlcXVhbC12YWxpZGF0b3IuZGlyZWN0aXZlLmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBQ0E7Ozs7Ozs7Ozs7QUFRQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFZhbGlkYXRvciwgQWJzdHJhY3RDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuZXhwb3J0IGRlY2xhcmUgY2xhc3MgRXF1YWxWYWxpZGF0b3JEaXJlY3RpdmUgaW1wbGVtZW50cyBWYWxpZGF0b3Ige1xuICAgIHZhbGlkYXRlRXF1YWw6IHN0cmluZztcbiAgICByZXZlcnNlOiBzdHJpbmc7XG4gICAgY29uc3RydWN0b3IodmFsaWRhdGVFcXVhbDogc3RyaW5nLCByZXZlcnNlOiBzdHJpbmcpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgaXNSZXZlcnNlO1xuICAgIHZhbGlkYXRlKGM6IEFic3RyYWN0Q29udHJvbCk6IHtcbiAgICAgICAgW2tleTogc3RyaW5nXTogYW55O1xuICAgIH0gfCBudWxsO1xufVxuIl19