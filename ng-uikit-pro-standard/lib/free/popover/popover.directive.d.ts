import { EventEmitter, OnInit, OnDestroy, Renderer2, ElementRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { PopoverConfig } from './popover.config';
import { ComponentLoaderFactory } from '../utils/component-loader/component-loader.factory';
import { PositioningService } from '../utils/positioning/positioning.service';
/**
 * A lightweight, extensible directive for fancy popover creation.
 */
import * as ɵngcc0 from '@angular/core';
export declare class PopoverDirective implements OnInit, OnDestroy {
    private _positionService;
    containerClass: string;
    bodyClass: string;
    headerClass: string;
    /**
     * Content to be displayed as popover.
     */
    mdbPopover: string | TemplateRef<any>;
    /**
     * Title of a popover.
     */
    mdbPopoverHeader: string;
    popoverTitle: string;
    /**
     * Placement of a popover. Accepts: "top", "bottom", "left", "right"
     */
    placement: 'top' | 'bottom' | 'left' | 'right';
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
    /**
     * Returns whether or not the popover is currently being shown
     */
    isOpen: boolean;
    dynamicPosition: boolean;
    outsideClick: boolean;
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
    private _popover;
    constructor(_elementRef: ElementRef, _renderer: Renderer2, _viewContainerRef: ViewContainerRef, _config: PopoverConfig, cis: ComponentLoaderFactory, _positionService: PositioningService);
    /**
     * Opens an element’s popover. This is considered a “manual” triggering of
     * the popover.
     */
    show(): void | any;
    /**
     * Closes an element’s popover. This is considered a “manual” triggering of
     * the popover.
     */
    hide(): void;
    /**
     * Toggles an element’s popover. This is considered a “manual” triggering of
     * the popover.
     */
    toggle(): void;
    onclick(event: any): void;
    onblur(): void;
    onTouchStart(event: any): void;
    ngOnInit(): any;
    dispose(): void;
    ngOnDestroy(): any;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<PopoverDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<PopoverDirective, "[mdbPopover]", ["bs-mdbPopover"], { "dynamicPosition": "dynamicPosition"; "outsideClick": "outsideClick"; "isOpen": "isOpen"; "containerClass": "containerClass"; "bodyClass": "bodyClass"; "headerClass": "headerClass"; "mdbPopover": "mdbPopover"; "mdbPopoverHeader": "mdbPopoverHeader"; "popoverTitle": "popoverTitle"; "placement": "placement"; "triggers": "triggers"; "container": "container"; }, { "onShown": "onShown"; "shown": "shown"; "onHidden": "onHidden"; "hidden": "hidden"; }, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci5kaXJlY3RpdmUuZC50cyIsInNvdXJjZXMiOlsicG9wb3Zlci5kaXJlY3RpdmUuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUFPQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUVBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyLCBPbkluaXQsIE9uRGVzdHJveSwgUmVuZGVyZXIyLCBFbGVtZW50UmVmLCBUZW1wbGF0ZVJlZiwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUG9wb3ZlckNvbmZpZyB9IGZyb20gJy4vcG9wb3Zlci5jb25maWcnO1xuaW1wb3J0IHsgQ29tcG9uZW50TG9hZGVyRmFjdG9yeSB9IGZyb20gJy4uL3V0aWxzL2NvbXBvbmVudC1sb2FkZXIvY29tcG9uZW50LWxvYWRlci5mYWN0b3J5JztcbmltcG9ydCB7IFBvc2l0aW9uaW5nU2VydmljZSB9IGZyb20gJy4uL3V0aWxzL3Bvc2l0aW9uaW5nL3Bvc2l0aW9uaW5nLnNlcnZpY2UnO1xuLyoqXG4gKiBBIGxpZ2h0d2VpZ2h0LCBleHRlbnNpYmxlIGRpcmVjdGl2ZSBmb3IgZmFuY3kgcG9wb3ZlciBjcmVhdGlvbi5cbiAqL1xuZXhwb3J0IGRlY2xhcmUgY2xhc3MgUG9wb3ZlckRpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgICBwcml2YXRlIF9wb3NpdGlvblNlcnZpY2U7XG4gICAgY29udGFpbmVyQ2xhc3M6IHN0cmluZztcbiAgICBib2R5Q2xhc3M6IHN0cmluZztcbiAgICBoZWFkZXJDbGFzczogc3RyaW5nO1xuICAgIC8qKlxuICAgICAqIENvbnRlbnQgdG8gYmUgZGlzcGxheWVkIGFzIHBvcG92ZXIuXG4gICAgICovXG4gICAgbWRiUG9wb3Zlcjogc3RyaW5nIHwgVGVtcGxhdGVSZWY8YW55PjtcbiAgICAvKipcbiAgICAgKiBUaXRsZSBvZiBhIHBvcG92ZXIuXG4gICAgICovXG4gICAgbWRiUG9wb3ZlckhlYWRlcjogc3RyaW5nO1xuICAgIHBvcG92ZXJUaXRsZTogc3RyaW5nO1xuICAgIC8qKlxuICAgICAqIFBsYWNlbWVudCBvZiBhIHBvcG92ZXIuIEFjY2VwdHM6IFwidG9wXCIsIFwiYm90dG9tXCIsIFwibGVmdFwiLCBcInJpZ2h0XCJcbiAgICAgKi9cbiAgICBwbGFjZW1lbnQ6ICd0b3AnIHwgJ2JvdHRvbScgfCAnbGVmdCcgfCAncmlnaHQnO1xuICAgIC8qKlxuICAgICAqIFNwZWNpZmllcyBldmVudHMgdGhhdCBzaG91bGQgdHJpZ2dlci4gU3VwcG9ydHMgYSBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZlxuICAgICAqIGV2ZW50IG5hbWVzLlxuICAgICAqL1xuICAgIHRyaWdnZXJzOiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogQSBzZWxlY3RvciBzcGVjaWZ5aW5nIHRoZSBlbGVtZW50IHRoZSBwb3BvdmVyIHNob3VsZCBiZSBhcHBlbmRlZCB0by5cbiAgICAgKiBDdXJyZW50bHkgb25seSBzdXBwb3J0cyBcImJvZHlcIi5cbiAgICAgKi9cbiAgICBjb250YWluZXI6IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBwb3BvdmVyIGlzIGN1cnJlbnRseSBiZWluZyBzaG93blxuICAgICAqL1xuICAgIGlzT3BlbjogYm9vbGVhbjtcbiAgICBkeW5hbWljUG9zaXRpb246IGJvb2xlYW47XG4gICAgb3V0c2lkZUNsaWNrOiBib29sZWFuO1xuICAgIC8qKlxuICAgICAqIEVtaXRzIGFuIGV2ZW50IHdoZW4gdGhlIHBvcG92ZXIgaXMgc2hvd25cbiAgICAgKi9cbiAgICBvblNob3duOiBFdmVudEVtaXR0ZXI8YW55PjtcbiAgICBzaG93bjogRXZlbnRFbWl0dGVyPGFueT47XG4gICAgLyoqXG4gICAgICogRW1pdHMgYW4gZXZlbnQgd2hlbiB0aGUgcG9wb3ZlciBpcyBoaWRkZW5cbiAgICAgKi9cbiAgICBvbkhpZGRlbjogRXZlbnRFbWl0dGVyPGFueT47XG4gICAgaGlkZGVuOiBFdmVudEVtaXR0ZXI8YW55PjtcbiAgICBwcml2YXRlIF9wb3BvdmVyO1xuICAgIGNvbnN0cnVjdG9yKF9lbGVtZW50UmVmOiBFbGVtZW50UmVmLCBfcmVuZGVyZXI6IFJlbmRlcmVyMiwgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsIF9jb25maWc6IFBvcG92ZXJDb25maWcsIGNpczogQ29tcG9uZW50TG9hZGVyRmFjdG9yeSwgX3Bvc2l0aW9uU2VydmljZTogUG9zaXRpb25pbmdTZXJ2aWNlKTtcbiAgICAvKipcbiAgICAgKiBPcGVucyBhbiBlbGVtZW504oCZcyBwb3BvdmVyLiBUaGlzIGlzIGNvbnNpZGVyZWQgYSDigJxtYW51YWzigJ0gdHJpZ2dlcmluZyBvZlxuICAgICAqIHRoZSBwb3BvdmVyLlxuICAgICAqL1xuICAgIHNob3coKTogdm9pZCB8IGFueTtcbiAgICAvKipcbiAgICAgKiBDbG9zZXMgYW4gZWxlbWVudOKAmXMgcG9wb3Zlci4gVGhpcyBpcyBjb25zaWRlcmVkIGEg4oCcbWFudWFs4oCdIHRyaWdnZXJpbmcgb2ZcbiAgICAgKiB0aGUgcG9wb3Zlci5cbiAgICAgKi9cbiAgICBoaWRlKCk6IHZvaWQ7XG4gICAgLyoqXG4gICAgICogVG9nZ2xlcyBhbiBlbGVtZW504oCZcyBwb3BvdmVyLiBUaGlzIGlzIGNvbnNpZGVyZWQgYSDigJxtYW51YWzigJ0gdHJpZ2dlcmluZyBvZlxuICAgICAqIHRoZSBwb3BvdmVyLlxuICAgICAqL1xuICAgIHRvZ2dsZSgpOiB2b2lkO1xuICAgIG9uY2xpY2soZXZlbnQ6IGFueSk6IHZvaWQ7XG4gICAgb25ibHVyKCk6IHZvaWQ7XG4gICAgb25Ub3VjaFN0YXJ0KGV2ZW50OiBhbnkpOiB2b2lkO1xuICAgIG5nT25Jbml0KCk6IGFueTtcbiAgICBkaXNwb3NlKCk6IHZvaWQ7XG4gICAgbmdPbkRlc3Ryb3koKTogYW55O1xufVxuIl19