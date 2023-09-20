import { ProgressbarConfigComponent } from './progressbar.config.component';
import * as ɵngcc0 from '@angular/core';
export declare class ProgressbarComponent {
    /** if `true` changing value of progress bar will be animated (note: not supported by Bootstrap 4) */
    animate: boolean;
    /** maximum total value of progress element */
    max: number;
    /** provide one of the four supported contextual classes: `success`, `info`, `warning`, `danger` */
    type: string;
    /** current value of progress bar */
    value: number;
    constructor(config: ProgressbarConfigComponent);
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ProgressbarComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<ProgressbarComponent, "mdb-progressbar, mdb-progress", never, { "animate": "animate"; "max": "max"; "type": "type"; "value": "value"; }, {}, never, ["*"]>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3NiYXIuY29tcG9uZW50LmQudHMiLCJzb3VyY2VzIjpbInByb2dyZXNzYmFyLmNvbXBvbmVudC5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFVQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByb2dyZXNzYmFyQ29uZmlnQ29tcG9uZW50IH0gZnJvbSAnLi9wcm9ncmVzc2Jhci5jb25maWcuY29tcG9uZW50JztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIFByb2dyZXNzYmFyQ29tcG9uZW50IHtcbiAgICAvKiogaWYgYHRydWVgIGNoYW5naW5nIHZhbHVlIG9mIHByb2dyZXNzIGJhciB3aWxsIGJlIGFuaW1hdGVkIChub3RlOiBub3Qgc3VwcG9ydGVkIGJ5IEJvb3RzdHJhcCA0KSAqL1xuICAgIGFuaW1hdGU6IGJvb2xlYW47XG4gICAgLyoqIG1heGltdW0gdG90YWwgdmFsdWUgb2YgcHJvZ3Jlc3MgZWxlbWVudCAqL1xuICAgIG1heDogbnVtYmVyO1xuICAgIC8qKiBwcm92aWRlIG9uZSBvZiB0aGUgZm91ciBzdXBwb3J0ZWQgY29udGV4dHVhbCBjbGFzc2VzOiBgc3VjY2Vzc2AsIGBpbmZvYCwgYHdhcm5pbmdgLCBgZGFuZ2VyYCAqL1xuICAgIHR5cGU6IHN0cmluZztcbiAgICAvKiogY3VycmVudCB2YWx1ZSBvZiBwcm9ncmVzcyBiYXIgKi9cbiAgICB2YWx1ZTogbnVtYmVyO1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogUHJvZ3Jlc3NiYXJDb25maWdDb21wb25lbnQpO1xufVxuIl19