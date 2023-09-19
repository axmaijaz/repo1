import { NavbarService } from './navbar.service';
import { AfterContentInit, ElementRef, QueryList, EventEmitter, Renderer2 } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare class LinksComponent implements AfterContentInit {
    private _navbarService;
    private renderer;
    links: QueryList<ElementRef>;
    linkClick: EventEmitter<any>;
    constructor(_navbarService: NavbarService, renderer: Renderer2);
    ngAfterContentInit(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<LinksComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<LinksComponent, "links", never, {}, { "linkClick": "linkClick"; }, ["links"], ["*"]>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlua3MuY29tcG9uZW50LmQudHMiLCJzb3VyY2VzIjpbImxpbmtzLmNvbXBvbmVudC5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUFFQTs7Ozs7Ozs7O0FBT0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOYXZiYXJTZXJ2aWNlIH0gZnJvbSAnLi9uYXZiYXIuc2VydmljZSc7XG5pbXBvcnQgeyBBZnRlckNvbnRlbnRJbml0LCBFbGVtZW50UmVmLCBRdWVyeUxpc3QsIEV2ZW50RW1pdHRlciwgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBMaW5rc0NvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQge1xuICAgIHByaXZhdGUgX25hdmJhclNlcnZpY2U7XG4gICAgcHJpdmF0ZSByZW5kZXJlcjtcbiAgICBsaW5rczogUXVlcnlMaXN0PEVsZW1lbnRSZWY+O1xuICAgIGxpbmtDbGljazogRXZlbnRFbWl0dGVyPGFueT47XG4gICAgY29uc3RydWN0b3IoX25hdmJhclNlcnZpY2U6IE5hdmJhclNlcnZpY2UsIHJlbmRlcmVyOiBSZW5kZXJlcjIpO1xuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpOiB2b2lkO1xufVxuIl19