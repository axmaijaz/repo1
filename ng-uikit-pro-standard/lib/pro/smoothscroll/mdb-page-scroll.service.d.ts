import { PageScrollInstance } from './mdb-page-scroll.instance';
import * as ɵngcc0 from '@angular/core';
export declare class PageScrollService {
    private static instanceCounter;
    private runningInstances;
    private onInterrupted;
    private stopInternal;
    /**
     * Start a scroll animation. All properties of the animation are stored in the given {@link PageScrollInstance} object.
     *
     * This is the core functionality of the whole library.
     *
     */
    start(pageScrollInstance: PageScrollInstance): void;
    /**
     * Stop all running scroll animations. Optionally limit to stop only the ones of specific namespace.
     *
     */
    stopAll(namespace?: string | any): boolean;
    stop(pageScrollInstance: PageScrollInstance): boolean;
    constructor();
    static ɵfac: ɵngcc0.ɵɵFactoryDef<PageScrollService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<PageScrollService>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWRiLXBhZ2Utc2Nyb2xsLnNlcnZpY2UuZC50cyIsInNvdXJjZXMiOlsibWRiLXBhZ2Utc2Nyb2xsLnNlcnZpY2UuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGFnZVNjcm9sbEluc3RhbmNlIH0gZnJvbSAnLi9tZGItcGFnZS1zY3JvbGwuaW5zdGFuY2UnO1xuZXhwb3J0IGRlY2xhcmUgY2xhc3MgUGFnZVNjcm9sbFNlcnZpY2Uge1xuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlQ291bnRlcjtcbiAgICBwcml2YXRlIHJ1bm5pbmdJbnN0YW5jZXM7XG4gICAgcHJpdmF0ZSBvbkludGVycnVwdGVkO1xuICAgIHByaXZhdGUgc3RvcEludGVybmFsO1xuICAgIC8qKlxuICAgICAqIFN0YXJ0IGEgc2Nyb2xsIGFuaW1hdGlvbi4gQWxsIHByb3BlcnRpZXMgb2YgdGhlIGFuaW1hdGlvbiBhcmUgc3RvcmVkIGluIHRoZSBnaXZlbiB7QGxpbmsgUGFnZVNjcm9sbEluc3RhbmNlfSBvYmplY3QuXG4gICAgICpcbiAgICAgKiBUaGlzIGlzIHRoZSBjb3JlIGZ1bmN0aW9uYWxpdHkgb2YgdGhlIHdob2xlIGxpYnJhcnkuXG4gICAgICpcbiAgICAgKi9cbiAgICBzdGFydChwYWdlU2Nyb2xsSW5zdGFuY2U6IFBhZ2VTY3JvbGxJbnN0YW5jZSk6IHZvaWQ7XG4gICAgLyoqXG4gICAgICogU3RvcCBhbGwgcnVubmluZyBzY3JvbGwgYW5pbWF0aW9ucy4gT3B0aW9uYWxseSBsaW1pdCB0byBzdG9wIG9ubHkgdGhlIG9uZXMgb2Ygc3BlY2lmaWMgbmFtZXNwYWNlLlxuICAgICAqXG4gICAgICovXG4gICAgc3RvcEFsbChuYW1lc3BhY2U/OiBzdHJpbmcgfCBhbnkpOiBib29sZWFuO1xuICAgIHN0b3AocGFnZVNjcm9sbEluc3RhbmNlOiBQYWdlU2Nyb2xsSW5zdGFuY2UpOiBib29sZWFuO1xuICAgIGNvbnN0cnVjdG9yKCk7XG59XG4iXX0=