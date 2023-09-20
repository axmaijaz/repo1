import { ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ModalOptions } from './modal.options';
import * as ɵngcc0 from '@angular/core';
export declare class ModalContainerComponent implements OnInit, OnDestroy {
    private _renderer;
    modalClass: string;
    tabindex: number;
    role: string;
    modal: boolean;
    private mdbModalService;
    config: ModalOptions;
    isShown: boolean;
    level: number;
    isAnimated: boolean;
    protected _element: ElementRef;
    private isModalHiding;
    private utils;
    onClick(event: any): void;
    onEsc(): void;
    onKeyDown(event: any): void;
    constructor(options: ModalOptions, _element: ElementRef, _renderer: Renderer2);
    ngOnInit(): void;
    focusModalElement(): void;
    updateContainerClass(): void;
    ngOnDestroy(): void;
    hide(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ModalContainerComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<ModalContainerComponent, "mdb-modal-container", never, {}, {}, never, ["*"]>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWxDb250YWluZXIuY29tcG9uZW50LmQudHMiLCJzb3VyY2VzIjpbIm1vZGFsQ29udGFpbmVyLmNvbXBvbmVudC5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVCQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVsZW1lbnRSZWYsIE9uRGVzdHJveSwgT25Jbml0LCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1vZGFsT3B0aW9ucyB9IGZyb20gJy4vbW9kYWwub3B0aW9ucyc7XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBNb2RhbENvbnRhaW5lckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgICBwcml2YXRlIF9yZW5kZXJlcjtcbiAgICBtb2RhbENsYXNzOiBzdHJpbmc7XG4gICAgdGFiaW5kZXg6IG51bWJlcjtcbiAgICByb2xlOiBzdHJpbmc7XG4gICAgbW9kYWw6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSBtZGJNb2RhbFNlcnZpY2U7XG4gICAgY29uZmlnOiBNb2RhbE9wdGlvbnM7XG4gICAgaXNTaG93bjogYm9vbGVhbjtcbiAgICBsZXZlbDogbnVtYmVyO1xuICAgIGlzQW5pbWF0ZWQ6IGJvb2xlYW47XG4gICAgcHJvdGVjdGVkIF9lbGVtZW50OiBFbGVtZW50UmVmO1xuICAgIHByaXZhdGUgaXNNb2RhbEhpZGluZztcbiAgICBwcml2YXRlIHV0aWxzO1xuICAgIG9uQ2xpY2soZXZlbnQ6IGFueSk6IHZvaWQ7XG4gICAgb25Fc2MoKTogdm9pZDtcbiAgICBvbktleURvd24oZXZlbnQ6IGFueSk6IHZvaWQ7XG4gICAgY29uc3RydWN0b3Iob3B0aW9uczogTW9kYWxPcHRpb25zLCBfZWxlbWVudDogRWxlbWVudFJlZiwgX3JlbmRlcmVyOiBSZW5kZXJlcjIpO1xuICAgIG5nT25Jbml0KCk6IHZvaWQ7XG4gICAgZm9jdXNNb2RhbEVsZW1lbnQoKTogdm9pZDtcbiAgICB1cGRhdGVDb250YWluZXJDbGFzcygpOiB2b2lkO1xuICAgIG5nT25EZXN0cm95KCk6IHZvaWQ7XG4gICAgaGlkZSgpOiB2b2lkO1xufVxuIl19