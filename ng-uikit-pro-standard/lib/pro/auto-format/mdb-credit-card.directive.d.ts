import * as ɵngcc0 from '@angular/core';
export interface CreditCard {
    name: string;
    fullName: string;
    re: RegExp;
    pattern: RegExp;
    maxLength: number;
    cvvLength: number;
}
export declare class MdbCreditCardDirective {
    private standardPattern;
    cardName: string;
    cardFullName: string;
    private defaultCard;
    private cards;
    additionalCards: CreditCard[];
    private _additionalCards;
    separator: string;
    private _separator;
    constructor();
    maxLength: string;
    onInput(event: any): void;
    private formatInput;
    private getFormattedInput;
    private removeNonDigits;
    private hasStandardPattern;
    private isMatch;
    private updateCurrentCardNames;
    private findCardByNumber;
    addCards(newCards: CreditCard[]): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MdbCreditCardDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<MdbCreditCardDirective, "[mdbCreditCard]", ["mdbCreditCard"], { "additionalCards": "additionalCards"; "separator": "separator"; }, {}, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWRiLWNyZWRpdC1jYXJkLmRpcmVjdGl2ZS5kLnRzIiwic291cmNlcyI6WyJtZGItY3JlZGl0LWNhcmQuZGlyZWN0aXZlLmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNkJBIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBDcmVkaXRDYXJkIHtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgZnVsbE5hbWU6IHN0cmluZztcbiAgICByZTogUmVnRXhwO1xuICAgIHBhdHRlcm46IFJlZ0V4cDtcbiAgICBtYXhMZW5ndGg6IG51bWJlcjtcbiAgICBjdnZMZW5ndGg6IG51bWJlcjtcbn1cbmV4cG9ydCBkZWNsYXJlIGNsYXNzIE1kYkNyZWRpdENhcmREaXJlY3RpdmUge1xuICAgIHByaXZhdGUgc3RhbmRhcmRQYXR0ZXJuO1xuICAgIGNhcmROYW1lOiBzdHJpbmc7XG4gICAgY2FyZEZ1bGxOYW1lOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBkZWZhdWx0Q2FyZDtcbiAgICBwcml2YXRlIGNhcmRzO1xuICAgIGFkZGl0aW9uYWxDYXJkczogQ3JlZGl0Q2FyZFtdO1xuICAgIHByaXZhdGUgX2FkZGl0aW9uYWxDYXJkcztcbiAgICBzZXBhcmF0b3I6IHN0cmluZztcbiAgICBwcml2YXRlIF9zZXBhcmF0b3I7XG4gICAgY29uc3RydWN0b3IoKTtcbiAgICBtYXhMZW5ndGg6IHN0cmluZztcbiAgICBvbklucHV0KGV2ZW50OiBhbnkpOiB2b2lkO1xuICAgIHByaXZhdGUgZm9ybWF0SW5wdXQ7XG4gICAgcHJpdmF0ZSBnZXRGb3JtYXR0ZWRJbnB1dDtcbiAgICBwcml2YXRlIHJlbW92ZU5vbkRpZ2l0cztcbiAgICBwcml2YXRlIGhhc1N0YW5kYXJkUGF0dGVybjtcbiAgICBwcml2YXRlIGlzTWF0Y2g7XG4gICAgcHJpdmF0ZSB1cGRhdGVDdXJyZW50Q2FyZE5hbWVzO1xuICAgIHByaXZhdGUgZmluZENhcmRCeU51bWJlcjtcbiAgICBhZGRDYXJkcyhuZXdDYXJkczogQ3JlZGl0Q2FyZFtdKTogdm9pZDtcbn1cbiJdfQ==