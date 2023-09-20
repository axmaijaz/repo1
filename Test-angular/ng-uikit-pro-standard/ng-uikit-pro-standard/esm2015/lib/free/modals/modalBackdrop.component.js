/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, ElementRef, Renderer2, HostBinding } from '@angular/core';
import { ClassName } from './modal.options';
import { isBs3 } from '../utils/ng2-bootstrap-config';
import { Utils } from '../utils/utils.class';
export class ModalBackdropOptions {
    /**
     * @param {?} options
     */
    constructor(options) {
        this.animate = true;
        Object.assign(this, options);
    }
}
if (false) {
    /** @type {?} */
    ModalBackdropOptions.prototype.animate;
}
/**
 * This component will be added as background layout for modals if enabled
 */
export class ModalBackdropComponent {
    /**
     * @param {?} element
     * @param {?} renderer
     */
    constructor(element, renderer) {
        this.element = element;
        this.renderer = renderer;
        this.classNameBackDrop = true;
        this._isShown = false;
    }
    /**
     * @return {?}
     */
    get isAnimated() {
        return this._isAnimated;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set isAnimated(value) {
        this._isAnimated = value;
    }
    /**
     * @return {?}
     */
    get isShown() {
        return this._isShown;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set isShown(value) {
        this._isShown = value;
        if (value) {
            this.renderer.addClass(this.element.nativeElement, `${ClassName.IN}`);
            if (!isBs3()) {
                this.renderer.addClass(this.element.nativeElement, `${ClassName.SHOW}`);
            }
        }
        else {
            this.renderer.removeClass(this.element.nativeElement, `${ClassName.IN}`);
            if (!isBs3()) {
                this.renderer.removeClass(this.element.nativeElement, `${ClassName.SHOW}`);
            }
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.isAnimated) {
            this.renderer.addClass(this.element.nativeElement, `${ClassName.FADE}`);
            Utils.reflow(this.element.nativeElement);
        }
        else {
            this.renderer.addClass(this.element.nativeElement, `${ClassName.FADE}`);
            Utils.reflow(this.element.nativeElement);
        }
        this.isShown = true;
    }
}
ModalBackdropComponent.decorators = [
    { type: Component, args: [{
                selector: 'mdb-modal-backdrop',
                template: ``
            }] }
];
/** @nocollapse */
ModalBackdropComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 }
];
ModalBackdropComponent.propDecorators = {
    classNameBackDrop: [{ type: HostBinding, args: ['class.modal-backdrop',] }]
};
if (false) {
    /** @type {?} */
    ModalBackdropComponent.prototype.classNameBackDrop;
    /**
     * @type {?}
     * @protected
     */
    ModalBackdropComponent.prototype._isAnimated;
    /**
     * @type {?}
     * @protected
     */
    ModalBackdropComponent.prototype._isShown;
    /** @type {?} */
    ModalBackdropComponent.prototype.element;
    /** @type {?} */
    ModalBackdropComponent.prototype.renderer;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWxCYWNrZHJvcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy11aWtpdC1wcm8tc3RhbmRhcmQvIiwic291cmNlcyI6WyJsaWIvZnJlZS9tb2RhbHMvbW9kYWxCYWNrZHJvcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFVLFNBQVMsRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFdEYsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzVDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUN0RCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFN0MsTUFBTSxPQUFPLG9CQUFvQjs7OztJQUcvQixZQUFtQixPQUE2QjtRQUZ6QyxZQUFPLEdBQUcsSUFBSSxDQUFDO1FBR3BCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQy9CLENBQUM7Q0FDRjs7O0lBTEMsdUNBQXNCOzs7OztBQVl4QixNQUFNLE9BQU8sc0JBQXNCOzs7OztJQW1DakMsWUFBMEIsT0FBbUIsRUFBUyxRQUFtQjtRQUEvQyxZQUFPLEdBQVAsT0FBTyxDQUFZO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQWxDN0Isc0JBQWlCLEdBQUcsSUFBSSxDQUFDO1FBZ0MzRCxhQUFRLEdBQUcsS0FBSyxDQUFDO0lBRWlELENBQUM7Ozs7SUFoQzdFLElBQVcsVUFBVTtRQUNuQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQzs7Ozs7SUFFRCxJQUFXLFVBQVUsQ0FBQyxLQUFjO1FBQ2xDLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7Ozs7SUFFRCxJQUFXLE9BQU87UUFDaEIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7Ozs7O0lBRUQsSUFBVyxPQUFPLENBQUMsS0FBYztRQUMvQixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUN0QixJQUFJLEtBQUssRUFBRTtZQUNULElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLEdBQUcsU0FBUyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFdEUsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFO2dCQUNaLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLEdBQUcsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7YUFDekU7U0FDRjthQUFNO1lBQ0wsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsR0FBRyxTQUFTLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUV6RSxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUU7Z0JBQ1osSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsR0FBRyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQzthQUM1RTtTQUNGO0lBQ0gsQ0FBQzs7OztJQU9ELFFBQVE7UUFDTixJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsR0FBRyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUN4RSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDMUM7YUFBTTtZQUNMLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLEdBQUcsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7WUFDeEUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQzFDO1FBQ0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDdEIsQ0FBQzs7O1lBbERGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsb0JBQW9CO2dCQUM5QixRQUFRLEVBQUUsRUFBRTthQUNiOzs7O1lBbEJtQixVQUFVO1lBQVUsU0FBUzs7O2dDQW9COUMsV0FBVyxTQUFDLHNCQUFzQjs7OztJQUFuQyxtREFBcUU7Ozs7O0lBK0JyRSw2Q0FBK0I7Ozs7O0lBQy9CLDBDQUEyQjs7SUFFUix5Q0FBMEI7O0lBQUUsMENBQTBCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBPbkluaXQsIFJlbmRlcmVyMiwgSG9zdEJpbmRpbmcgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ2xhc3NOYW1lIH0gZnJvbSAnLi9tb2RhbC5vcHRpb25zJztcbmltcG9ydCB7IGlzQnMzIH0gZnJvbSAnLi4vdXRpbHMvbmcyLWJvb3RzdHJhcC1jb25maWcnO1xuaW1wb3J0IHsgVXRpbHMgfSBmcm9tICcuLi91dGlscy91dGlscy5jbGFzcyc7XG5cbmV4cG9ydCBjbGFzcyBNb2RhbEJhY2tkcm9wT3B0aW9ucyB7XG4gIHB1YmxpYyBhbmltYXRlID0gdHJ1ZTtcblxuICBwdWJsaWMgY29uc3RydWN0b3Iob3B0aW9uczogTW9kYWxCYWNrZHJvcE9wdGlvbnMpIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9wdGlvbnMpO1xuICB9XG59XG5cbi8qKiBUaGlzIGNvbXBvbmVudCB3aWxsIGJlIGFkZGVkIGFzIGJhY2tncm91bmQgbGF5b3V0IGZvciBtb2RhbHMgaWYgZW5hYmxlZCAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWRiLW1vZGFsLWJhY2tkcm9wJyxcbiAgdGVtcGxhdGU6IGBgLFxufSlcbmV4cG9ydCBjbGFzcyBNb2RhbEJhY2tkcm9wQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5tb2RhbC1iYWNrZHJvcCcpIHB1YmxpYyBjbGFzc05hbWVCYWNrRHJvcCA9IHRydWU7XG5cbiAgcHVibGljIGdldCBpc0FuaW1hdGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9pc0FuaW1hdGVkO1xuICB9XG5cbiAgcHVibGljIHNldCBpc0FuaW1hdGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5faXNBbmltYXRlZCA9IHZhbHVlO1xuICB9XG5cbiAgcHVibGljIGdldCBpc1Nob3duKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9pc1Nob3duO1xuICB9XG5cbiAgcHVibGljIHNldCBpc1Nob3duKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5faXNTaG93biA9IHZhbHVlO1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgYCR7Q2xhc3NOYW1lLklOfWApO1xuXG4gICAgICBpZiAoIWlzQnMzKCkpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgYCR7Q2xhc3NOYW1lLlNIT1d9YCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIGAke0NsYXNzTmFtZS5JTn1gKTtcblxuICAgICAgaWYgKCFpc0JzMygpKSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIGAke0NsYXNzTmFtZS5TSE9XfWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfaXNBbmltYXRlZDogYm9vbGVhbjtcbiAgcHJvdGVjdGVkIF9pc1Nob3duID0gZmFsc2U7XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKHB1YmxpYyBlbGVtZW50OiBFbGVtZW50UmVmLCBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMikge31cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc0FuaW1hdGVkKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LCBgJHtDbGFzc05hbWUuRkFERX1gKTtcbiAgICAgIFV0aWxzLnJlZmxvdyh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIGAke0NsYXNzTmFtZS5GQURFfWApO1xuICAgICAgVXRpbHMucmVmbG93KHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50KTtcbiAgICB9XG4gICAgdGhpcy5pc1Nob3duID0gdHJ1ZTtcbiAgfVxufVxuIl19