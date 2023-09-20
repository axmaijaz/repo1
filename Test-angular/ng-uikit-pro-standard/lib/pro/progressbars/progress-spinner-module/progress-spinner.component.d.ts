import { OnDestroy, ElementRef, NgZone, Renderer2 } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare type ProgressSpinnerMode = 'determinate' | 'indeterminate';
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export declare class MdProgressSpinnerCssMatStylerDirective {
    true: any;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MdProgressSpinnerCssMatStylerDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<MdProgressSpinnerCssMatStylerDirective, "[mdbSpinners], mat-progress-spinner", never, {}, {}, never>;
}
/**
 * <md-progress-spinner> component.
 */
export declare class MdProgressSpinnerComponent implements OnDestroy {
    private _ngZone;
    private _elementRef;
    private _renderer;
    /** The id of the last requested animation. */
    private _lastAnimationId;
    /** The id of the indeterminate interval. */
    private _interdeterminateInterval;
    /** The SVG <path> node that is used to draw the circle. */
    private _path;
    private _mode;
    private _value;
    private _color;
    isBrowser: any;
    platformId: string;
    /**
     * Values for aria max and min are only defined as numbers when in a determinate mode.  We do this
     * because voiceover does not report the progress indicator as indeterminate if the aria min
     * and/or max value are number values.
     */
    readonly _ariaValueMin: 0 | null;
    readonly _ariaValueMax: 100 | null;
    /** @docs-private */
    /** @docs-private */
    interdeterminateInterval: any;
    /**
     * Clean up any animations that were running.
     */
    ngOnDestroy(): void;
    /** The color of the progress-spinner. Can be primary, accent, or warn. */
    color: string;
    /** Value of the progress circle. It is bound to the host as the attribute aria-valuenow. */
    value: any;
    /**
     * Mode of the progress circle
     *
     * Input must be one of the values from ProgressMode, defaults to 'determinate'.
     * mode is bound to the host as the attribute host.
     */
    mode: ProgressSpinnerMode;
    constructor(_ngZone: NgZone, _elementRef: ElementRef, _renderer: Renderer2, platformId?: string | any);
    /**
     * Animates the circle from one percentage value to another.
     *
     * @param animateFrom The percentage of the circle filled starting the animation.
     * @param animateTo The percentage of the circle filled ending the animation.
     * @param ease The easing function to manage the pace of change in the animation.
     * @param duration The length of time to show the animation, in milliseconds.
     * @param rotation The starting angle of the circle fill, with 0° represented at the top center
     *    of the circle.
     */
    private _animateCircle;
    /**
     * Starts the indeterminate animation interval, if it is not already running.
     */
    private _startIndeterminateAnimation;
    /**
     * Removes interval, ending the animation.
     */
    private _cleanupIndeterminateAnimation;
    /**
     * Renders the arc onto the SVG element. Proxies `getArc` while setting the proper
     * DOM attribute on the `<path>`.
     */
    private _renderArc;
    /**
     * Updates the color of the progress-spinner by adding the new palette class to the element
     * and removing the old one.
     */
    private _updateColor;
    /** Sets the given palette class on the component element. */
    private _setElementColor;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MdProgressSpinnerComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<MdProgressSpinnerComponent, "mdb-Spinners, mat-progress-spinner", never, { "color": "color"; "value": "value"; "mode": "mode"; }, {}, never, never>;
}
/**
 * <md-spinner> component.
 *
 * This is a component definition to be used as a convenience reference to create an
 * indeterminate <md-progress-spinner> instance.
 */
export declare class MdSpinnerComponent extends MdProgressSpinnerComponent implements OnDestroy {
    true: any;
    constructor(elementRef: ElementRef, ngZone: NgZone, renderer: Renderer2);
    ngOnDestroy(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MdSpinnerComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<MdSpinnerComponent, "mdb-spinners, mat-spinner, mdb-progress-spinner", never, {}, {}, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3Mtc3Bpbm5lci5jb21wb25lbnQuZC50cyIsInNvdXJjZXMiOlsicHJvZ3Jlc3Mtc3Bpbm5lci5jb21wb25lbnQuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFDQTs7Ozs7Ozs7O0FBT0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTRFQTs7Ozs7Ozs7Ozs7OztBQVdBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT25EZXN0cm95LCBFbGVtZW50UmVmLCBOZ1pvbmUsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuZXhwb3J0IGRlY2xhcmUgdHlwZSBQcm9ncmVzc1NwaW5uZXJNb2RlID0gJ2RldGVybWluYXRlJyB8ICdpbmRldGVybWluYXRlJztcbi8qKlxuICogRGlyZWN0aXZlIHdob3NlIHB1cnBvc2UgaXMgdG8gYWRkIHRoZSBtYXQtIENTUyBzdHlsaW5nIHRvIHRoaXMgc2VsZWN0b3IuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBkZWNsYXJlIGNsYXNzIE1kUHJvZ3Jlc3NTcGlubmVyQ3NzTWF0U3R5bGVyRGlyZWN0aXZlIHtcbiAgICB0cnVlOiBhbnk7XG59XG4vKipcbiAqIDxtZC1wcm9ncmVzcy1zcGlubmVyPiBjb21wb25lbnQuXG4gKi9cbmV4cG9ydCBkZWNsYXJlIGNsYXNzIE1kUHJvZ3Jlc3NTcGlubmVyQ29tcG9uZW50IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgICBwcml2YXRlIF9uZ1pvbmU7XG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjtcbiAgICBwcml2YXRlIF9yZW5kZXJlcjtcbiAgICAvKiogVGhlIGlkIG9mIHRoZSBsYXN0IHJlcXVlc3RlZCBhbmltYXRpb24uICovXG4gICAgcHJpdmF0ZSBfbGFzdEFuaW1hdGlvbklkO1xuICAgIC8qKiBUaGUgaWQgb2YgdGhlIGluZGV0ZXJtaW5hdGUgaW50ZXJ2YWwuICovXG4gICAgcHJpdmF0ZSBfaW50ZXJkZXRlcm1pbmF0ZUludGVydmFsO1xuICAgIC8qKiBUaGUgU1ZHIDxwYXRoPiBub2RlIHRoYXQgaXMgdXNlZCB0byBkcmF3IHRoZSBjaXJjbGUuICovXG4gICAgcHJpdmF0ZSBfcGF0aDtcbiAgICBwcml2YXRlIF9tb2RlO1xuICAgIHByaXZhdGUgX3ZhbHVlO1xuICAgIHByaXZhdGUgX2NvbG9yO1xuICAgIGlzQnJvd3NlcjogYW55O1xuICAgIHBsYXRmb3JtSWQ6IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBWYWx1ZXMgZm9yIGFyaWEgbWF4IGFuZCBtaW4gYXJlIG9ubHkgZGVmaW5lZCBhcyBudW1iZXJzIHdoZW4gaW4gYSBkZXRlcm1pbmF0ZSBtb2RlLiAgV2UgZG8gdGhpc1xuICAgICAqIGJlY2F1c2Ugdm9pY2VvdmVyIGRvZXMgbm90IHJlcG9ydCB0aGUgcHJvZ3Jlc3MgaW5kaWNhdG9yIGFzIGluZGV0ZXJtaW5hdGUgaWYgdGhlIGFyaWEgbWluXG4gICAgICogYW5kL29yIG1heCB2YWx1ZSBhcmUgbnVtYmVyIHZhbHVlcy5cbiAgICAgKi9cbiAgICByZWFkb25seSBfYXJpYVZhbHVlTWluOiAwIHwgbnVsbDtcbiAgICByZWFkb25seSBfYXJpYVZhbHVlTWF4OiAxMDAgfCBudWxsO1xuICAgIC8qKiBAZG9jcy1wcml2YXRlICovXG4gICAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgICBpbnRlcmRldGVybWluYXRlSW50ZXJ2YWw6IGFueTtcbiAgICAvKipcbiAgICAgKiBDbGVhbiB1cCBhbnkgYW5pbWF0aW9ucyB0aGF0IHdlcmUgcnVubmluZy5cbiAgICAgKi9cbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkO1xuICAgIC8qKiBUaGUgY29sb3Igb2YgdGhlIHByb2dyZXNzLXNwaW5uZXIuIENhbiBiZSBwcmltYXJ5LCBhY2NlbnQsIG9yIHdhcm4uICovXG4gICAgY29sb3I6IHN0cmluZztcbiAgICAvKiogVmFsdWUgb2YgdGhlIHByb2dyZXNzIGNpcmNsZS4gSXQgaXMgYm91bmQgdG8gdGhlIGhvc3QgYXMgdGhlIGF0dHJpYnV0ZSBhcmlhLXZhbHVlbm93LiAqL1xuICAgIHZhbHVlOiBhbnk7XG4gICAgLyoqXG4gICAgICogTW9kZSBvZiB0aGUgcHJvZ3Jlc3MgY2lyY2xlXG4gICAgICpcbiAgICAgKiBJbnB1dCBtdXN0IGJlIG9uZSBvZiB0aGUgdmFsdWVzIGZyb20gUHJvZ3Jlc3NNb2RlLCBkZWZhdWx0cyB0byAnZGV0ZXJtaW5hdGUnLlxuICAgICAqIG1vZGUgaXMgYm91bmQgdG8gdGhlIGhvc3QgYXMgdGhlIGF0dHJpYnV0ZSBob3N0LlxuICAgICAqL1xuICAgIG1vZGU6IFByb2dyZXNzU3Bpbm5lck1vZGU7XG4gICAgY29uc3RydWN0b3IoX25nWm9uZTogTmdab25lLCBfZWxlbWVudFJlZjogRWxlbWVudFJlZiwgX3JlbmRlcmVyOiBSZW5kZXJlcjIsIHBsYXRmb3JtSWQ/OiBzdHJpbmcgfCBhbnkpO1xuICAgIC8qKlxuICAgICAqIEFuaW1hdGVzIHRoZSBjaXJjbGUgZnJvbSBvbmUgcGVyY2VudGFnZSB2YWx1ZSB0byBhbm90aGVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFuaW1hdGVGcm9tIFRoZSBwZXJjZW50YWdlIG9mIHRoZSBjaXJjbGUgZmlsbGVkIHN0YXJ0aW5nIHRoZSBhbmltYXRpb24uXG4gICAgICogQHBhcmFtIGFuaW1hdGVUbyBUaGUgcGVyY2VudGFnZSBvZiB0aGUgY2lyY2xlIGZpbGxlZCBlbmRpbmcgdGhlIGFuaW1hdGlvbi5cbiAgICAgKiBAcGFyYW0gZWFzZSBUaGUgZWFzaW5nIGZ1bmN0aW9uIHRvIG1hbmFnZSB0aGUgcGFjZSBvZiBjaGFuZ2UgaW4gdGhlIGFuaW1hdGlvbi5cbiAgICAgKiBAcGFyYW0gZHVyYXRpb24gVGhlIGxlbmd0aCBvZiB0aW1lIHRvIHNob3cgdGhlIGFuaW1hdGlvbiwgaW4gbWlsbGlzZWNvbmRzLlxuICAgICAqIEBwYXJhbSByb3RhdGlvbiBUaGUgc3RhcnRpbmcgYW5nbGUgb2YgdGhlIGNpcmNsZSBmaWxsLCB3aXRoIDDCsCByZXByZXNlbnRlZCBhdCB0aGUgdG9wIGNlbnRlclxuICAgICAqICAgIG9mIHRoZSBjaXJjbGUuXG4gICAgICovXG4gICAgcHJpdmF0ZSBfYW5pbWF0ZUNpcmNsZTtcbiAgICAvKipcbiAgICAgKiBTdGFydHMgdGhlIGluZGV0ZXJtaW5hdGUgYW5pbWF0aW9uIGludGVydmFsLCBpZiBpdCBpcyBub3QgYWxyZWFkeSBydW5uaW5nLlxuICAgICAqL1xuICAgIHByaXZhdGUgX3N0YXJ0SW5kZXRlcm1pbmF0ZUFuaW1hdGlvbjtcbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGludGVydmFsLCBlbmRpbmcgdGhlIGFuaW1hdGlvbi5cbiAgICAgKi9cbiAgICBwcml2YXRlIF9jbGVhbnVwSW5kZXRlcm1pbmF0ZUFuaW1hdGlvbjtcbiAgICAvKipcbiAgICAgKiBSZW5kZXJzIHRoZSBhcmMgb250byB0aGUgU1ZHIGVsZW1lbnQuIFByb3hpZXMgYGdldEFyY2Agd2hpbGUgc2V0dGluZyB0aGUgcHJvcGVyXG4gICAgICogRE9NIGF0dHJpYnV0ZSBvbiB0aGUgYDxwYXRoPmAuXG4gICAgICovXG4gICAgcHJpdmF0ZSBfcmVuZGVyQXJjO1xuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhlIGNvbG9yIG9mIHRoZSBwcm9ncmVzcy1zcGlubmVyIGJ5IGFkZGluZyB0aGUgbmV3IHBhbGV0dGUgY2xhc3MgdG8gdGhlIGVsZW1lbnRcbiAgICAgKiBhbmQgcmVtb3ZpbmcgdGhlIG9sZCBvbmUuXG4gICAgICovXG4gICAgcHJpdmF0ZSBfdXBkYXRlQ29sb3I7XG4gICAgLyoqIFNldHMgdGhlIGdpdmVuIHBhbGV0dGUgY2xhc3Mgb24gdGhlIGNvbXBvbmVudCBlbGVtZW50LiAqL1xuICAgIHByaXZhdGUgX3NldEVsZW1lbnRDb2xvcjtcbn1cbi8qKlxuICogPG1kLXNwaW5uZXI+IGNvbXBvbmVudC5cbiAqXG4gKiBUaGlzIGlzIGEgY29tcG9uZW50IGRlZmluaXRpb24gdG8gYmUgdXNlZCBhcyBhIGNvbnZlbmllbmNlIHJlZmVyZW5jZSB0byBjcmVhdGUgYW5cbiAqIGluZGV0ZXJtaW5hdGUgPG1kLXByb2dyZXNzLXNwaW5uZXI+IGluc3RhbmNlLlxuICovXG5leHBvcnQgZGVjbGFyZSBjbGFzcyBNZFNwaW5uZXJDb21wb25lbnQgZXh0ZW5kcyBNZFByb2dyZXNzU3Bpbm5lckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gICAgdHJ1ZTogYW55O1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsIG5nWm9uZTogTmdab25lLCByZW5kZXJlcjogUmVuZGVyZXIyKTtcbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkO1xufVxuIl19