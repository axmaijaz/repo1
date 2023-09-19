import { ElementRef, InjectionToken, OnInit } from '@angular/core';
import { ISelectedOption } from '../interfaces/selected-option.interface';
import { Subject, Observable } from 'rxjs';
import * as ɵngcc0 from '@angular/core';
export interface MdbOptionParent {
    optionHeight: number;
    visibleOptions: number;
}
export declare const MDB_OPTION_PARENT: InjectionToken<MdbOptionParent>;
export declare class MdbOptionComponent implements OnInit {
    el: ElementRef;
    private _parent;
    value: string;
    disabled: boolean;
    _optionHeight: any;
    readonly optionHeight: any;
    clicked: boolean;
    selectedItem: ISelectedOption;
    clickSource: Subject<MdbOptionComponent>;
    click$: Observable<MdbOptionComponent>;
    constructor(el: ElementRef, _parent: MdbOptionParent);
    onClick(): void;
    readonly label: any;
    ngOnInit(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MdbOptionComponent, [null, { optional: true; }]>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<MdbOptionComponent, "mdb-option", never, { "value": "value"; "disabled": "disabled"; }, {}, never, ["*"]>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWRiLW9wdGlvbi5jb21wb25lbnQuZC50cyIsInNvdXJjZXMiOlsibWRiLW9wdGlvbi5jb21wb25lbnQuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRWxlbWVudFJlZiwgSW5qZWN0aW9uVG9rZW4sIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSVNlbGVjdGVkT3B0aW9uIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9zZWxlY3RlZC1vcHRpb24uaW50ZXJmYWNlJztcbmltcG9ydCB7IFN1YmplY3QsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmV4cG9ydCBpbnRlcmZhY2UgTWRiT3B0aW9uUGFyZW50IHtcbiAgICBvcHRpb25IZWlnaHQ6IG51bWJlcjtcbiAgICB2aXNpYmxlT3B0aW9uczogbnVtYmVyO1xufVxuZXhwb3J0IGRlY2xhcmUgY29uc3QgTURCX09QVElPTl9QQVJFTlQ6IEluamVjdGlvblRva2VuPE1kYk9wdGlvblBhcmVudD47XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBNZGJPcHRpb25Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIGVsOiBFbGVtZW50UmVmO1xuICAgIHByaXZhdGUgX3BhcmVudDtcbiAgICB2YWx1ZTogc3RyaW5nO1xuICAgIGRpc2FibGVkOiBib29sZWFuO1xuICAgIF9vcHRpb25IZWlnaHQ6IGFueTtcbiAgICByZWFkb25seSBvcHRpb25IZWlnaHQ6IGFueTtcbiAgICBjbGlja2VkOiBib29sZWFuO1xuICAgIHNlbGVjdGVkSXRlbTogSVNlbGVjdGVkT3B0aW9uO1xuICAgIGNsaWNrU291cmNlOiBTdWJqZWN0PE1kYk9wdGlvbkNvbXBvbmVudD47XG4gICAgY2xpY2skOiBPYnNlcnZhYmxlPE1kYk9wdGlvbkNvbXBvbmVudD47XG4gICAgY29uc3RydWN0b3IoZWw6IEVsZW1lbnRSZWYsIF9wYXJlbnQ6IE1kYk9wdGlvblBhcmVudCk7XG4gICAgb25DbGljaygpOiB2b2lkO1xuICAgIHJlYWRvbmx5IGxhYmVsOiBhbnk7XG4gICAgbmdPbkluaXQoKTogdm9pZDtcbn1cbiJdfQ==