import { ɵɵdefineInjectable } from './interface/defs';
import { Type } from '../interface/type';
import { assertLessThan } from '../util/assert';
import { InjectorMarkers } from './injector_marker';
import { Injector } from './injector';

export class InjectionToken<T> {
    /** @internal */
    readonly ngMetadataName = 'InjectionToken';

    readonly ɵprov: unknown;

    constructor(protected _desc: string, options?: {
        providedIn?: Type<any>|'root'|'platform'|'any'|null, factory: () => T
    }) {
        this.ɵprov = undefined;
        if (typeof options == 'number') {
            (typeof ngDevMode === 'undefined' || ngDevMode) &&
            assertLessThan(options, 0, 'Only negative numbers are supported here');
            // This is a special hack to assign __NG_ELEMENT_ID__ to this instance.
            // See `InjectorMarkers`
            (this as any).__NG_ELEMENT_ID__ = options;
        } else if (options !== undefined) {
            this.ɵprov = ɵɵdefineInjectable({
                token: this,
                providedIn: options.providedIn || 'root',
                factory: options.factory,
            });
        }
    }

    toString(): string {
        return `InjectionToken ${this._desc}`;
    }
}

export const INJECTOR = new InjectionToken<Injector>(
    'INJECTOR',
    InjectorMarkers.Injector as any,
);
