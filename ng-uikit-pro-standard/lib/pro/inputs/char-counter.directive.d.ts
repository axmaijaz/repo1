import { OnInit, ElementRef, Renderer2 } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare class CharCounterDirective implements OnInit {
    private _elRef;
    private _renderer;
    length: number;
    textContainer: any;
    constructor(_elRef: ElementRef, _renderer: Renderer2);
    ngOnInit(): void;
    onKeyUp(): void;
    hide(): void;
    show(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CharCounterDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<CharCounterDirective, "[mdbCharCounter]", never, { "length": "length"; }, {}, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhci1jb3VudGVyLmRpcmVjdGl2ZS5kLnRzIiwic291cmNlcyI6WyJjaGFyLWNvdW50ZXIuZGlyZWN0aXZlLmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBQ0E7Ozs7Ozs7Ozs7OztBQVVBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT25Jbml0LCBFbGVtZW50UmVmLCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIENoYXJDb3VudGVyRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBwcml2YXRlIF9lbFJlZjtcbiAgICBwcml2YXRlIF9yZW5kZXJlcjtcbiAgICBsZW5ndGg6IG51bWJlcjtcbiAgICB0ZXh0Q29udGFpbmVyOiBhbnk7XG4gICAgY29uc3RydWN0b3IoX2VsUmVmOiBFbGVtZW50UmVmLCBfcmVuZGVyZXI6IFJlbmRlcmVyMik7XG4gICAgbmdPbkluaXQoKTogdm9pZDtcbiAgICBvbktleVVwKCk6IHZvaWQ7XG4gICAgaGlkZSgpOiB2b2lkO1xuICAgIHNob3coKTogdm9pZDtcbn1cbiJdfQ==