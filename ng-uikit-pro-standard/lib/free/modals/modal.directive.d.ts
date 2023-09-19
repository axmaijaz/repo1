import { AfterViewInit, ComponentRef, ElementRef, EventEmitter, OnDestroy, OnChanges, Renderer2, ViewContainerRef } from '@angular/core';
import { Utils } from '../utils/utils.class';
import { ModalBackdropComponent } from './modalBackdrop.component';
import { ModalOptions } from './modal.options';
import { ComponentLoaderFactory } from '../utils/component-loader/component-loader.factory';
/** Mark any code with directive to show it's content in modal */
import * as ɵngcc0 from '@angular/core';
export declare class ModalDirective implements AfterViewInit, OnDestroy, OnChanges {
    protected _element: ElementRef;
    protected _renderer: Renderer2;
    /** allows to set modal configuration via element property */
    config: ModalOptions | any;
    /** This event fires immediately when the `show` instance method is called. */
    onShow: EventEmitter<ModalDirective>;
    open: EventEmitter<ModalDirective>;
    /** This event is fired when the modal has been made visible to the user (will wait for CSS transitions to complete) */
    onShown: EventEmitter<ModalDirective>;
    opened: EventEmitter<ModalDirective>;
    /** This event is fired immediately when the hide instance method has been called. */
    onHide: EventEmitter<ModalDirective>;
    close: EventEmitter<ModalDirective>;
    /** This event is fired when the modal has finished being hidden from the user (will wait for CSS transitions to complete). */
    onHidden: EventEmitter<ModalDirective>;
    closed: EventEmitter<ModalDirective>;
    isAnimated: boolean;
    /** This field contains last dismiss reason.
     Possible values: `backdrop-click`, `esc` and `null` (if modal was closed by direct call of `.hide()`). */
    dismissReason: string | any;
    readonly isShown: boolean;
    protected _config: ModalOptions | any;
    protected _isShown: boolean;
    protected isBodyOverflowing: boolean;
    protected originalBodyPadding: number;
    protected scrollbarWidth: number;
    protected timerHideModal: any;
    protected timerRmBackDrop: any;
    protected backdrop: ComponentRef<ModalBackdropComponent> | undefined;
    private _backdrop;
    _dialog: any;
    isNested: boolean;
    utils: Utils;
    onKeyDown(event: any): void;
    onClick(event: any): void;
    onEsc(): void;
    constructor(_element: ElementRef, _viewContainerRef: ViewContainerRef, _renderer: Renderer2, clf: ComponentLoaderFactory);
    ngOnDestroy(): any;
    ngAfterViewInit(): any;
    ngOnChanges(): any;
    /** Allows to manually toggle modal visibility */
    toggle(): void;
    /** Allows to manually open modal */
    show(): void;
    /** Allows to manually close modal */
    hide(event?: Event): void;
    /** Private methods @internal */
    protected getConfig(config?: ModalOptions): ModalOptions;
    /**
     *  Show dialog
     *  @internal
     */
    protected showElement(): void;
    /** @internal */
    protected hideModal(): void;
    /** @internal */
    protected showBackdrop(callback?: Function): void;
    /** @internal */
    protected removeBackdrop(): void;
    protected focusOtherModal(): void;
    /** @internal */
    protected resetAdjustments(): void;
    /** Scroll bar tricks */
    /** @internal */
    protected checkScrollbar(): void;
    protected setScrollbar(): void;
    protected getScrollbarWidth(): number;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ModalDirective, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<ModalDirective, "[mdbModal]", ["mdb-modal", "mdbModal"], { "config": "config"; }, { "onShow": "onShow"; "open": "open"; "onShown": "onShown"; "opened": "opened"; "onHide": "onHide"; "close": "close"; "onHidden": "onHidden"; "closed": "closed"; }, never, ["*"]>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwuZGlyZWN0aXZlLmQudHMiLCJzb3VyY2VzIjpbIm1vZGFsLmRpcmVjdGl2ZS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FBTUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvRUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZnRlclZpZXdJbml0LCBDb21wb25lbnRSZWYsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgT25EZXN0cm95LCBPbkNoYW5nZXMsIFJlbmRlcmVyMiwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVXRpbHMgfSBmcm9tICcuLi91dGlscy91dGlscy5jbGFzcyc7XG5pbXBvcnQgeyBNb2RhbEJhY2tkcm9wQ29tcG9uZW50IH0gZnJvbSAnLi9tb2RhbEJhY2tkcm9wLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNb2RhbE9wdGlvbnMgfSBmcm9tICcuL21vZGFsLm9wdGlvbnMnO1xuaW1wb3J0IHsgQ29tcG9uZW50TG9hZGVyRmFjdG9yeSB9IGZyb20gJy4uL3V0aWxzL2NvbXBvbmVudC1sb2FkZXIvY29tcG9uZW50LWxvYWRlci5mYWN0b3J5Jztcbi8qKiBNYXJrIGFueSBjb2RlIHdpdGggZGlyZWN0aXZlIHRvIHNob3cgaXQncyBjb250ZW50IGluIG1vZGFsICovXG5leHBvcnQgZGVjbGFyZSBjbGFzcyBNb2RhbERpcmVjdGl2ZSBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcbiAgICBwcm90ZWN0ZWQgX2VsZW1lbnQ6IEVsZW1lbnRSZWY7XG4gICAgcHJvdGVjdGVkIF9yZW5kZXJlcjogUmVuZGVyZXIyO1xuICAgIC8qKiBhbGxvd3MgdG8gc2V0IG1vZGFsIGNvbmZpZ3VyYXRpb24gdmlhIGVsZW1lbnQgcHJvcGVydHkgKi9cbiAgICBjb25maWc6IE1vZGFsT3B0aW9ucyB8IGFueTtcbiAgICAvKiogVGhpcyBldmVudCBmaXJlcyBpbW1lZGlhdGVseSB3aGVuIHRoZSBgc2hvd2AgaW5zdGFuY2UgbWV0aG9kIGlzIGNhbGxlZC4gKi9cbiAgICBvblNob3c6IEV2ZW50RW1pdHRlcjxNb2RhbERpcmVjdGl2ZT47XG4gICAgb3BlbjogRXZlbnRFbWl0dGVyPE1vZGFsRGlyZWN0aXZlPjtcbiAgICAvKiogVGhpcyBldmVudCBpcyBmaXJlZCB3aGVuIHRoZSBtb2RhbCBoYXMgYmVlbiBtYWRlIHZpc2libGUgdG8gdGhlIHVzZXIgKHdpbGwgd2FpdCBmb3IgQ1NTIHRyYW5zaXRpb25zIHRvIGNvbXBsZXRlKSAqL1xuICAgIG9uU2hvd246IEV2ZW50RW1pdHRlcjxNb2RhbERpcmVjdGl2ZT47XG4gICAgb3BlbmVkOiBFdmVudEVtaXR0ZXI8TW9kYWxEaXJlY3RpdmU+O1xuICAgIC8qKiBUaGlzIGV2ZW50IGlzIGZpcmVkIGltbWVkaWF0ZWx5IHdoZW4gdGhlIGhpZGUgaW5zdGFuY2UgbWV0aG9kIGhhcyBiZWVuIGNhbGxlZC4gKi9cbiAgICBvbkhpZGU6IEV2ZW50RW1pdHRlcjxNb2RhbERpcmVjdGl2ZT47XG4gICAgY2xvc2U6IEV2ZW50RW1pdHRlcjxNb2RhbERpcmVjdGl2ZT47XG4gICAgLyoqIFRoaXMgZXZlbnQgaXMgZmlyZWQgd2hlbiB0aGUgbW9kYWwgaGFzIGZpbmlzaGVkIGJlaW5nIGhpZGRlbiBmcm9tIHRoZSB1c2VyICh3aWxsIHdhaXQgZm9yIENTUyB0cmFuc2l0aW9ucyB0byBjb21wbGV0ZSkuICovXG4gICAgb25IaWRkZW46IEV2ZW50RW1pdHRlcjxNb2RhbERpcmVjdGl2ZT47XG4gICAgY2xvc2VkOiBFdmVudEVtaXR0ZXI8TW9kYWxEaXJlY3RpdmU+O1xuICAgIGlzQW5pbWF0ZWQ6IGJvb2xlYW47XG4gICAgLyoqIFRoaXMgZmllbGQgY29udGFpbnMgbGFzdCBkaXNtaXNzIHJlYXNvbi5cbiAgICAgUG9zc2libGUgdmFsdWVzOiBgYmFja2Ryb3AtY2xpY2tgLCBgZXNjYCBhbmQgYG51bGxgIChpZiBtb2RhbCB3YXMgY2xvc2VkIGJ5IGRpcmVjdCBjYWxsIG9mIGAuaGlkZSgpYCkuICovXG4gICAgZGlzbWlzc1JlYXNvbjogc3RyaW5nIHwgYW55O1xuICAgIHJlYWRvbmx5IGlzU2hvd246IGJvb2xlYW47XG4gICAgcHJvdGVjdGVkIF9jb25maWc6IE1vZGFsT3B0aW9ucyB8IGFueTtcbiAgICBwcm90ZWN0ZWQgX2lzU2hvd246IGJvb2xlYW47XG4gICAgcHJvdGVjdGVkIGlzQm9keU92ZXJmbG93aW5nOiBib29sZWFuO1xuICAgIHByb3RlY3RlZCBvcmlnaW5hbEJvZHlQYWRkaW5nOiBudW1iZXI7XG4gICAgcHJvdGVjdGVkIHNjcm9sbGJhcldpZHRoOiBudW1iZXI7XG4gICAgcHJvdGVjdGVkIHRpbWVySGlkZU1vZGFsOiBhbnk7XG4gICAgcHJvdGVjdGVkIHRpbWVyUm1CYWNrRHJvcDogYW55O1xuICAgIHByb3RlY3RlZCBiYWNrZHJvcDogQ29tcG9uZW50UmVmPE1vZGFsQmFja2Ryb3BDb21wb25lbnQ+IHwgdW5kZWZpbmVkO1xuICAgIHByaXZhdGUgX2JhY2tkcm9wO1xuICAgIF9kaWFsb2c6IGFueTtcbiAgICBpc05lc3RlZDogYm9vbGVhbjtcbiAgICB1dGlsczogVXRpbHM7XG4gICAgb25LZXlEb3duKGV2ZW50OiBhbnkpOiB2b2lkO1xuICAgIG9uQ2xpY2soZXZlbnQ6IGFueSk6IHZvaWQ7XG4gICAgb25Fc2MoKTogdm9pZDtcbiAgICBjb25zdHJ1Y3RvcihfZWxlbWVudDogRWxlbWVudFJlZiwgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsIF9yZW5kZXJlcjogUmVuZGVyZXIyLCBjbGY6IENvbXBvbmVudExvYWRlckZhY3RvcnkpO1xuICAgIG5nT25EZXN0cm95KCk6IGFueTtcbiAgICBuZ0FmdGVyVmlld0luaXQoKTogYW55O1xuICAgIG5nT25DaGFuZ2VzKCk6IGFueTtcbiAgICAvKiogQWxsb3dzIHRvIG1hbnVhbGx5IHRvZ2dsZSBtb2RhbCB2aXNpYmlsaXR5ICovXG4gICAgdG9nZ2xlKCk6IHZvaWQ7XG4gICAgLyoqIEFsbG93cyB0byBtYW51YWxseSBvcGVuIG1vZGFsICovXG4gICAgc2hvdygpOiB2b2lkO1xuICAgIC8qKiBBbGxvd3MgdG8gbWFudWFsbHkgY2xvc2UgbW9kYWwgKi9cbiAgICBoaWRlKGV2ZW50PzogRXZlbnQpOiB2b2lkO1xuICAgIC8qKiBQcml2YXRlIG1ldGhvZHMgQGludGVybmFsICovXG4gICAgcHJvdGVjdGVkIGdldENvbmZpZyhjb25maWc/OiBNb2RhbE9wdGlvbnMpOiBNb2RhbE9wdGlvbnM7XG4gICAgLyoqXG4gICAgICogIFNob3cgZGlhbG9nXG4gICAgICogIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBzaG93RWxlbWVudCgpOiB2b2lkO1xuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBwcm90ZWN0ZWQgaGlkZU1vZGFsKCk6IHZvaWQ7XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIHByb3RlY3RlZCBzaG93QmFja2Ryb3AoY2FsbGJhY2s/OiBGdW5jdGlvbik6IHZvaWQ7XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIHByb3RlY3RlZCByZW1vdmVCYWNrZHJvcCgpOiB2b2lkO1xuICAgIHByb3RlY3RlZCBmb2N1c090aGVyTW9kYWwoKTogdm9pZDtcbiAgICAvKiogQGludGVybmFsICovXG4gICAgcHJvdGVjdGVkIHJlc2V0QWRqdXN0bWVudHMoKTogdm9pZDtcbiAgICAvKiogU2Nyb2xsIGJhciB0cmlja3MgKi9cbiAgICAvKiogQGludGVybmFsICovXG4gICAgcHJvdGVjdGVkIGNoZWNrU2Nyb2xsYmFyKCk6IHZvaWQ7XG4gICAgcHJvdGVjdGVkIHNldFNjcm9sbGJhcigpOiB2b2lkO1xuICAgIHByb3RlY3RlZCBnZXRTY3JvbGxiYXJXaWR0aCgpOiBudW1iZXI7XG59XG4iXX0=