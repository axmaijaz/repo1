import { ElementRef, OnDestroy } from '@angular/core';
import { BsDropdownState } from './dropdown.state';
import * as ɵngcc0 from '@angular/core';
export declare class BsDropdownToggleDirective implements OnDestroy {
    private _state;
    private _element;
    private _subscriptions;
    ariaHaspopup: boolean;
    isDisabled: boolean | any;
    isOpen: boolean;
    onClick(): void;
    onDocumentClick(event: any): void;
    onEsc(): void;
    constructor(_state: BsDropdownState, _element: ElementRef);
    ngOnDestroy(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<BsDropdownToggleDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<BsDropdownToggleDirective, "[mdbDropdownToggle],[dropdownToggle]", ["bs-dropdown-toggle"], {}, {}, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcGRvd24tdG9nZ2xlLmRpcmVjdGl2ZS5kLnRzIiwic291cmNlcyI6WyJkcm9wZG93bi10b2dnbGUuZGlyZWN0aXZlLmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQUVBOzs7Ozs7Ozs7Ozs7OztBQVlBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRWxlbWVudFJlZiwgT25EZXN0cm95IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCc0Ryb3Bkb3duU3RhdGUgfSBmcm9tICcuL2Ryb3Bkb3duLnN0YXRlJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIEJzRHJvcGRvd25Ub2dnbGVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICAgIHByaXZhdGUgX3N0YXRlO1xuICAgIHByaXZhdGUgX2VsZW1lbnQ7XG4gICAgcHJpdmF0ZSBfc3Vic2NyaXB0aW9ucztcbiAgICBhcmlhSGFzcG9wdXA6IGJvb2xlYW47XG4gICAgaXNEaXNhYmxlZDogYm9vbGVhbiB8IGFueTtcbiAgICBpc09wZW46IGJvb2xlYW47XG4gICAgb25DbGljaygpOiB2b2lkO1xuICAgIG9uRG9jdW1lbnRDbGljayhldmVudDogYW55KTogdm9pZDtcbiAgICBvbkVzYygpOiB2b2lkO1xuICAgIGNvbnN0cnVjdG9yKF9zdGF0ZTogQnNEcm9wZG93blN0YXRlLCBfZWxlbWVudDogRWxlbWVudFJlZik7XG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZDtcbn1cbiJdfQ==