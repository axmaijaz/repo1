import { BarComponent } from './bar.component';
import * as ɵngcc0 from '@angular/core';
export declare class ProgressDirective {
    /** if `true` changing value of progress bar will be animated (note: not supported by Bootstrap 4) */
    animate: boolean;
    /** maximum total value of progress element */
    max: number;
    addClass: boolean;
    bars: any[];
    protected _max: number;
    addBar(bar: BarComponent): void;
    removeBar(bar: BarComponent): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ProgressDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<ProgressDirective, "mdbProgress, [mdbProgress]", never, { "max": "max"; "animate": "animate"; }, {}, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3MuZGlyZWN0aXZlLmQudHMiLCJzb3VyY2VzIjpbInByb2dyZXNzLmRpcmVjdGl2ZS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFVQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJhckNvbXBvbmVudCB9IGZyb20gJy4vYmFyLmNvbXBvbmVudCc7XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBQcm9ncmVzc0RpcmVjdGl2ZSB7XG4gICAgLyoqIGlmIGB0cnVlYCBjaGFuZ2luZyB2YWx1ZSBvZiBwcm9ncmVzcyBiYXIgd2lsbCBiZSBhbmltYXRlZCAobm90ZTogbm90IHN1cHBvcnRlZCBieSBCb290c3RyYXAgNCkgKi9cbiAgICBhbmltYXRlOiBib29sZWFuO1xuICAgIC8qKiBtYXhpbXVtIHRvdGFsIHZhbHVlIG9mIHByb2dyZXNzIGVsZW1lbnQgKi9cbiAgICBtYXg6IG51bWJlcjtcbiAgICBhZGRDbGFzczogYm9vbGVhbjtcbiAgICBiYXJzOiBhbnlbXTtcbiAgICBwcm90ZWN0ZWQgX21heDogbnVtYmVyO1xuICAgIGFkZEJhcihiYXI6IEJhckNvbXBvbmVudCk6IHZvaWQ7XG4gICAgcmVtb3ZlQmFyKGJhcjogQmFyQ29tcG9uZW50KTogdm9pZDtcbn1cbiJdfQ==