/**
 * <md-progress-bar> component.
 */
import * as ɵngcc0 from '@angular/core';
export declare class ProgressBarComponent {
    /** Color of the progress bar. */
    color: 'primary' | 'accent' | 'warn';
    private _value;
    /** Value of the progressbar. Defaults to zero. Mirrored to aria-valuenow. */
    value: number;
    private _bufferValue;
    /** Buffer value of the progress bar. Defaults to zero. */
    bufferValue: number;
    /**
     * Mode of the progress bar.
     *
     * Input must be one of these values: determinate, indeterminate, buffer, query, defaults to
     * 'determinate'.
     * Mirrored to mode attribute.
     */
    mode: 'determinate' | 'indeterminate' | 'buffer' | 'query';
    /** Gets the current transform value for the progress bar's primary indicator. */
    _primaryTransform(): {
        transform: string;
    };
    /**
     * Gets the current transform value for the progress bar's buffer indicator.  Only used if the
     * progress mode is set to buffer, otherwise returns an undefined, causing no transformation.
     */
    _bufferTransform(): {
        transform: string;
    } | undefined;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ProgressBarComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<ProgressBarComponent, "mdb-progress-bar, mat-progress-bar", never, { "color": "color"; "mode": "mode"; "value": "value"; "bufferValue": "bufferValue"; }, {}, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3NiYXIuY29tcG9uZW50LmQudHMiLCJzb3VyY2VzIjpbInByb2dyZXNzYmFyLmNvbXBvbmVudC5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTRCQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogPG1kLXByb2dyZXNzLWJhcj4gY29tcG9uZW50LlxuICovXG5leHBvcnQgZGVjbGFyZSBjbGFzcyBQcm9ncmVzc0JhckNvbXBvbmVudCB7XG4gICAgLyoqIENvbG9yIG9mIHRoZSBwcm9ncmVzcyBiYXIuICovXG4gICAgY29sb3I6ICdwcmltYXJ5JyB8ICdhY2NlbnQnIHwgJ3dhcm4nO1xuICAgIHByaXZhdGUgX3ZhbHVlO1xuICAgIC8qKiBWYWx1ZSBvZiB0aGUgcHJvZ3Jlc3NiYXIuIERlZmF1bHRzIHRvIHplcm8uIE1pcnJvcmVkIHRvIGFyaWEtdmFsdWVub3cuICovXG4gICAgdmFsdWU6IG51bWJlcjtcbiAgICBwcml2YXRlIF9idWZmZXJWYWx1ZTtcbiAgICAvKiogQnVmZmVyIHZhbHVlIG9mIHRoZSBwcm9ncmVzcyBiYXIuIERlZmF1bHRzIHRvIHplcm8uICovXG4gICAgYnVmZmVyVmFsdWU6IG51bWJlcjtcbiAgICAvKipcbiAgICAgKiBNb2RlIG9mIHRoZSBwcm9ncmVzcyBiYXIuXG4gICAgICpcbiAgICAgKiBJbnB1dCBtdXN0IGJlIG9uZSBvZiB0aGVzZSB2YWx1ZXM6IGRldGVybWluYXRlLCBpbmRldGVybWluYXRlLCBidWZmZXIsIHF1ZXJ5LCBkZWZhdWx0cyB0b1xuICAgICAqICdkZXRlcm1pbmF0ZScuXG4gICAgICogTWlycm9yZWQgdG8gbW9kZSBhdHRyaWJ1dGUuXG4gICAgICovXG4gICAgbW9kZTogJ2RldGVybWluYXRlJyB8ICdpbmRldGVybWluYXRlJyB8ICdidWZmZXInIHwgJ3F1ZXJ5JztcbiAgICAvKiogR2V0cyB0aGUgY3VycmVudCB0cmFuc2Zvcm0gdmFsdWUgZm9yIHRoZSBwcm9ncmVzcyBiYXIncyBwcmltYXJ5IGluZGljYXRvci4gKi9cbiAgICBfcHJpbWFyeVRyYW5zZm9ybSgpOiB7XG4gICAgICAgIHRyYW5zZm9ybTogc3RyaW5nO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgY3VycmVudCB0cmFuc2Zvcm0gdmFsdWUgZm9yIHRoZSBwcm9ncmVzcyBiYXIncyBidWZmZXIgaW5kaWNhdG9yLiAgT25seSB1c2VkIGlmIHRoZVxuICAgICAqIHByb2dyZXNzIG1vZGUgaXMgc2V0IHRvIGJ1ZmZlciwgb3RoZXJ3aXNlIHJldHVybnMgYW4gdW5kZWZpbmVkLCBjYXVzaW5nIG5vIHRyYW5zZm9ybWF0aW9uLlxuICAgICAqL1xuICAgIF9idWZmZXJUcmFuc2Zvcm0oKToge1xuICAgICAgICB0cmFuc2Zvcm06IHN0cmluZztcbiAgICB9IHwgdW5kZWZpbmVkO1xufVxuIl19