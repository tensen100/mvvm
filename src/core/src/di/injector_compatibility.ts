import { ProviderToken } from './provider_token';
import { DecoratorFlags, InjectFlags, InternalInjectFlags } from '../interface/injector';
import { getInjectImplementation, injectRootLimpMode } from './inject_switch';
import { resolveForwardRef } from './forward_ref';
import { Injector } from './injector';
import { stringify } from '../util/stringify';
import { getClosureSafeProperty } from '../util/property';
import { ValueProvider } from './interface/provider';
import { Type } from '../interface/type';

const _THROW_IF_NOT_FOUND = {};
export const THROW_IF_NOT_FOUND = _THROW_IF_NOT_FOUND;

const DI_DECORATOR_FLAG = '__NG_DI_FLAG__';

export const NG_TEMP_TOKEN_PATH = 'ngTempTokenPath';
const NG_TOKEN_PATH = 'ngTokenPath';
export const SOURCE = '__source';
const NO_NEW_LINE = 'ɵ';
const NEW_LINE = /\n/gm;

export const USE_VALUE =
    getClosureSafeProperty<ValueProvider>({provide: String, useValue: getClosureSafeProperty});


let _currentInjector: Injector|undefined|null = undefined;

export function setCurrentInjector(injector: Injector|null|undefined): Injector|undefined|null {
    const former = _currentInjector;
    _currentInjector = injector;
    return former;
}

export function injectInjectorOnly<T>(token: ProviderToken<T>): T;
export function injectInjectorOnly<T>(token: ProviderToken<T>, flags?: InjectFlags): T|null;
export function injectInjectorOnly<T>(token: ProviderToken<T>, flags = InjectFlags.Default): T|
    null {
    if (_currentInjector === undefined) {
        throw new Error(`inject() must be called from an injection context`);
    } else if (_currentInjector === null) {
        return injectRootLimpMode(token, undefined, flags);
    } else {
        return _currentInjector.get(token, flags & InjectFlags.Optional ? null : undefined, flags);
    }
}

export function ɵɵinject<T>(token: ProviderToken<T>): T;
export function ɵɵinject<T>(token: ProviderToken<T>, flags?: InjectFlags): T|null;
export function ɵɵinject<T>(token: ProviderToken<T>, flags = InjectFlags.Default): T|null {
    return (getInjectImplementation() || injectInjectorOnly)(resolveForwardRef(token), flags);
}

export function injectArgs(types: (ProviderToken<any>|any[])[]): any[] {
    const args: any[] = [];
    for (let i = 0; i < types.length; i++) {
        const arg = resolveForwardRef(types[i]);
        if (Array.isArray(arg)) {
            if (arg.length === 0) {
                throw new Error('Arguments array must have arguments.');
            }
            let type: Type<any>|undefined = undefined;
            let flags: InjectFlags = InjectFlags.Default;

            for (let j = 0; j < arg.length; j++) {
                const meta = arg[j];
                const flag = getInjectFlag(meta);
                if (typeof flag === 'number') {
                    // Special case when we handle @Inject decorator.
                    if (flag === DecoratorFlags.Inject) {
                        type = meta.token;
                    } else {
                        flags |= flag;
                    }
                } else {
                    type = meta;
                }
            }

            args.push(ɵɵinject(type!, flags));
        } else {
            args.push(ɵɵinject(arg));
        }
    }
    return args;
}

export function getInjectFlag(token: any): number|undefined {
    return token[DI_DECORATOR_FLAG];
}


export function catchInjectorError(
    e: any, token: any, injectorErrorName: string, source: string|null): never {
    const tokenPath: any[] = e[NG_TEMP_TOKEN_PATH];
    if (token[SOURCE]) {
        tokenPath.unshift(token[SOURCE]);
    }
    e.message = formatError('\n' + e.message, tokenPath, injectorErrorName, source);
    e[NG_TOKEN_PATH] = tokenPath;
    e[NG_TEMP_TOKEN_PATH] = null;
    throw e;
}

export function formatError(
    text: string, obj: any, injectorErrorName: string, source: string|null = null): string {
    text = text && text.charAt(0) === '\n' && text.charAt(1) == NO_NEW_LINE ? text.substr(2) : text;
    let context = stringify(obj);
    if (Array.isArray(obj)) {
        context = obj.map(stringify).join(' -> ');
    } else if (typeof obj === 'object') {
        let parts = <string[]>[];
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                let value = obj[key];
                parts.push(
                    key + ':' + (typeof value === 'string' ? JSON.stringify(value) : stringify(value)));
            }
        }
        context = `{${parts.join(', ')}}`;
    }
    return `${injectorErrorName}${source ? '(' + source + ')' : ''}[${context}]: ${
        text.replace(NEW_LINE, '\n  ')}`;
}

export function attachInjectFlag(decorator: any, flag: InternalInjectFlags|DecoratorFlags): any {
    decorator[DI_DECORATOR_FLAG] = flag;
    decorator.prototype[DI_DECORATOR_FLAG] = flag;
    return decorator;
}


export function ɵɵinvalidFactoryDep(index: number): never {
    const msg = ngDevMode ?
        `This constructor is not compatible with Angular Dependency Injection because its dependency at index ${
            index} of the parameter list is invalid.
This can happen if the dependency type is a primitive like a string or if an ancestor of this class is missing an Angular decorator.

Please check that 1) the type for the parameter at index ${
            index} is correct and 2) the correct Angular decorators are defined for this class and its ancestors.` :
        'invalid';
    throw new Error(msg);
}
