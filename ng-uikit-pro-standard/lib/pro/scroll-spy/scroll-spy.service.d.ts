import { QueryList } from '@angular/core';
import { ScrollSpyLinkDirective } from './scroll-spy-link.directive';
import { Observable } from 'rxjs';
import * as ɵngcc0 from '@angular/core';
export interface ScrollSpy {
    id: string;
    links: QueryList<ScrollSpyLinkDirective>;
}
export declare class ScrollSpyService {
    private scrollSpys;
    private activeSubject;
    active$: Observable<any>;
    addScrollSpy(scrollSpy: ScrollSpy): void;
    removeScrollSpy(scrollSpyId: string): void;
    updateActiveState(scrollSpyId: string, activeLinkId: string): void;
    removeActiveState(scrollSpyId: string, activeLinkId: string): void;
    setActiveLink(activeLink: ScrollSpyLinkDirective | any): void;
    removeActiveLinks(scrollSpyId: string): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ScrollSpyService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<ScrollSpyService>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLXNweS5zZXJ2aWNlLmQudHMiLCJzb3VyY2VzIjpbInNjcm9sbC1zcHkuc2VydmljZS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFjQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFF1ZXJ5TGlzdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU2Nyb2xsU3B5TGlua0RpcmVjdGl2ZSB9IGZyb20gJy4vc2Nyb2xsLXNweS1saW5rLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5leHBvcnQgaW50ZXJmYWNlIFNjcm9sbFNweSB7XG4gICAgaWQ6IHN0cmluZztcbiAgICBsaW5rczogUXVlcnlMaXN0PFNjcm9sbFNweUxpbmtEaXJlY3RpdmU+O1xufVxuZXhwb3J0IGRlY2xhcmUgY2xhc3MgU2Nyb2xsU3B5U2VydmljZSB7XG4gICAgcHJpdmF0ZSBzY3JvbGxTcHlzO1xuICAgIHByaXZhdGUgYWN0aXZlU3ViamVjdDtcbiAgICBhY3RpdmUkOiBPYnNlcnZhYmxlPGFueT47XG4gICAgYWRkU2Nyb2xsU3B5KHNjcm9sbFNweTogU2Nyb2xsU3B5KTogdm9pZDtcbiAgICByZW1vdmVTY3JvbGxTcHkoc2Nyb2xsU3B5SWQ6IHN0cmluZyk6IHZvaWQ7XG4gICAgdXBkYXRlQWN0aXZlU3RhdGUoc2Nyb2xsU3B5SWQ6IHN0cmluZywgYWN0aXZlTGlua0lkOiBzdHJpbmcpOiB2b2lkO1xuICAgIHJlbW92ZUFjdGl2ZVN0YXRlKHNjcm9sbFNweUlkOiBzdHJpbmcsIGFjdGl2ZUxpbmtJZDogc3RyaW5nKTogdm9pZDtcbiAgICBzZXRBY3RpdmVMaW5rKGFjdGl2ZUxpbms6IFNjcm9sbFNweUxpbmtEaXJlY3RpdmUgfCBhbnkpOiB2b2lkO1xuICAgIHJlbW92ZUFjdGl2ZUxpbmtzKHNjcm9sbFNweUlkOiBzdHJpbmcpOiB2b2lkO1xufVxuIl19