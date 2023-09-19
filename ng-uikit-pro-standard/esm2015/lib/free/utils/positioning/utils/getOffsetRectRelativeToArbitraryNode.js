/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { getBoundingClientRect } from './getBoundingClientRect';
import { getClientRect } from './getClientRect';
import { getScrollParent } from './getScrollParent';
import { getStyleComputedProperty } from './getStyleComputedProperty';
import { includeScroll } from './includeScroll';
import { isIE as runIsIE } from './isIE';
/**
 * @param {?} children
 * @param {?} parent
 * @param {?=} fixedPosition
 * @return {?}
 */
export function getOffsetRectRelativeToArbitraryNode(children, parent, fixedPosition = false) {
    /** @type {?} */
    const isIE10 = runIsIE(10);
    /** @type {?} */
    const isHTML = parent.nodeName === 'HTML';
    /** @type {?} */
    const childrenRect = getBoundingClientRect(children);
    /** @type {?} */
    const parentRect = getBoundingClientRect(parent);
    /** @type {?} */
    const scrollParent = getScrollParent(children);
    /** @type {?} */
    const styles = getStyleComputedProperty(parent);
    /** @type {?} */
    const borderTopWidth = parseFloat(styles.borderTopWidth);
    /** @type {?} */
    const borderLeftWidth = parseFloat(styles.borderLeftWidth);
    // In cases where the parent is fixed, we must ignore negative scroll in offset calc
    if (fixedPosition && isHTML) {
        parentRect.top = Math.max(parentRect.top, 0);
        parentRect.left = Math.max(parentRect.left, 0);
    }
    /** @type {?} */
    let offsets = getClientRect({
        top: childrenRect.top - parentRect.top - borderTopWidth,
        left: childrenRect.left - parentRect.left - borderLeftWidth,
        width: childrenRect.width,
        height: childrenRect.height
    });
    offsets.marginTop = 0;
    offsets.marginLeft = 0;
    // Subtract margins of documentElement in case it's being used as parent
    // we do this only on HTML because it's the only element that behaves
    // differently when margins are applied to it. The margins are included in
    // the box of the documentElement, in the other cases not.
    if (!isIE10 && isHTML) {
        /** @type {?} */
        const marginTop = parseFloat(styles.marginTop);
        /** @type {?} */
        const marginLeft = parseFloat(styles.marginLeft);
        offsets.top -= borderTopWidth - marginTop;
        offsets.bottom -= borderTopWidth - marginTop;
        offsets.left -= borderLeftWidth - marginLeft;
        offsets.right -= borderLeftWidth - marginLeft;
        // Attach marginTop and marginLeft because in some circumstances we may need them
        offsets.marginTop = marginTop;
        offsets.marginLeft = marginLeft;
    }
    if (isIE10 && !fixedPosition
        ? parent.contains(scrollParent)
        : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
        offsets = includeScroll(offsets, parent);
    }
    return offsets;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0T2Zmc2V0UmVjdFJlbGF0aXZlVG9BcmJpdHJhcnlOb2RlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctdWlraXQtcHJvLXN0YW5kYXJkLyIsInNvdXJjZXMiOlsibGliL2ZyZWUvdXRpbHMvcG9zaXRpb25pbmcvdXRpbHMvZ2V0T2Zmc2V0UmVjdFJlbGF0aXZlVG9BcmJpdHJhcnlOb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDaEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3BELE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNoRCxPQUFPLEVBQUUsSUFBSSxJQUFJLE9BQU8sRUFBRSxNQUFNLFFBQVEsQ0FBQzs7Ozs7OztBQUV6QyxNQUFNLFVBQVUsb0NBQW9DLENBQ2xELFFBQXFCLEVBQ3JCLE1BQW1CLEVBQ25CLGFBQWEsR0FBRyxLQUFLOztVQUVmLE1BQU0sR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDOztVQUNwQixNQUFNLEdBQUcsTUFBTSxDQUFDLFFBQVEsS0FBSyxNQUFNOztVQUNuQyxZQUFZLEdBQVEscUJBQXFCLENBQUMsUUFBUSxDQUFDOztVQUNuRCxVQUFVLEdBQVEscUJBQXFCLENBQUMsTUFBTSxDQUFDOztVQUMvQyxZQUFZLEdBQUcsZUFBZSxDQUFDLFFBQVEsQ0FBQzs7VUFFeEMsTUFBTSxHQUFHLHdCQUF3QixDQUFDLE1BQU0sQ0FBQzs7VUFDekMsY0FBYyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDOztVQUNsRCxlQUFlLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUM7SUFFMUQsb0ZBQW9GO0lBQ3BGLElBQUksYUFBYSxJQUFJLE1BQU0sRUFBRTtRQUMzQixVQUFVLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3QyxVQUFVLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNoRDs7UUFFRyxPQUFPLEdBQVEsYUFBYSxDQUFDO1FBQy9CLEdBQUcsRUFBRSxZQUFZLENBQUMsR0FBRyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEdBQUcsY0FBYztRQUN2RCxJQUFJLEVBQUUsWUFBWSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsSUFBSSxHQUFHLGVBQWU7UUFDM0QsS0FBSyxFQUFFLFlBQVksQ0FBQyxLQUFLO1FBQ3pCLE1BQU0sRUFBRSxZQUFZLENBQUMsTUFBTTtLQUM1QixDQUFDO0lBRUYsT0FBTyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFDdEIsT0FBTyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7SUFFdkIsd0VBQXdFO0lBQ3hFLHFFQUFxRTtJQUNyRSwwRUFBMEU7SUFDMUUsMERBQTBEO0lBQzFELElBQUksQ0FBQyxNQUFNLElBQUksTUFBTSxFQUFFOztjQUNmLFNBQVMsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQzs7Y0FDeEMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO1FBRWhELE9BQU8sQ0FBQyxHQUFHLElBQUksY0FBYyxHQUFHLFNBQVMsQ0FBQztRQUMxQyxPQUFPLENBQUMsTUFBTSxJQUFJLGNBQWMsR0FBRyxTQUFTLENBQUM7UUFDN0MsT0FBTyxDQUFDLElBQUksSUFBSSxlQUFlLEdBQUcsVUFBVSxDQUFDO1FBQzdDLE9BQU8sQ0FBQyxLQUFLLElBQUksZUFBZSxHQUFHLFVBQVUsQ0FBQztRQUU5QyxpRkFBaUY7UUFDakYsT0FBTyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDOUIsT0FBTyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7S0FDakM7SUFFRCxJQUNFLE1BQU0sSUFBSSxDQUFDLGFBQWE7UUFDdEIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDO1FBQy9CLENBQUMsQ0FBQyxNQUFNLEtBQUssWUFBWSxJQUFJLFlBQVksQ0FBQyxRQUFRLEtBQUssTUFBTSxFQUMvRDtRQUNBLE9BQU8sR0FBRyxhQUFhLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQzFDO0lBRUQsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldEJvdW5kaW5nQ2xpZW50UmVjdCB9IGZyb20gJy4vZ2V0Qm91bmRpbmdDbGllbnRSZWN0JztcbmltcG9ydCB7IGdldENsaWVudFJlY3QgfSBmcm9tICcuL2dldENsaWVudFJlY3QnO1xuaW1wb3J0IHsgZ2V0U2Nyb2xsUGFyZW50IH0gZnJvbSAnLi9nZXRTY3JvbGxQYXJlbnQnO1xuaW1wb3J0IHsgZ2V0U3R5bGVDb21wdXRlZFByb3BlcnR5IH0gZnJvbSAnLi9nZXRTdHlsZUNvbXB1dGVkUHJvcGVydHknO1xuaW1wb3J0IHsgaW5jbHVkZVNjcm9sbCB9IGZyb20gJy4vaW5jbHVkZVNjcm9sbCc7XG5pbXBvcnQgeyBpc0lFIGFzIHJ1bklzSUUgfSBmcm9tICcuL2lzSUUnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0T2Zmc2V0UmVjdFJlbGF0aXZlVG9BcmJpdHJhcnlOb2RlKFxuICBjaGlsZHJlbjogSFRNTEVsZW1lbnQsXG4gIHBhcmVudDogSFRNTEVsZW1lbnQsXG4gIGZpeGVkUG9zaXRpb24gPSBmYWxzZVxuKTogYW55IHtcbiAgY29uc3QgaXNJRTEwID0gcnVuSXNJRSgxMCk7XG4gIGNvbnN0IGlzSFRNTCA9IHBhcmVudC5ub2RlTmFtZSA9PT0gJ0hUTUwnO1xuICBjb25zdCBjaGlsZHJlblJlY3Q6IGFueSA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdChjaGlsZHJlbik7XG4gIGNvbnN0IHBhcmVudFJlY3Q6IGFueSA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdChwYXJlbnQpO1xuICBjb25zdCBzY3JvbGxQYXJlbnQgPSBnZXRTY3JvbGxQYXJlbnQoY2hpbGRyZW4pO1xuXG4gIGNvbnN0IHN0eWxlcyA9IGdldFN0eWxlQ29tcHV0ZWRQcm9wZXJ0eShwYXJlbnQpO1xuICBjb25zdCBib3JkZXJUb3BXaWR0aCA9IHBhcnNlRmxvYXQoc3R5bGVzLmJvcmRlclRvcFdpZHRoKTtcbiAgY29uc3QgYm9yZGVyTGVmdFdpZHRoID0gcGFyc2VGbG9hdChzdHlsZXMuYm9yZGVyTGVmdFdpZHRoKTtcblxuICAvLyBJbiBjYXNlcyB3aGVyZSB0aGUgcGFyZW50IGlzIGZpeGVkLCB3ZSBtdXN0IGlnbm9yZSBuZWdhdGl2ZSBzY3JvbGwgaW4gb2Zmc2V0IGNhbGNcbiAgaWYgKGZpeGVkUG9zaXRpb24gJiYgaXNIVE1MKSB7XG4gICAgcGFyZW50UmVjdC50b3AgPSBNYXRoLm1heChwYXJlbnRSZWN0LnRvcCwgMCk7XG4gICAgcGFyZW50UmVjdC5sZWZ0ID0gTWF0aC5tYXgocGFyZW50UmVjdC5sZWZ0LCAwKTtcbiAgfVxuXG4gIGxldCBvZmZzZXRzOiBhbnkgPSBnZXRDbGllbnRSZWN0KHtcbiAgICB0b3A6IGNoaWxkcmVuUmVjdC50b3AgLSBwYXJlbnRSZWN0LnRvcCAtIGJvcmRlclRvcFdpZHRoLFxuICAgIGxlZnQ6IGNoaWxkcmVuUmVjdC5sZWZ0IC0gcGFyZW50UmVjdC5sZWZ0IC0gYm9yZGVyTGVmdFdpZHRoLFxuICAgIHdpZHRoOiBjaGlsZHJlblJlY3Qud2lkdGgsXG4gICAgaGVpZ2h0OiBjaGlsZHJlblJlY3QuaGVpZ2h0XG4gIH0pO1xuXG4gIG9mZnNldHMubWFyZ2luVG9wID0gMDtcbiAgb2Zmc2V0cy5tYXJnaW5MZWZ0ID0gMDtcblxuICAvLyBTdWJ0cmFjdCBtYXJnaW5zIG9mIGRvY3VtZW50RWxlbWVudCBpbiBjYXNlIGl0J3MgYmVpbmcgdXNlZCBhcyBwYXJlbnRcbiAgLy8gd2UgZG8gdGhpcyBvbmx5IG9uIEhUTUwgYmVjYXVzZSBpdCdzIHRoZSBvbmx5IGVsZW1lbnQgdGhhdCBiZWhhdmVzXG4gIC8vIGRpZmZlcmVudGx5IHdoZW4gbWFyZ2lucyBhcmUgYXBwbGllZCB0byBpdC4gVGhlIG1hcmdpbnMgYXJlIGluY2x1ZGVkIGluXG4gIC8vIHRoZSBib3ggb2YgdGhlIGRvY3VtZW50RWxlbWVudCwgaW4gdGhlIG90aGVyIGNhc2VzIG5vdC5cbiAgaWYgKCFpc0lFMTAgJiYgaXNIVE1MKSB7XG4gICAgY29uc3QgbWFyZ2luVG9wID0gcGFyc2VGbG9hdChzdHlsZXMubWFyZ2luVG9wKTtcbiAgICBjb25zdCBtYXJnaW5MZWZ0ID0gcGFyc2VGbG9hdChzdHlsZXMubWFyZ2luTGVmdCk7XG5cbiAgICBvZmZzZXRzLnRvcCAtPSBib3JkZXJUb3BXaWR0aCAtIG1hcmdpblRvcDtcbiAgICBvZmZzZXRzLmJvdHRvbSAtPSBib3JkZXJUb3BXaWR0aCAtIG1hcmdpblRvcDtcbiAgICBvZmZzZXRzLmxlZnQgLT0gYm9yZGVyTGVmdFdpZHRoIC0gbWFyZ2luTGVmdDtcbiAgICBvZmZzZXRzLnJpZ2h0IC09IGJvcmRlckxlZnRXaWR0aCAtIG1hcmdpbkxlZnQ7XG5cbiAgICAvLyBBdHRhY2ggbWFyZ2luVG9wIGFuZCBtYXJnaW5MZWZ0IGJlY2F1c2UgaW4gc29tZSBjaXJjdW1zdGFuY2VzIHdlIG1heSBuZWVkIHRoZW1cbiAgICBvZmZzZXRzLm1hcmdpblRvcCA9IG1hcmdpblRvcDtcbiAgICBvZmZzZXRzLm1hcmdpbkxlZnQgPSBtYXJnaW5MZWZ0O1xuICB9XG5cbiAgaWYgKFxuICAgIGlzSUUxMCAmJiAhZml4ZWRQb3NpdGlvblxuICAgICAgPyBwYXJlbnQuY29udGFpbnMoc2Nyb2xsUGFyZW50KVxuICAgICAgOiBwYXJlbnQgPT09IHNjcm9sbFBhcmVudCAmJiBzY3JvbGxQYXJlbnQubm9kZU5hbWUgIT09ICdCT0RZJ1xuICApIHtcbiAgICBvZmZzZXRzID0gaW5jbHVkZVNjcm9sbChvZmZzZXRzLCBwYXJlbnQpO1xuICB9XG5cbiAgcmV0dXJuIG9mZnNldHM7XG59XG4iXX0=