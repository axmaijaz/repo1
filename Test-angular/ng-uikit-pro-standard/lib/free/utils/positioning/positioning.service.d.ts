import { ElementRef, RendererFactory2, NgZone } from '@angular/core';
import { Options } from './models/index';
import * as ɵngcc0 from '@angular/core';
export interface PositioningOptions {
    /** The DOM element, ElementRef, or a selector string of an element which will be moved */
    element?: any;
    /** The DOM element, ElementRef, or a selector string of an element which the element will be attached to  */
    target?: any;
    /**
     * A string of the form 'vert-attachment horiz-attachment' or 'placement'
     * - placement can be "top", "bottom", "left", "right"
     * not yet supported:
     * - vert-attachment can be any of 'top', 'middle', 'bottom'
     * - horiz-attachment can be any of 'left', 'center', 'right'
     */
    attachment?: any;
    /** A string similar to `attachment`. The one difference is that, if it's not provided,
     * `targetAttachment` will assume the mirror image of `attachment`.
     */
    targetAttachment?: string;
    /** A string of the form 'vert-offset horiz-offset'
     * - vert-offset and horiz-offset can be of the form "20px" or "55%"
     */
    offset?: string;
    /** A string similar to `offset`, but referring to the offset of the target */
    targetOffset?: string;
    /** If true component will be attached to body */
    appendToBody?: boolean;
}
export declare class PositioningService {
    private _ngZone;
    options: Options;
    private update$$;
    private positionElements;
    constructor(rendererFactory: RendererFactory2, platformId: number, _ngZone: NgZone);
    position(options: PositioningOptions): void;
    addPositionElement(options: PositioningOptions): void;
    calcPosition(): void;
    deletePositionElement(elRef: ElementRef): void;
    setOptions(options: Options): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<PositioningService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<PositioningService>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zaXRpb25pbmcuc2VydmljZS5kLnRzIiwic291cmNlcyI6WyJwb3NpdGlvbmluZy5zZXJ2aWNlLmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbGVtZW50UmVmLCBSZW5kZXJlckZhY3RvcnkyLCBOZ1pvbmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9wdGlvbnMgfSBmcm9tICcuL21vZGVscy9pbmRleCc7XG5leHBvcnQgaW50ZXJmYWNlIFBvc2l0aW9uaW5nT3B0aW9ucyB7XG4gICAgLyoqIFRoZSBET00gZWxlbWVudCwgRWxlbWVudFJlZiwgb3IgYSBzZWxlY3RvciBzdHJpbmcgb2YgYW4gZWxlbWVudCB3aGljaCB3aWxsIGJlIG1vdmVkICovXG4gICAgZWxlbWVudD86IGFueTtcbiAgICAvKiogVGhlIERPTSBlbGVtZW50LCBFbGVtZW50UmVmLCBvciBhIHNlbGVjdG9yIHN0cmluZyBvZiBhbiBlbGVtZW50IHdoaWNoIHRoZSBlbGVtZW50IHdpbGwgYmUgYXR0YWNoZWQgdG8gICovXG4gICAgdGFyZ2V0PzogYW55O1xuICAgIC8qKlxuICAgICAqIEEgc3RyaW5nIG9mIHRoZSBmb3JtICd2ZXJ0LWF0dGFjaG1lbnQgaG9yaXotYXR0YWNobWVudCcgb3IgJ3BsYWNlbWVudCdcbiAgICAgKiAtIHBsYWNlbWVudCBjYW4gYmUgXCJ0b3BcIiwgXCJib3R0b21cIiwgXCJsZWZ0XCIsIFwicmlnaHRcIlxuICAgICAqIG5vdCB5ZXQgc3VwcG9ydGVkOlxuICAgICAqIC0gdmVydC1hdHRhY2htZW50IGNhbiBiZSBhbnkgb2YgJ3RvcCcsICdtaWRkbGUnLCAnYm90dG9tJ1xuICAgICAqIC0gaG9yaXotYXR0YWNobWVudCBjYW4gYmUgYW55IG9mICdsZWZ0JywgJ2NlbnRlcicsICdyaWdodCdcbiAgICAgKi9cbiAgICBhdHRhY2htZW50PzogYW55O1xuICAgIC8qKiBBIHN0cmluZyBzaW1pbGFyIHRvIGBhdHRhY2htZW50YC4gVGhlIG9uZSBkaWZmZXJlbmNlIGlzIHRoYXQsIGlmIGl0J3Mgbm90IHByb3ZpZGVkLFxuICAgICAqIGB0YXJnZXRBdHRhY2htZW50YCB3aWxsIGFzc3VtZSB0aGUgbWlycm9yIGltYWdlIG9mIGBhdHRhY2htZW50YC5cbiAgICAgKi9cbiAgICB0YXJnZXRBdHRhY2htZW50Pzogc3RyaW5nO1xuICAgIC8qKiBBIHN0cmluZyBvZiB0aGUgZm9ybSAndmVydC1vZmZzZXQgaG9yaXotb2Zmc2V0J1xuICAgICAqIC0gdmVydC1vZmZzZXQgYW5kIGhvcml6LW9mZnNldCBjYW4gYmUgb2YgdGhlIGZvcm0gXCIyMHB4XCIgb3IgXCI1NSVcIlxuICAgICAqL1xuICAgIG9mZnNldD86IHN0cmluZztcbiAgICAvKiogQSBzdHJpbmcgc2ltaWxhciB0byBgb2Zmc2V0YCwgYnV0IHJlZmVycmluZyB0byB0aGUgb2Zmc2V0IG9mIHRoZSB0YXJnZXQgKi9cbiAgICB0YXJnZXRPZmZzZXQ/OiBzdHJpbmc7XG4gICAgLyoqIElmIHRydWUgY29tcG9uZW50IHdpbGwgYmUgYXR0YWNoZWQgdG8gYm9keSAqL1xuICAgIGFwcGVuZFRvQm9keT86IGJvb2xlYW47XG59XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBQb3NpdGlvbmluZ1NlcnZpY2Uge1xuICAgIHByaXZhdGUgX25nWm9uZTtcbiAgICBvcHRpb25zOiBPcHRpb25zO1xuICAgIHByaXZhdGUgdXBkYXRlJCQ7XG4gICAgcHJpdmF0ZSBwb3NpdGlvbkVsZW1lbnRzO1xuICAgIGNvbnN0cnVjdG9yKHJlbmRlcmVyRmFjdG9yeTogUmVuZGVyZXJGYWN0b3J5MiwgcGxhdGZvcm1JZDogbnVtYmVyLCBfbmdab25lOiBOZ1pvbmUpO1xuICAgIHBvc2l0aW9uKG9wdGlvbnM6IFBvc2l0aW9uaW5nT3B0aW9ucyk6IHZvaWQ7XG4gICAgYWRkUG9zaXRpb25FbGVtZW50KG9wdGlvbnM6IFBvc2l0aW9uaW5nT3B0aW9ucyk6IHZvaWQ7XG4gICAgY2FsY1Bvc2l0aW9uKCk6IHZvaWQ7XG4gICAgZGVsZXRlUG9zaXRpb25FbGVtZW50KGVsUmVmOiBFbGVtZW50UmVmKTogdm9pZDtcbiAgICBzZXRPcHRpb25zKG9wdGlvbnM6IE9wdGlvbnMpOiB2b2lkO1xufVxuIl19