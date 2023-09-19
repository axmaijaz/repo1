import { AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { SBItemComponent } from './sb-item';
import * as ɵngcc0 from '@angular/core';
export declare class SBItemHeadComponent implements OnInit, AfterViewInit {
    private sbItem;
    private _cdRef;
    isDisabled: boolean;
    customClass: string;
    indicator: boolean;
    id: string;
    ariaExpanded: boolean;
    ariaControls: string;
    constructor(sbItem: SBItemComponent, _cdRef: ChangeDetectorRef);
    onKeyDown(event: KeyboardEvent): void;
    toggleClick(event: any): void;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<SBItemHeadComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<SBItemHeadComponent, "mdb-item-head, mdb-accordion-item-head", ["sbItemHead"], { "isDisabled": "isDisabled"; "indicator": "indicator"; "customClass": "customClass"; }, {}, never, ["*"]>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ItaXRlbS5oZWFkLmQudHMiLCJzb3VyY2VzIjpbInNiLWl0ZW0uaGVhZC5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7OztBQWNBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgQ2hhbmdlRGV0ZWN0b3JSZWYsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU0JJdGVtQ29tcG9uZW50IH0gZnJvbSAnLi9zYi1pdGVtJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIFNCSXRlbUhlYWRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQge1xuICAgIHByaXZhdGUgc2JJdGVtO1xuICAgIHByaXZhdGUgX2NkUmVmO1xuICAgIGlzRGlzYWJsZWQ6IGJvb2xlYW47XG4gICAgY3VzdG9tQ2xhc3M6IHN0cmluZztcbiAgICBpbmRpY2F0b3I6IGJvb2xlYW47XG4gICAgaWQ6IHN0cmluZztcbiAgICBhcmlhRXhwYW5kZWQ6IGJvb2xlYW47XG4gICAgYXJpYUNvbnRyb2xzOiBzdHJpbmc7XG4gICAgY29uc3RydWN0b3Ioc2JJdGVtOiBTQkl0ZW1Db21wb25lbnQsIF9jZFJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpO1xuICAgIG9uS2V5RG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQ7XG4gICAgdG9nZ2xlQ2xpY2soZXZlbnQ6IGFueSk6IHZvaWQ7XG4gICAgbmdPbkluaXQoKTogdm9pZDtcbiAgICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZDtcbn1cbiJdfQ==