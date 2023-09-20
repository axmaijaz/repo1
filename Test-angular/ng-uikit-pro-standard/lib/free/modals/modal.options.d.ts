import * as ɵngcc0 from '@angular/core';
export declare class ModalOptions {
    /**
     *  Includes a modal-backdrop element. Alternatively, specify static for a backdrop which doesn't close the modal on click.
     */
    backdrop?: boolean | 'static' | any;
    /**
     * Closes the modal when escape key is pressed.
     */
    keyboard?: boolean;
    focus?: boolean;
    /**
     * Shows the modal when initialized.
     */
    show?: boolean;
    /**
     * Ignore the backdrop click
     */
    ignoreBackdropClick?: boolean;
    /**
     * Css class for opened modal
     */
    class?: string;
    /**
     * Toggle animation
     */
    containerClass?: string;
    animated?: boolean;
    scroll?: boolean;
    data?: Object;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ModalOptions, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<ModalOptions>;
}
export declare class MDBModalRef {
    /**
     * Reference to a component inside the modal. Null if modal's been created with TemplateRef
     */
    content?: any | null;
    /**
     * Hides the modal
     */
    hide(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MDBModalRef, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<MDBModalRef>;
}
export declare const modalConfigDefaults: ModalOptions;
export declare const ClassName: any;
export declare const Selector: any;
export declare const TransitionDurations: any;
export declare const DISMISS_REASONS: {
    BACKRDOP: string;
    ESC: string;
};

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwub3B0aW9ucy5kLnRzIiwic291cmNlcyI6WyJtb2RhbC5vcHRpb25zLmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNkJBOzs7Ozs7Ozs7Ozs7QUFVQSIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWNsYXJlIGNsYXNzIE1vZGFsT3B0aW9ucyB7XG4gICAgLyoqXG4gICAgICogIEluY2x1ZGVzIGEgbW9kYWwtYmFja2Ryb3AgZWxlbWVudC4gQWx0ZXJuYXRpdmVseSwgc3BlY2lmeSBzdGF0aWMgZm9yIGEgYmFja2Ryb3Agd2hpY2ggZG9lc24ndCBjbG9zZSB0aGUgbW9kYWwgb24gY2xpY2suXG4gICAgICovXG4gICAgYmFja2Ryb3A/OiBib29sZWFuIHwgJ3N0YXRpYycgfCBhbnk7XG4gICAgLyoqXG4gICAgICogQ2xvc2VzIHRoZSBtb2RhbCB3aGVuIGVzY2FwZSBrZXkgaXMgcHJlc3NlZC5cbiAgICAgKi9cbiAgICBrZXlib2FyZD86IGJvb2xlYW47XG4gICAgZm9jdXM/OiBib29sZWFuO1xuICAgIC8qKlxuICAgICAqIFNob3dzIHRoZSBtb2RhbCB3aGVuIGluaXRpYWxpemVkLlxuICAgICAqL1xuICAgIHNob3c/OiBib29sZWFuO1xuICAgIC8qKlxuICAgICAqIElnbm9yZSB0aGUgYmFja2Ryb3AgY2xpY2tcbiAgICAgKi9cbiAgICBpZ25vcmVCYWNrZHJvcENsaWNrPzogYm9vbGVhbjtcbiAgICAvKipcbiAgICAgKiBDc3MgY2xhc3MgZm9yIG9wZW5lZCBtb2RhbFxuICAgICAqL1xuICAgIGNsYXNzPzogc3RyaW5nO1xuICAgIC8qKlxuICAgICAqIFRvZ2dsZSBhbmltYXRpb25cbiAgICAgKi9cbiAgICBjb250YWluZXJDbGFzcz86IHN0cmluZztcbiAgICBhbmltYXRlZD86IGJvb2xlYW47XG4gICAgc2Nyb2xsPzogYm9vbGVhbjtcbiAgICBkYXRhPzogT2JqZWN0O1xufVxuZXhwb3J0IGRlY2xhcmUgY2xhc3MgTURCTW9kYWxSZWYge1xuICAgIC8qKlxuICAgICAqIFJlZmVyZW5jZSB0byBhIGNvbXBvbmVudCBpbnNpZGUgdGhlIG1vZGFsLiBOdWxsIGlmIG1vZGFsJ3MgYmVlbiBjcmVhdGVkIHdpdGggVGVtcGxhdGVSZWZcbiAgICAgKi9cbiAgICBjb250ZW50PzogYW55IHwgbnVsbDtcbiAgICAvKipcbiAgICAgKiBIaWRlcyB0aGUgbW9kYWxcbiAgICAgKi9cbiAgICBoaWRlKCk6IHZvaWQ7XG59XG5leHBvcnQgZGVjbGFyZSBjb25zdCBtb2RhbENvbmZpZ0RlZmF1bHRzOiBNb2RhbE9wdGlvbnM7XG5leHBvcnQgZGVjbGFyZSBjb25zdCBDbGFzc05hbWU6IGFueTtcbmV4cG9ydCBkZWNsYXJlIGNvbnN0IFNlbGVjdG9yOiBhbnk7XG5leHBvcnQgZGVjbGFyZSBjb25zdCBUcmFuc2l0aW9uRHVyYXRpb25zOiBhbnk7XG5leHBvcnQgZGVjbGFyZSBjb25zdCBESVNNSVNTX1JFQVNPTlM6IHtcbiAgICBCQUNLUkRPUDogc3RyaW5nO1xuICAgIEVTQzogc3RyaW5nO1xufTtcbiJdfQ==