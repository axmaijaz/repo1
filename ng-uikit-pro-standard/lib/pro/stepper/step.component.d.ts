import { TemplateRef, ElementRef, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as ɵngcc0 from '@angular/core';
export declare class MdbStepComponent implements OnInit {
    el: ElementRef;
    content: TemplateRef<any>;
    editable: boolean;
    name: string;
    label: string;
    stepForm: FormGroup;
    constructor(el: ElementRef);
    isDone: boolean;
    private _isDone;
    isWrong: boolean;
    private _isWrong;
    isActive: boolean;
    private _isActive;
    private _removeClasses;
    reset(): void;
    ngOnInit(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MdbStepComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<MdbStepComponent, "mdb-step", ["mdbStep"], { "editable": "editable"; "name": "name"; "label": "label"; "stepForm": "stepForm"; }, {}, never, ["*"]>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcC5jb21wb25lbnQuZC50cyIsInNvdXJjZXMiOlsic3RlcC5jb21wb25lbnQuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZVJlZiwgRWxlbWVudFJlZiwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtR3JvdXAgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBNZGJTdGVwQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBlbDogRWxlbWVudFJlZjtcbiAgICBjb250ZW50OiBUZW1wbGF0ZVJlZjxhbnk+O1xuICAgIGVkaXRhYmxlOiBib29sZWFuO1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBsYWJlbDogc3RyaW5nO1xuICAgIHN0ZXBGb3JtOiBGb3JtR3JvdXA7XG4gICAgY29uc3RydWN0b3IoZWw6IEVsZW1lbnRSZWYpO1xuICAgIGlzRG9uZTogYm9vbGVhbjtcbiAgICBwcml2YXRlIF9pc0RvbmU7XG4gICAgaXNXcm9uZzogYm9vbGVhbjtcbiAgICBwcml2YXRlIF9pc1dyb25nO1xuICAgIGlzQWN0aXZlOiBib29sZWFuO1xuICAgIHByaXZhdGUgX2lzQWN0aXZlO1xuICAgIHByaXZhdGUgX3JlbW92ZUNsYXNzZXM7XG4gICAgcmVzZXQoKTogdm9pZDtcbiAgICBuZ09uSW5pdCgpOiB2b2lkO1xufVxuIl19