import { EventEmitter } from '@angular/core';
import { BsComponentRef } from '../utils/component-loader/bs-component-ref.class';
import * as ɵngcc0 from '@angular/core';
export declare class BsDropdownState {
    direction: 'down' | 'up';
    autoClose: boolean;
    isOpenChange: EventEmitter<boolean>;
    isDisabledChange: EventEmitter<boolean>;
    toggleClick: EventEmitter<boolean>;
    /**
     * Content to be displayed as popover.
     */
    dropdownMenu: Promise<BsComponentRef<any>>;
    resolveDropdownMenu: (componentRef: BsComponentRef<any>) => void;
    constructor();
    static ɵfac: ɵngcc0.ɵɵFactoryDef<BsDropdownState, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<BsDropdownState>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcGRvd24uc3RhdGUuZC50cyIsInNvdXJjZXMiOlsiZHJvcGRvd24uc3RhdGUuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7O0FBWUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJzQ29tcG9uZW50UmVmIH0gZnJvbSAnLi4vdXRpbHMvY29tcG9uZW50LWxvYWRlci9icy1jb21wb25lbnQtcmVmLmNsYXNzJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIEJzRHJvcGRvd25TdGF0ZSB7XG4gICAgZGlyZWN0aW9uOiAnZG93bicgfCAndXAnO1xuICAgIGF1dG9DbG9zZTogYm9vbGVhbjtcbiAgICBpc09wZW5DaGFuZ2U6IEV2ZW50RW1pdHRlcjxib29sZWFuPjtcbiAgICBpc0Rpc2FibGVkQ2hhbmdlOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj47XG4gICAgdG9nZ2xlQ2xpY2s6IEV2ZW50RW1pdHRlcjxib29sZWFuPjtcbiAgICAvKipcbiAgICAgKiBDb250ZW50IHRvIGJlIGRpc3BsYXllZCBhcyBwb3BvdmVyLlxuICAgICAqL1xuICAgIGRyb3Bkb3duTWVudTogUHJvbWlzZTxCc0NvbXBvbmVudFJlZjxhbnk+PjtcbiAgICByZXNvbHZlRHJvcGRvd25NZW51OiAoY29tcG9uZW50UmVmOiBCc0NvbXBvbmVudFJlZjxhbnk+KSA9PiB2b2lkO1xuICAgIGNvbnN0cnVjdG9yKCk7XG59XG4iXX0=