import { ProviderToken } from './provider_token';
import { InjectFlags } from '../interface/injector';
import { getInjectableDef, ɵɵInjectableDeclaration } from './interface/defs';
import { stringify } from '../util/stringify';
import { throwProviderNotFoundError } from '../render3/errors_di';

let _injectImplementation: (<T>(token: ProviderToken<T>, flags?: InjectFlags) => T | null)|
    undefined;
export function getInjectImplementation() {
    return _injectImplementation;
}

export function injectRootLimpMode<T>(
    token: ProviderToken<T>, notFoundValue: T|undefined, flags: InjectFlags): T|null {
    const injectableDef: ɵɵInjectableDeclaration<T>|null = getInjectableDef(token);
    if (injectableDef && injectableDef.providedIn == 'root') {
        return injectableDef.value === undefined ? injectableDef.value = injectableDef.factory() :
            injectableDef.value;
    }
    if (flags & InjectFlags.Optional) return null;
    if (notFoundValue !== undefined) return notFoundValue;
    throwProviderNotFoundError(stringify(token), 'Injector');
}
