import { ElementRef, EventEmitter, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { TooltipConfig } from './tooltip.service';
import { ComponentLoaderFactory } from '../utils/component-loader/component-loader.factory';
import { PositioningService } from '../utils/positioning/positioning.service';
import * as ɵngcc0 from '@angular/core';
export declare class TooltipDirective implements OnInit, OnDestroy, OnChanges {
    private _elementRef;
    private _positionService;
    private platformId;
    /**
     * Content to be displayed as tooltip.
     */
    mdbTooltip: string | TemplateRef<any>;
    /** Fired when tooltip content changes */
    tooltipChange: EventEmitter<string | TemplateRef<any>>;
    /**
     * Placement of a tooltip. Accepts: "top", "bottom", "left", "right"
     */
    placement: string;
    /**
     * Specifies events that should trigger. Supports a space separated list of
     * event names.
     */
    triggers: string;
    /**
     * A selector specifying the element the tooltip should be appended to.
     * Currently only supports "body".
     */
    container: string;
    /**
     * Returns whether or not the tooltip is currently being shown
     */
    isOpen: boolean;
    /**
     * Allows to disable tooltip
     */
    isDisabled: boolean;
    dynamicPosition: boolean;
    /**
     * Emits an event when the tooltip is shown
     */
    onShown: EventEmitter<any>;
    shown: EventEmitter<any>;
    /**
     * Emits an event when the tooltip is hidden
     */
    onHidden: EventEmitter<any>;
    hidden: EventEmitter<any>;
    delay: number;
    customHeight: string;
    fadeDuration: number;
    private _destroy$;
    protected _delayTimeoutId: any;
    private _tooltip;
    isBrowser: any;
    constructor(_renderer: Renderer2, _elementRef: ElementRef, _positionService: PositioningService, _viewContainerRef: ViewContainerRef, cis: ComponentLoaderFactory, config: TooltipConfig, platformId: string);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * Toggles an element’s tooltip. This is considered a “manual” triggering of
     * the tooltip.
     */
    toggle(): void;
    /**
     * Opens an element’s tooltip. This is considered a “manual” triggering of
     * the tooltip.
     */
    show(): void;
    private showTooltip;
    /**
     * Closes an element’s tooltip. This is considered a “manual” triggering of
     * the tooltip.
     */
    hide(): void;
    dispose(): void;
    ngOnDestroy(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<TooltipDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<TooltipDirective, "[mdbTooltip]", ["mdb-tooltip"], { "dynamicPosition": "dynamicPosition"; "delay": "delay"; "fadeDuration": "fadeDuration"; "isOpen": "isOpen"; "mdbTooltip": "mdbTooltip"; "placement": "placement"; "triggers": "triggers"; "container": "container"; "isDisabled": "isDisabled"; "customHeight": "customHeight"; }, { "tooltipChange": "tooltipChange"; "onShown": "onShown"; "shown": "shown"; "onHidden": "onHidden"; "hidden": "hidden"; }, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5kaXJlY3RpdmUuZC50cyIsInNvdXJjZXMiOlsidG9vbHRpcC5kaXJlY3RpdmUuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7QUFJQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVFQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9uSW5pdCwgUmVuZGVyZXIyLCBTaW1wbGVDaGFuZ2VzLCBUZW1wbGF0ZVJlZiwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVG9vbHRpcENvbmZpZyB9IGZyb20gJy4vdG9vbHRpcC5zZXJ2aWNlJztcbmltcG9ydCB7IENvbXBvbmVudExvYWRlckZhY3RvcnkgfSBmcm9tICcuLi91dGlscy9jb21wb25lbnQtbG9hZGVyL2NvbXBvbmVudC1sb2FkZXIuZmFjdG9yeSc7XG5pbXBvcnQgeyBQb3NpdGlvbmluZ1NlcnZpY2UgfSBmcm9tICcuLi91dGlscy9wb3NpdGlvbmluZy9wb3NpdGlvbmluZy5zZXJ2aWNlJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIFRvb2x0aXBEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmO1xuICAgIHByaXZhdGUgX3Bvc2l0aW9uU2VydmljZTtcbiAgICBwcml2YXRlIHBsYXRmb3JtSWQ7XG4gICAgLyoqXG4gICAgICogQ29udGVudCB0byBiZSBkaXNwbGF5ZWQgYXMgdG9vbHRpcC5cbiAgICAgKi9cbiAgICBtZGJUb29sdGlwOiBzdHJpbmcgfCBUZW1wbGF0ZVJlZjxhbnk+O1xuICAgIC8qKiBGaXJlZCB3aGVuIHRvb2x0aXAgY29udGVudCBjaGFuZ2VzICovXG4gICAgdG9vbHRpcENoYW5nZTogRXZlbnRFbWl0dGVyPHN0cmluZyB8IFRlbXBsYXRlUmVmPGFueT4+O1xuICAgIC8qKlxuICAgICAqIFBsYWNlbWVudCBvZiBhIHRvb2x0aXAuIEFjY2VwdHM6IFwidG9wXCIsIFwiYm90dG9tXCIsIFwibGVmdFwiLCBcInJpZ2h0XCJcbiAgICAgKi9cbiAgICBwbGFjZW1lbnQ6IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBTcGVjaWZpZXMgZXZlbnRzIHRoYXQgc2hvdWxkIHRyaWdnZXIuIFN1cHBvcnRzIGEgc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2ZcbiAgICAgKiBldmVudCBuYW1lcy5cbiAgICAgKi9cbiAgICB0cmlnZ2Vyczogc3RyaW5nO1xuICAgIC8qKlxuICAgICAqIEEgc2VsZWN0b3Igc3BlY2lmeWluZyB0aGUgZWxlbWVudCB0aGUgdG9vbHRpcCBzaG91bGQgYmUgYXBwZW5kZWQgdG8uXG4gICAgICogQ3VycmVudGx5IG9ubHkgc3VwcG9ydHMgXCJib2R5XCIuXG4gICAgICovXG4gICAgY29udGFpbmVyOiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgdG9vbHRpcCBpcyBjdXJyZW50bHkgYmVpbmcgc2hvd25cbiAgICAgKi9cbiAgICBpc09wZW46IGJvb2xlYW47XG4gICAgLyoqXG4gICAgICogQWxsb3dzIHRvIGRpc2FibGUgdG9vbHRpcFxuICAgICAqL1xuICAgIGlzRGlzYWJsZWQ6IGJvb2xlYW47XG4gICAgZHluYW1pY1Bvc2l0aW9uOiBib29sZWFuO1xuICAgIC8qKlxuICAgICAqIEVtaXRzIGFuIGV2ZW50IHdoZW4gdGhlIHRvb2x0aXAgaXMgc2hvd25cbiAgICAgKi9cbiAgICBvblNob3duOiBFdmVudEVtaXR0ZXI8YW55PjtcbiAgICBzaG93bjogRXZlbnRFbWl0dGVyPGFueT47XG4gICAgLyoqXG4gICAgICogRW1pdHMgYW4gZXZlbnQgd2hlbiB0aGUgdG9vbHRpcCBpcyBoaWRkZW5cbiAgICAgKi9cbiAgICBvbkhpZGRlbjogRXZlbnRFbWl0dGVyPGFueT47XG4gICAgaGlkZGVuOiBFdmVudEVtaXR0ZXI8YW55PjtcbiAgICBkZWxheTogbnVtYmVyO1xuICAgIGN1c3RvbUhlaWdodDogc3RyaW5nO1xuICAgIGZhZGVEdXJhdGlvbjogbnVtYmVyO1xuICAgIHByaXZhdGUgX2Rlc3Ryb3kkO1xuICAgIHByb3RlY3RlZCBfZGVsYXlUaW1lb3V0SWQ6IGFueTtcbiAgICBwcml2YXRlIF90b29sdGlwO1xuICAgIGlzQnJvd3NlcjogYW55O1xuICAgIGNvbnN0cnVjdG9yKF9yZW5kZXJlcjogUmVuZGVyZXIyLCBfZWxlbWVudFJlZjogRWxlbWVudFJlZiwgX3Bvc2l0aW9uU2VydmljZTogUG9zaXRpb25pbmdTZXJ2aWNlLCBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZiwgY2lzOiBDb21wb25lbnRMb2FkZXJGYWN0b3J5LCBjb25maWc6IFRvb2x0aXBDb25maWcsIHBsYXRmb3JtSWQ6IHN0cmluZyk7XG4gICAgbmdPbkluaXQoKTogdm9pZDtcbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZDtcbiAgICAvKipcbiAgICAgKiBUb2dnbGVzIGFuIGVsZW1lbnTigJlzIHRvb2x0aXAuIFRoaXMgaXMgY29uc2lkZXJlZCBhIOKAnG1hbnVhbOKAnSB0cmlnZ2VyaW5nIG9mXG4gICAgICogdGhlIHRvb2x0aXAuXG4gICAgICovXG4gICAgdG9nZ2xlKCk6IHZvaWQ7XG4gICAgLyoqXG4gICAgICogT3BlbnMgYW4gZWxlbWVudOKAmXMgdG9vbHRpcC4gVGhpcyBpcyBjb25zaWRlcmVkIGEg4oCcbWFudWFs4oCdIHRyaWdnZXJpbmcgb2ZcbiAgICAgKiB0aGUgdG9vbHRpcC5cbiAgICAgKi9cbiAgICBzaG93KCk6IHZvaWQ7XG4gICAgcHJpdmF0ZSBzaG93VG9vbHRpcDtcbiAgICAvKipcbiAgICAgKiBDbG9zZXMgYW4gZWxlbWVudOKAmXMgdG9vbHRpcC4gVGhpcyBpcyBjb25zaWRlcmVkIGEg4oCcbWFudWFs4oCdIHRyaWdnZXJpbmcgb2ZcbiAgICAgKiB0aGUgdG9vbHRpcC5cbiAgICAgKi9cbiAgICBoaWRlKCk6IHZvaWQ7XG4gICAgZGlzcG9zZSgpOiB2b2lkO1xuICAgIG5nT25EZXN0cm95KCk6IHZvaWQ7XG59XG4iXX0=