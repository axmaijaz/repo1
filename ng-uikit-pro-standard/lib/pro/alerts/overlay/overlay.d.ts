import { ComponentFactoryResolver, ApplicationRef } from '@angular/core';
import { OverlayRef } from './overlay-ref';
import { OverlayContainer } from './overlay-container';
import { ToastContainerDirective } from '../toast/toast.directive';
/**
 * Service to create Overlays. Overlays are dynamically added pieces of floating UI, meant to be
 * used as a low-level building building block for other components. Dialogs, tooltips, menus,
 * selects, etc. can all be built using overlays. The service should primarily be used by authors
 * of re-usable components rather than developers building end-user applications.
 *
 * An overlay *is* a PortalHost, so any kind of Portal can be loaded into one.
 */
import * as ɵngcc0 from '@angular/core';
export declare class Overlay {
    private _overlayContainer;
    private _componentFactoryResolver;
    private _appRef;
    private _paneElements;
    constructor(_overlayContainer: OverlayContainer, _componentFactoryResolver: ComponentFactoryResolver, _appRef: ApplicationRef);
    /**
     * Creates an overlay.
     * @returns A reference to the created overlay.
     */
    create(positionClass: string, overlayContainer?: ToastContainerDirective): OverlayRef;
    getPaneElement(positionClass: string, overlayContainer?: ToastContainerDirective): HTMLElement;
    /**
     * Creates the DOM element for an overlay and appends it to the overlay container.
     * @returns Newly-created pane element
     */
    private _createPaneElement;
    /**
     * Create a DomPortalHost into which the overlay content can be loaded.
     * @param pane The DOM element to turn into a portal host.
     * @returns A portal host for the given DOM element.
     */
    private _createPortalHost;
    /**
     * Creates an OverlayRef for an overlay in the given DOM element.
     * @param pane DOM element for the overlay
     */
    private _createOverlayRef;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<Overlay, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<Overlay>;
}
/** Providers for Overlay and its related injectables. */
export declare const OVERLAY_PROVIDERS: (typeof OverlayContainer | typeof Overlay)[];

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3ZlcmxheS5kLnRzIiwic291cmNlcyI6WyJvdmVybGF5LmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7QUFZQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEJBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBBcHBsaWNhdGlvblJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT3ZlcmxheVJlZiB9IGZyb20gJy4vb3ZlcmxheS1yZWYnO1xuaW1wb3J0IHsgT3ZlcmxheUNvbnRhaW5lciB9IGZyb20gJy4vb3ZlcmxheS1jb250YWluZXInO1xuaW1wb3J0IHsgVG9hc3RDb250YWluZXJEaXJlY3RpdmUgfSBmcm9tICcuLi90b2FzdC90b2FzdC5kaXJlY3RpdmUnO1xuLyoqXG4gKiBTZXJ2aWNlIHRvIGNyZWF0ZSBPdmVybGF5cy4gT3ZlcmxheXMgYXJlIGR5bmFtaWNhbGx5IGFkZGVkIHBpZWNlcyBvZiBmbG9hdGluZyBVSSwgbWVhbnQgdG8gYmVcbiAqIHVzZWQgYXMgYSBsb3ctbGV2ZWwgYnVpbGRpbmcgYnVpbGRpbmcgYmxvY2sgZm9yIG90aGVyIGNvbXBvbmVudHMuIERpYWxvZ3MsIHRvb2x0aXBzLCBtZW51cyxcbiAqIHNlbGVjdHMsIGV0Yy4gY2FuIGFsbCBiZSBidWlsdCB1c2luZyBvdmVybGF5cy4gVGhlIHNlcnZpY2Ugc2hvdWxkIHByaW1hcmlseSBiZSB1c2VkIGJ5IGF1dGhvcnNcbiAqIG9mIHJlLXVzYWJsZSBjb21wb25lbnRzIHJhdGhlciB0aGFuIGRldmVsb3BlcnMgYnVpbGRpbmcgZW5kLXVzZXIgYXBwbGljYXRpb25zLlxuICpcbiAqIEFuIG92ZXJsYXkgKmlzKiBhIFBvcnRhbEhvc3QsIHNvIGFueSBraW5kIG9mIFBvcnRhbCBjYW4gYmUgbG9hZGVkIGludG8gb25lLlxuICovXG5leHBvcnQgZGVjbGFyZSBjbGFzcyBPdmVybGF5IHtcbiAgICBwcml2YXRlIF9vdmVybGF5Q29udGFpbmVyO1xuICAgIHByaXZhdGUgX2NvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjtcbiAgICBwcml2YXRlIF9hcHBSZWY7XG4gICAgcHJpdmF0ZSBfcGFuZUVsZW1lbnRzO1xuICAgIGNvbnN0cnVjdG9yKF9vdmVybGF5Q29udGFpbmVyOiBPdmVybGF5Q29udGFpbmVyLCBfY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIF9hcHBSZWY6IEFwcGxpY2F0aW9uUmVmKTtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIG92ZXJsYXkuXG4gICAgICogQHJldHVybnMgQSByZWZlcmVuY2UgdG8gdGhlIGNyZWF0ZWQgb3ZlcmxheS5cbiAgICAgKi9cbiAgICBjcmVhdGUocG9zaXRpb25DbGFzczogc3RyaW5nLCBvdmVybGF5Q29udGFpbmVyPzogVG9hc3RDb250YWluZXJEaXJlY3RpdmUpOiBPdmVybGF5UmVmO1xuICAgIGdldFBhbmVFbGVtZW50KHBvc2l0aW9uQ2xhc3M6IHN0cmluZywgb3ZlcmxheUNvbnRhaW5lcj86IFRvYXN0Q29udGFpbmVyRGlyZWN0aXZlKTogSFRNTEVsZW1lbnQ7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyB0aGUgRE9NIGVsZW1lbnQgZm9yIGFuIG92ZXJsYXkgYW5kIGFwcGVuZHMgaXQgdG8gdGhlIG92ZXJsYXkgY29udGFpbmVyLlxuICAgICAqIEByZXR1cm5zIE5ld2x5LWNyZWF0ZWQgcGFuZSBlbGVtZW50XG4gICAgICovXG4gICAgcHJpdmF0ZSBfY3JlYXRlUGFuZUVsZW1lbnQ7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgRG9tUG9ydGFsSG9zdCBpbnRvIHdoaWNoIHRoZSBvdmVybGF5IGNvbnRlbnQgY2FuIGJlIGxvYWRlZC5cbiAgICAgKiBAcGFyYW0gcGFuZSBUaGUgRE9NIGVsZW1lbnQgdG8gdHVybiBpbnRvIGEgcG9ydGFsIGhvc3QuXG4gICAgICogQHJldHVybnMgQSBwb3J0YWwgaG9zdCBmb3IgdGhlIGdpdmVuIERPTSBlbGVtZW50LlxuICAgICAqL1xuICAgIHByaXZhdGUgX2NyZWF0ZVBvcnRhbEhvc3Q7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBPdmVybGF5UmVmIGZvciBhbiBvdmVybGF5IGluIHRoZSBnaXZlbiBET00gZWxlbWVudC5cbiAgICAgKiBAcGFyYW0gcGFuZSBET00gZWxlbWVudCBmb3IgdGhlIG92ZXJsYXlcbiAgICAgKi9cbiAgICBwcml2YXRlIF9jcmVhdGVPdmVybGF5UmVmO1xufVxuLyoqIFByb3ZpZGVycyBmb3IgT3ZlcmxheSBhbmQgaXRzIHJlbGF0ZWQgaW5qZWN0YWJsZXMuICovXG5leHBvcnQgZGVjbGFyZSBjb25zdCBPVkVSTEFZX1BST1ZJREVSUzogKHR5cGVvZiBPdmVybGF5Q29udGFpbmVyIHwgdHlwZW9mIE92ZXJsYXkpW107XG4iXX0=