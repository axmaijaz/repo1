import { OnDestroy, OnInit } from '@angular/core';
import { ProgressDirective } from './progress.directive';
import * as ɵngcc0 from '@angular/core';
export declare class BarComponent implements OnInit, OnDestroy {
    max: number;
    /** provide one of the four supported contextual classes: `success`, `info`, `warning`, `danger` */
    type: string;
    /** current value of progress bar */
    value: number;
    percent: number;
    transition: string;
    progress: ProgressDirective;
    protected _value: number;
    constructor(progress: ProgressDirective);
    ngOnInit(): void;
    ngOnDestroy(): void;
    recalculatePercentage(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<BarComponent, [{ host: true; }]>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<BarComponent, "mdb-bar", never, { "value": "value"; "type": "type"; }, {}, never, ["*"]>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFyLmNvbXBvbmVudC5kLnRzIiwic291cmNlcyI6WyJiYXIuY29tcG9uZW50LmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7O0FBY0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPbkRlc3Ryb3ksIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUHJvZ3Jlc3NEaXJlY3RpdmUgfSBmcm9tICcuL3Byb2dyZXNzLmRpcmVjdGl2ZSc7XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBCYXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gICAgbWF4OiBudW1iZXI7XG4gICAgLyoqIHByb3ZpZGUgb25lIG9mIHRoZSBmb3VyIHN1cHBvcnRlZCBjb250ZXh0dWFsIGNsYXNzZXM6IGBzdWNjZXNzYCwgYGluZm9gLCBgd2FybmluZ2AsIGBkYW5nZXJgICovXG4gICAgdHlwZTogc3RyaW5nO1xuICAgIC8qKiBjdXJyZW50IHZhbHVlIG9mIHByb2dyZXNzIGJhciAqL1xuICAgIHZhbHVlOiBudW1iZXI7XG4gICAgcGVyY2VudDogbnVtYmVyO1xuICAgIHRyYW5zaXRpb246IHN0cmluZztcbiAgICBwcm9ncmVzczogUHJvZ3Jlc3NEaXJlY3RpdmU7XG4gICAgcHJvdGVjdGVkIF92YWx1ZTogbnVtYmVyO1xuICAgIGNvbnN0cnVjdG9yKHByb2dyZXNzOiBQcm9ncmVzc0RpcmVjdGl2ZSk7XG4gICAgbmdPbkluaXQoKTogdm9pZDtcbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkO1xuICAgIHJlY2FsY3VsYXRlUGVyY2VudGFnZSgpOiB2b2lkO1xufVxuIl19