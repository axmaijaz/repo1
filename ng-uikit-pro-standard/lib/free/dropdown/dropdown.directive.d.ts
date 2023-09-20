import { ElementRef, EmbeddedViewRef, EventEmitter, OnDestroy, OnInit, Renderer2, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ComponentLoader } from '../utils/component-loader/component-loader.class';
import { ComponentLoaderFactory } from '../utils/component-loader/component-loader.factory';
import { BsDropdownConfig } from './dropdown.config';
import { BsDropdownContainerComponent } from './dropdown-container.component';
import { BsDropdownState } from './dropdown.state';
import { BsDropdownMenuDirective } from './dropdown-menu.directive';
import * as ɵngcc0 from '@angular/core';
export declare class BsDropdownDirective implements OnInit, OnDestroy {
    private _elementRef;
    private _renderer;
    private _viewContainerRef;
    private _cis;
    private _config;
    private _state;
    private cdRef;
    /**
     * Placement of a popover. Accepts: "top", "bottom", "left", "right"
     */
    placement: string;
    /**
     * Specifies events that should trigger. Supports a space separated list of
     * event names.
     */
    triggers: string;
    /**
     * A selector specifying the element the popover should be appended to.
     * Currently only supports "body".
     */
    container: string;
    dropup: boolean;
    dropupDefault: boolean;
    /**
     * This attribute indicates that the dropdown should be opened upwards
     */
    readonly isDropup: true | undefined;
    /**
     * Indicates that dropdown will be closed on item or document click,
     * and after pressing ESC
     */
    autoClose: boolean;
    /**
     * Disables dropdown toggle and hides dropdown menu if opened
     */
    isDisabled: boolean;
    /**
     * Returns whether or not the popover is currently being shown
     */
    isOpen: boolean;
    /**
     * Emits an event when isOpen change
     */
    isOpenChange: EventEmitter<any>;
    /**
     * Emits an event when the popover is shown
     */
    onShown: EventEmitter<any>;
    shown: EventEmitter<any>;
    /**
     * Emits an event when the popover is hidden
     */
    onHidden: EventEmitter<any>;
    hidden: EventEmitter<any>;
    private _destroy$;
    readonly isBs4: boolean;
    _isInlineOpen: boolean;
    _showInline: boolean;
    _inlinedMenu: EmbeddedViewRef<BsDropdownMenuDirective>;
    _isDisabled: boolean;
    _dropdown: ComponentLoader<BsDropdownContainerComponent>;
    _subscriptions: Subscription[];
    _isInited: boolean;
    _isDropupDefault: boolean;
    constructor(_elementRef: ElementRef, _renderer: Renderer2, _viewContainerRef: ViewContainerRef, _cis: ComponentLoaderFactory, _config: BsDropdownConfig, _state: BsDropdownState, cdRef: ChangeDetectorRef);
    ngOnInit(): void;
    /**
     * Opens an element’s popover. This is considered a “manual” triggering of
     * the popover.
     */
    show(): void;
    /**
     * Closes an element’s popover. This is considered a “manual” triggering of
     * the popover.
     */
    hide(): void;
    /**
     * Toggles an element’s popover. This is considered a “manual” triggering of
     * the popover.
     */
    toggle(value?: boolean): void;
    ngOnDestroy(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<BsDropdownDirective, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<BsDropdownDirective, "[mdbDropdown],[dropdown]", ["bs-dropdown"], { "dropupDefault": "dropupDefault"; "autoClose": "autoClose"; "isDisabled": "isDisabled"; "isOpen": "isOpen"; "placement": "placement"; "triggers": "triggers"; "container": "container"; "dropup": "dropup"; }, { "onShown": "onShown"; "shown": "shown"; "onHidden": "onHidden"; "hidden": "hidden"; "isOpenChange": "isOpenChange"; }, never, ["*"]>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcGRvd24uZGlyZWN0aXZlLmQudHMiLCJzb3VyY2VzIjpbImRyb3Bkb3duLmRpcmVjdGl2ZS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUFRQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1GQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVsZW1lbnRSZWYsIEVtYmVkZGVkVmlld1JlZiwgRXZlbnRFbWl0dGVyLCBPbkRlc3Ryb3ksIE9uSW5pdCwgUmVuZGVyZXIyLCBWaWV3Q29udGFpbmVyUmVmLCBDaGFuZ2VEZXRlY3RvclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBDb21wb25lbnRMb2FkZXIgfSBmcm9tICcuLi91dGlscy9jb21wb25lbnQtbG9hZGVyL2NvbXBvbmVudC1sb2FkZXIuY2xhc3MnO1xuaW1wb3J0IHsgQ29tcG9uZW50TG9hZGVyRmFjdG9yeSB9IGZyb20gJy4uL3V0aWxzL2NvbXBvbmVudC1sb2FkZXIvY29tcG9uZW50LWxvYWRlci5mYWN0b3J5JztcbmltcG9ydCB7IEJzRHJvcGRvd25Db25maWcgfSBmcm9tICcuL2Ryb3Bkb3duLmNvbmZpZyc7XG5pbXBvcnQgeyBCc0Ryb3Bkb3duQ29udGFpbmVyQ29tcG9uZW50IH0gZnJvbSAnLi9kcm9wZG93bi1jb250YWluZXIuY29tcG9uZW50JztcbmltcG9ydCB7IEJzRHJvcGRvd25TdGF0ZSB9IGZyb20gJy4vZHJvcGRvd24uc3RhdGUnO1xuaW1wb3J0IHsgQnNEcm9wZG93bk1lbnVEaXJlY3RpdmUgfSBmcm9tICcuL2Ryb3Bkb3duLW1lbnUuZGlyZWN0aXZlJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIEJzRHJvcGRvd25EaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjtcbiAgICBwcml2YXRlIF9yZW5kZXJlcjtcbiAgICBwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmO1xuICAgIHByaXZhdGUgX2NpcztcbiAgICBwcml2YXRlIF9jb25maWc7XG4gICAgcHJpdmF0ZSBfc3RhdGU7XG4gICAgcHJpdmF0ZSBjZFJlZjtcbiAgICAvKipcbiAgICAgKiBQbGFjZW1lbnQgb2YgYSBwb3BvdmVyLiBBY2NlcHRzOiBcInRvcFwiLCBcImJvdHRvbVwiLCBcImxlZnRcIiwgXCJyaWdodFwiXG4gICAgICovXG4gICAgcGxhY2VtZW50OiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogU3BlY2lmaWVzIGV2ZW50cyB0aGF0IHNob3VsZCB0cmlnZ2VyLiBTdXBwb3J0cyBhIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mXG4gICAgICogZXZlbnQgbmFtZXMuXG4gICAgICovXG4gICAgdHJpZ2dlcnM6IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBBIHNlbGVjdG9yIHNwZWNpZnlpbmcgdGhlIGVsZW1lbnQgdGhlIHBvcG92ZXIgc2hvdWxkIGJlIGFwcGVuZGVkIHRvLlxuICAgICAqIEN1cnJlbnRseSBvbmx5IHN1cHBvcnRzIFwiYm9keVwiLlxuICAgICAqL1xuICAgIGNvbnRhaW5lcjogc3RyaW5nO1xuICAgIGRyb3B1cDogYm9vbGVhbjtcbiAgICBkcm9wdXBEZWZhdWx0OiBib29sZWFuO1xuICAgIC8qKlxuICAgICAqIFRoaXMgYXR0cmlidXRlIGluZGljYXRlcyB0aGF0IHRoZSBkcm9wZG93biBzaG91bGQgYmUgb3BlbmVkIHVwd2FyZHNcbiAgICAgKi9cbiAgICByZWFkb25seSBpc0Ryb3B1cDogdHJ1ZSB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBJbmRpY2F0ZXMgdGhhdCBkcm9wZG93biB3aWxsIGJlIGNsb3NlZCBvbiBpdGVtIG9yIGRvY3VtZW50IGNsaWNrLFxuICAgICAqIGFuZCBhZnRlciBwcmVzc2luZyBFU0NcbiAgICAgKi9cbiAgICBhdXRvQ2xvc2U6IGJvb2xlYW47XG4gICAgLyoqXG4gICAgICogRGlzYWJsZXMgZHJvcGRvd24gdG9nZ2xlIGFuZCBoaWRlcyBkcm9wZG93biBtZW51IGlmIG9wZW5lZFxuICAgICAqL1xuICAgIGlzRGlzYWJsZWQ6IGJvb2xlYW47XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgcG9wb3ZlciBpcyBjdXJyZW50bHkgYmVpbmcgc2hvd25cbiAgICAgKi9cbiAgICBpc09wZW46IGJvb2xlYW47XG4gICAgLyoqXG4gICAgICogRW1pdHMgYW4gZXZlbnQgd2hlbiBpc09wZW4gY2hhbmdlXG4gICAgICovXG4gICAgaXNPcGVuQ2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PjtcbiAgICAvKipcbiAgICAgKiBFbWl0cyBhbiBldmVudCB3aGVuIHRoZSBwb3BvdmVyIGlzIHNob3duXG4gICAgICovXG4gICAgb25TaG93bjogRXZlbnRFbWl0dGVyPGFueT47XG4gICAgc2hvd246IEV2ZW50RW1pdHRlcjxhbnk+O1xuICAgIC8qKlxuICAgICAqIEVtaXRzIGFuIGV2ZW50IHdoZW4gdGhlIHBvcG92ZXIgaXMgaGlkZGVuXG4gICAgICovXG4gICAgb25IaWRkZW46IEV2ZW50RW1pdHRlcjxhbnk+O1xuICAgIGhpZGRlbjogRXZlbnRFbWl0dGVyPGFueT47XG4gICAgcHJpdmF0ZSBfZGVzdHJveSQ7XG4gICAgcmVhZG9ubHkgaXNCczQ6IGJvb2xlYW47XG4gICAgX2lzSW5saW5lT3BlbjogYm9vbGVhbjtcbiAgICBfc2hvd0lubGluZTogYm9vbGVhbjtcbiAgICBfaW5saW5lZE1lbnU6IEVtYmVkZGVkVmlld1JlZjxCc0Ryb3Bkb3duTWVudURpcmVjdGl2ZT47XG4gICAgX2lzRGlzYWJsZWQ6IGJvb2xlYW47XG4gICAgX2Ryb3Bkb3duOiBDb21wb25lbnRMb2FkZXI8QnNEcm9wZG93bkNvbnRhaW5lckNvbXBvbmVudD47XG4gICAgX3N1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdO1xuICAgIF9pc0luaXRlZDogYm9vbGVhbjtcbiAgICBfaXNEcm9wdXBEZWZhdWx0OiBib29sZWFuO1xuICAgIGNvbnN0cnVjdG9yKF9lbGVtZW50UmVmOiBFbGVtZW50UmVmLCBfcmVuZGVyZXI6IFJlbmRlcmVyMiwgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsIF9jaXM6IENvbXBvbmVudExvYWRlckZhY3RvcnksIF9jb25maWc6IEJzRHJvcGRvd25Db25maWcsIF9zdGF0ZTogQnNEcm9wZG93blN0YXRlLCBjZFJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpO1xuICAgIG5nT25Jbml0KCk6IHZvaWQ7XG4gICAgLyoqXG4gICAgICogT3BlbnMgYW4gZWxlbWVudOKAmXMgcG9wb3Zlci4gVGhpcyBpcyBjb25zaWRlcmVkIGEg4oCcbWFudWFs4oCdIHRyaWdnZXJpbmcgb2ZcbiAgICAgKiB0aGUgcG9wb3Zlci5cbiAgICAgKi9cbiAgICBzaG93KCk6IHZvaWQ7XG4gICAgLyoqXG4gICAgICogQ2xvc2VzIGFuIGVsZW1lbnTigJlzIHBvcG92ZXIuIFRoaXMgaXMgY29uc2lkZXJlZCBhIOKAnG1hbnVhbOKAnSB0cmlnZ2VyaW5nIG9mXG4gICAgICogdGhlIHBvcG92ZXIuXG4gICAgICovXG4gICAgaGlkZSgpOiB2b2lkO1xuICAgIC8qKlxuICAgICAqIFRvZ2dsZXMgYW4gZWxlbWVudOKAmXMgcG9wb3Zlci4gVGhpcyBpcyBjb25zaWRlcmVkIGEg4oCcbWFudWFs4oCdIHRyaWdnZXJpbmcgb2ZcbiAgICAgKiB0aGUgcG9wb3Zlci5cbiAgICAgKi9cbiAgICB0b2dnbGUodmFsdWU/OiBib29sZWFuKTogdm9pZDtcbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkO1xufVxuIl19