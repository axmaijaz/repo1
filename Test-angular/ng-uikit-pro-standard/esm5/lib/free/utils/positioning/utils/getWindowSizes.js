/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { isIE } from './isIE';
/**
 * @param {?} axis
 * @param {?} body
 * @param {?} html
 * @param {?} computedStyle
 * @return {?}
 */
function getSize(axis, body, html, computedStyle) {
    return Math.max(((/** @type {?} */ (body)))["offset" + axis], ((/** @type {?} */ (body)))["scroll" + axis], ((/** @type {?} */ (html)))["client" + axis], ((/** @type {?} */ (html)))["offset" + axis], ((/** @type {?} */ (html)))["scroll" + axis], isIE(10)
        ? (parseInt(((/** @type {?} */ (html)))["offset" + axis], 10) +
            parseInt(computedStyle[(/** @type {?} */ ("margin" + (axis === 'Height' ? 'Top' : 'Left')))], 10) +
            parseInt(computedStyle[(/** @type {?} */ ("margin" + (axis === 'Height' ? 'Bottom' : 'Right')))], 10))
        : 0);
}
/**
 * @param {?} document
 * @return {?}
 */
export function getWindowSizes(document) {
    /** @type {?} */
    var body = document.body;
    /** @type {?} */
    var html = document.documentElement;
    /** @type {?} */
    var computedStyle = isIE(10) && getComputedStyle(html);
    return {
        height: getSize('Height', body, html, computedStyle),
        width: getSize('Width', body, html, computedStyle)
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0V2luZG93U2l6ZXMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy11aWtpdC1wcm8tc3RhbmRhcmQvIiwic291cmNlcyI6WyJsaWIvZnJlZS91dGlscy9wb3NpdGlvbmluZy91dGlscy9nZXRXaW5kb3dTaXplcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFFBQVEsQ0FBQzs7Ozs7Ozs7QUFFOUIsU0FBUyxPQUFPLENBQUMsSUFBWSxFQUFFLElBQWlCLEVBQUUsSUFBaUIsRUFBRSxhQUFrQztJQUNyRyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQ2IsQ0FBQyxtQkFBQSxJQUFJLEVBQU8sQ0FBQyxDQUFDLFdBQVMsSUFBTSxDQUFDLEVBQzlCLENBQUMsbUJBQUEsSUFBSSxFQUFPLENBQUMsQ0FBQyxXQUFTLElBQU0sQ0FBQyxFQUM5QixDQUFDLG1CQUFBLElBQUksRUFBTyxDQUFDLENBQUMsV0FBUyxJQUFNLENBQUMsRUFDOUIsQ0FBQyxtQkFBQSxJQUFJLEVBQU8sQ0FBQyxDQUFDLFdBQVMsSUFBTSxDQUFDLEVBQzlCLENBQUMsbUJBQUEsSUFBSSxFQUFPLENBQUMsQ0FBQyxXQUFTLElBQU0sQ0FBQyxFQUM5QixJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ04sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsbUJBQUEsSUFBSSxFQUFPLENBQUMsQ0FBQyxXQUFTLElBQU0sQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUMvQyxRQUFRLENBQUMsYUFBYSxDQUFDLG1CQUFBLFlBQVMsSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUUsRUFBTyxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ2pGLFFBQVEsQ0FBQyxhQUFhLENBQUMsbUJBQUEsWUFBUyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBRSxFQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN4RixDQUFDLENBQUMsQ0FBQyxDQUNKLENBQUM7QUFDSixDQUFDOzs7OztBQUVELE1BQU0sVUFBVSxjQUFjLENBQUMsUUFBYTs7UUFDcEMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJOztRQUNwQixJQUFJLEdBQUcsUUFBUSxDQUFDLGVBQWU7O1FBQy9CLGFBQWEsR0FBUSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDO0lBRTdELE9BQU87UUFDTCxNQUFNLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLGFBQWEsQ0FBQztRQUNwRCxLQUFLLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLGFBQWEsQ0FBQztLQUNuRCxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlzSUUgfSBmcm9tICcuL2lzSUUnO1xuXG5mdW5jdGlvbiBnZXRTaXplKGF4aXM6IHN0cmluZywgYm9keTogSFRNTEVsZW1lbnQsIGh0bWw6IEhUTUxFbGVtZW50LCBjb21wdXRlZFN0eWxlOiBDU1NTdHlsZURlY2xhcmF0aW9uKSB7XG4gIHJldHVybiBNYXRoLm1heChcbiAgICAoYm9keSBhcyBhbnkpW2BvZmZzZXQke2F4aXN9YF0sXG4gICAgKGJvZHkgYXMgYW55KVtgc2Nyb2xsJHtheGlzfWBdLFxuICAgIChodG1sIGFzIGFueSlbYGNsaWVudCR7YXhpc31gXSxcbiAgICAoaHRtbCBhcyBhbnkpW2BvZmZzZXQke2F4aXN9YF0sXG4gICAgKGh0bWwgYXMgYW55KVtgc2Nyb2xsJHtheGlzfWBdLFxuICAgIGlzSUUoMTApXG4gICAgICA/IChwYXJzZUludCgoaHRtbCBhcyBhbnkpW2BvZmZzZXQke2F4aXN9YF0sIDEwKSArXG4gICAgICBwYXJzZUludChjb21wdXRlZFN0eWxlW2BtYXJnaW4ke2F4aXMgPT09ICdIZWlnaHQnID8gJ1RvcCcgOiAnTGVmdCd9YCBhcyBhbnldLCAxMCkgK1xuICAgICAgcGFyc2VJbnQoY29tcHV0ZWRTdHlsZVtgbWFyZ2luJHtheGlzID09PSAnSGVpZ2h0JyA/ICdCb3R0b20nIDogJ1JpZ2h0J31gIGFzIGFueV0sIDEwKSlcbiAgICA6IDBcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFdpbmRvd1NpemVzKGRvY3VtZW50OiBhbnkpIHtcbiAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XG4gIGNvbnN0IGh0bWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gIGNvbnN0IGNvbXB1dGVkU3R5bGU6IGFueSA9IGlzSUUoMTApICYmIGdldENvbXB1dGVkU3R5bGUoaHRtbCk7XG5cbiAgcmV0dXJuIHtcbiAgICBoZWlnaHQ6IGdldFNpemUoJ0hlaWdodCcsIGJvZHksIGh0bWwsIGNvbXB1dGVkU3R5bGUpLFxuICAgIHdpZHRoOiBnZXRTaXplKCdXaWR0aCcsIGJvZHksIGh0bWwsIGNvbXB1dGVkU3R5bGUpXG4gIH07XG59XG4iXX0=