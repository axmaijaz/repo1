import { ElementRef, Renderer2 } from '@angular/core';
import { IMyInputAutoFill } from '../interfaces/inputAutofill.interface';
import * as ɵngcc0 from '@angular/core';
export declare class InputAutoFillDirective {
    private el;
    private rndr;
    opts: IMyInputAutoFill;
    constructor(el: ElementRef, rndr: Renderer2);
    onKeyUp(evt: KeyboardEvent): void;
    private endsWith;
    private insertPos;
    private getPartLength;
    private isNumber;
    private isDay;
    private isMonth;
    private getInputValue;
    private setInputValue;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<InputAutoFillDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<InputAutoFillDirective, "[mdbInputAutoFill]", never, { "opts": "opts"; }, {}, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlckF1dG9maWxsLmRpcmVjdGl2ZS5kLnRzIiwic291cmNlcyI6WyJkYXRlcGlja2VyQXV0b2ZpbGwuZGlyZWN0aXZlLmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7O0FBY0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbGVtZW50UmVmLCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IElNeUlucHV0QXV0b0ZpbGwgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2lucHV0QXV0b2ZpbGwuaW50ZXJmYWNlJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIElucHV0QXV0b0ZpbGxEaXJlY3RpdmUge1xuICAgIHByaXZhdGUgZWw7XG4gICAgcHJpdmF0ZSBybmRyO1xuICAgIG9wdHM6IElNeUlucHV0QXV0b0ZpbGw7XG4gICAgY29uc3RydWN0b3IoZWw6IEVsZW1lbnRSZWYsIHJuZHI6IFJlbmRlcmVyMik7XG4gICAgb25LZXlVcChldnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkO1xuICAgIHByaXZhdGUgZW5kc1dpdGg7XG4gICAgcHJpdmF0ZSBpbnNlcnRQb3M7XG4gICAgcHJpdmF0ZSBnZXRQYXJ0TGVuZ3RoO1xuICAgIHByaXZhdGUgaXNOdW1iZXI7XG4gICAgcHJpdmF0ZSBpc0RheTtcbiAgICBwcml2YXRlIGlzTW9udGg7XG4gICAgcHJpdmF0ZSBnZXRJbnB1dFZhbHVlO1xuICAgIHByaXZhdGUgc2V0SW5wdXRWYWx1ZTtcbn1cbiJdfQ==