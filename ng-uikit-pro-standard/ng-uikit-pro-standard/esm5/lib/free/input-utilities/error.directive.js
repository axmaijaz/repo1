/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Input, HostBinding, ElementRef, Renderer2, ViewEncapsulation, Component, } from '@angular/core';
import { Utils } from '../utils';
/** @type {?} */
var defaultIdNumber = 0;
var MdbErrorDirective = /** @class */ (function () {
    function MdbErrorDirective(el, renderer) {
        this.el = el;
        this.renderer = renderer;
        this.id = "mdb-error-" + defaultIdNumber++;
        this.errorMsg = true;
        this.messageId = this.id;
        this.utils = new Utils();
    }
    /**
     * @private
     * @return {?}
     */
    MdbErrorDirective.prototype._calculateMarginTop = /**
     * @private
     * @return {?}
     */
    function () {
        /** @type {?} */
        var parent = this.el.nativeElement.parentNode.querySelector('.form-check');
        /** @type {?} */
        var heightParent = parent ? parent.offsetHeight : null;
        if (heightParent) {
            /** @type {?} */
            var margin = heightParent / 12.5;
            this.el.nativeElement.style.top = heightParent + heightParent / margin + "px";
        }
    };
    /**
     * @return {?}
     */
    MdbErrorDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.prefix = this.el.nativeElement.parentNode.querySelector('.prefix');
        if (this.prefix) {
            this.prefix.classList.add('error-message');
        }
        /** @type {?} */
        var textarea = this.utils.getClosestEl(this.el.nativeElement, '.md-textarea');
        this._calculateMarginTop();
        if (textarea) {
            /** @type {?} */
            var height_1 = textarea.offsetHeight + 4 + 'px';
            this.renderer.setStyle(this.el.nativeElement, 'top', height_1);
            this.textareaListenFunction = this.renderer.listen(textarea, 'keyup', (/**
             * @return {?}
             */
            function () {
                height_1 = textarea.offsetHeight + 4 + 'px';
                _this.renderer.setStyle(_this.el.nativeElement, 'top', height_1);
            }));
        }
    };
    /**
     * @return {?}
     */
    MdbErrorDirective.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.textareaListenFunction) {
            this.textareaListenFunction();
        }
        if (this.prefix) {
            this.prefix.classList.remove('error-message');
        }
    };
    MdbErrorDirective.decorators = [
        { type: Component, args: [{
                    selector: 'mdb-error',
                    template: '<ng-content></ng-content>',
                    encapsulation: ViewEncapsulation.None,
                    styles: [".error-message,.success-message{position:absolute;top:40px;left:0;font-size:.8rem}textarea~.error-message,textarea~.success-message{top:unset;bottom:-20px}.error-message{color:#f44336}.success-message{color:#00c851}"]
                }] }
    ];
    /** @nocollapse */
    MdbErrorDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 }
    ]; };
    MdbErrorDirective.propDecorators = {
        id: [{ type: Input }],
        errorMsg: [{ type: HostBinding, args: ['class.error-message',] }],
        messageId: [{ type: HostBinding, args: ['attr.id',] }]
    };
    return MdbErrorDirective;
}());
export { MdbErrorDirective };
if (false) {
    /** @type {?} */
    MdbErrorDirective.prototype.prefix;
    /** @type {?} */
    MdbErrorDirective.prototype.id;
    /** @type {?} */
    MdbErrorDirective.prototype.errorMsg;
    /** @type {?} */
    MdbErrorDirective.prototype.messageId;
    /** @type {?} */
    MdbErrorDirective.prototype.textareaListenFunction;
    /**
     * @type {?}
     * @private
     */
    MdbErrorDirective.prototype.utils;
    /**
     * @type {?}
     * @private
     */
    MdbErrorDirective.prototype.el;
    /**
     * @type {?}
     * @private
     */
    MdbErrorDirective.prototype.renderer;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctdWlraXQtcHJvLXN0YW5kYXJkLyIsInNvdXJjZXMiOlsibGliL2ZyZWUvaW5wdXQtdXRpbGl0aWVzL2Vycm9yLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLEtBQUssRUFDTCxXQUFXLEVBRVgsVUFBVSxFQUNWLFNBQVMsRUFFVCxpQkFBaUIsRUFDakIsU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxVQUFVLENBQUM7O0lBRTdCLGVBQWUsR0FBRyxDQUFDO0FBRXZCO0lBa0JFLDJCQUFvQixFQUFjLEVBQVUsUUFBbUI7UUFBM0MsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVc7UUFUdEQsT0FBRSxHQUFHLGVBQWEsZUFBZSxFQUFJLENBQUM7UUFFWCxhQUFRLEdBQUcsSUFBSSxDQUFDO1FBQzVCLGNBQVMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBSXBDLFVBQUssR0FBVSxJQUFJLEtBQUssRUFBRSxDQUFDO0lBRStCLENBQUM7Ozs7O0lBRTNELCtDQUFtQjs7OztJQUEzQjs7WUFDUSxNQUFNLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUM7O1lBQ3RFLFlBQVksR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUk7UUFDeEQsSUFBSSxZQUFZLEVBQUU7O2dCQUNWLE1BQU0sR0FBRyxZQUFZLEdBQUcsSUFBSTtZQUNsQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFNLFlBQVksR0FBRyxZQUFZLEdBQUcsTUFBTSxPQUFJLENBQUM7U0FDL0U7SUFDSCxDQUFDOzs7O0lBRUQsb0NBQVE7OztJQUFSO1FBQUEsaUJBaUJDO1FBaEJDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN4RSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDZixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7U0FDNUM7O1lBRUssUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLGNBQWMsQ0FBQztRQUMvRSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUMzQixJQUFJLFFBQVEsRUFBRTs7Z0JBQ1IsUUFBTSxHQUFHLFFBQVEsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxHQUFHLElBQUk7WUFDN0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLFFBQU0sQ0FBQyxDQUFDO1lBRTdELElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTzs7O1lBQUU7Z0JBQ3BFLFFBQU0sR0FBRyxRQUFRLENBQUMsWUFBWSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7Z0JBQzFDLEtBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxRQUFNLENBQUMsQ0FBQztZQUMvRCxDQUFDLEVBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQzs7OztJQUVELHVDQUFXOzs7SUFBWDtRQUNFLElBQUksSUFBSSxDQUFDLHNCQUFzQixFQUFFO1lBQy9CLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1NBQy9CO1FBQ0QsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQy9DO0lBQ0gsQ0FBQzs7Z0JBdkRGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsV0FBVztvQkFDckIsUUFBUSxFQUFFLDJCQUEyQjtvQkFFckMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7O2lCQUN0Qzs7OztnQkFmQyxVQUFVO2dCQUNWLFNBQVM7OztxQkFrQlIsS0FBSzsyQkFFTCxXQUFXLFNBQUMscUJBQXFCOzRCQUNqQyxXQUFXLFNBQUMsU0FBUzs7SUE0Q3hCLHdCQUFDO0NBQUEsQUF4REQsSUF3REM7U0FqRFksaUJBQWlCOzs7SUFDNUIsbUNBQW9COztJQUNwQiwrQkFBK0M7O0lBRS9DLHFDQUFvRDs7SUFDcEQsc0NBQTRDOztJQUU1QyxtREFBaUM7Ozs7O0lBRWpDLGtDQUFtQzs7Ozs7SUFFdkIsK0JBQXNCOzs7OztJQUFFLHFDQUEyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIElucHV0LFxuICBIb3N0QmluZGluZyxcbiAgT25Jbml0LFxuICBFbGVtZW50UmVmLFxuICBSZW5kZXJlcjIsXG4gIE9uRGVzdHJveSxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIENvbXBvbmVudCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBVdGlscyB9IGZyb20gJy4uL3V0aWxzJztcblxubGV0IGRlZmF1bHRJZE51bWJlciA9IDA7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21kYi1lcnJvcicsXG4gIHRlbXBsYXRlOiAnPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PicsXG4gIHN0eWxlVXJsczogWycuL2lucHV0LXV0aWxpdGllcy1tb2R1bGUuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjb21wb25lbnQtY2xhc3Mtc3VmZml4XG5leHBvcnQgY2xhc3MgTWRiRXJyb3JEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHByZWZpeDogSFRNTEVsZW1lbnQ7XG4gIEBJbnB1dCgpIGlkID0gYG1kYi1lcnJvci0ke2RlZmF1bHRJZE51bWJlcisrfWA7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5lcnJvci1tZXNzYWdlJykgZXJyb3JNc2cgPSB0cnVlO1xuICBASG9zdEJpbmRpbmcoJ2F0dHIuaWQnKSBtZXNzYWdlSWQgPSB0aGlzLmlkO1xuXG4gIHRleHRhcmVhTGlzdGVuRnVuY3Rpb246IEZ1bmN0aW9uO1xuXG4gIHByaXZhdGUgdXRpbHM6IFV0aWxzID0gbmV3IFV0aWxzKCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbDogRWxlbWVudFJlZiwgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7fVxuXG4gIHByaXZhdGUgX2NhbGN1bGF0ZU1hcmdpblRvcCgpIHtcbiAgICBjb25zdCBwYXJlbnQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKCcuZm9ybS1jaGVjaycpO1xuICAgIGNvbnN0IGhlaWdodFBhcmVudCA9IHBhcmVudCA/IHBhcmVudC5vZmZzZXRIZWlnaHQgOiBudWxsO1xuICAgIGlmIChoZWlnaHRQYXJlbnQpIHtcbiAgICAgIGNvbnN0IG1hcmdpbiA9IGhlaWdodFBhcmVudCAvIDEyLjU7XG4gICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUudG9wID0gYCR7aGVpZ2h0UGFyZW50ICsgaGVpZ2h0UGFyZW50IC8gbWFyZ2lufXB4YDtcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnByZWZpeCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoJy5wcmVmaXgnKTtcbiAgICBpZiAodGhpcy5wcmVmaXgpIHtcbiAgICAgIHRoaXMucHJlZml4LmNsYXNzTGlzdC5hZGQoJ2Vycm9yLW1lc3NhZ2UnKTtcbiAgICB9XG5cbiAgICBjb25zdCB0ZXh0YXJlYSA9IHRoaXMudXRpbHMuZ2V0Q2xvc2VzdEVsKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJy5tZC10ZXh0YXJlYScpO1xuICAgIHRoaXMuX2NhbGN1bGF0ZU1hcmdpblRvcCgpO1xuICAgIGlmICh0ZXh0YXJlYSkge1xuICAgICAgbGV0IGhlaWdodCA9IHRleHRhcmVhLm9mZnNldEhlaWdodCArIDQgKyAncHgnO1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICd0b3AnLCBoZWlnaHQpO1xuXG4gICAgICB0aGlzLnRleHRhcmVhTGlzdGVuRnVuY3Rpb24gPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0ZXh0YXJlYSwgJ2tleXVwJywgKCkgPT4ge1xuICAgICAgICBoZWlnaHQgPSB0ZXh0YXJlYS5vZmZzZXRIZWlnaHQgKyA0ICsgJ3B4JztcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICd0b3AnLCBoZWlnaHQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMudGV4dGFyZWFMaXN0ZW5GdW5jdGlvbikge1xuICAgICAgdGhpcy50ZXh0YXJlYUxpc3RlbkZ1bmN0aW9uKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnByZWZpeCkge1xuICAgICAgdGhpcy5wcmVmaXguY2xhc3NMaXN0LnJlbW92ZSgnZXJyb3ItbWVzc2FnZScpO1xuICAgIH1cbiAgfVxufVxuIl19