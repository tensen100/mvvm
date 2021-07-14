import { getClosureSafeProperty } from '../../util/property';
import { Type } from '../../interface/type';
import {
    ClassProvider,
    ConstructorProvider,
    ExistingProvider,
    FactoryProvider,
    StaticClassProvider,
    ValueProvider
} from './provider';

export const NG_PROV_DEF = getClosureSafeProperty({ɵprov: getClosureSafeProperty});

export interface ɵɵInjectableDeclaration<T> {
    /**
     * Specifies that the given type belongs to a particular injector:
     * - `InjectorType` such as `NgModule`,
     * - `'root'` the root injector
     * - `'any'` all injectors.
     * - `null`, does not belong to any injector. Must be explicitly listed in the injector
     *   `providers`.
     */
    providedIn: InjectorType<any>|'root'|'platform'|'any'|null;

    /**
     * The token to which this definition belongs.
     *
     * Note that this may not be the same as the type that the `factory` will create.
     */
    token: unknown;

    /**
     * Factory method to execute to create an instance of the injectable.
     */
    factory: (t?: Type<any>) => T;

    /**
     * In a case of no explicit injector, a location where the instance of the injectable is stored.
     */
    value: T|undefined;
}


export interface ɵɵInjectorDef<T> {
    // TODO(alxhub): Narrow down the type here once decorators properly change the return type of the
    // class they are decorating (to add the ɵprov property for example).
    providers: (Type<any>|ValueProvider|ExistingProvider|FactoryProvider|ConstructorProvider|
        StaticClassProvider|ClassProvider|any[])[];

    imports: (InjectorType<any>|InjectorTypeWithProviders<any>)[];
}

export interface InjectorTypeWithProviders<T> extends Type<T> {
    /**
     * Opaque type whose structure is highly version dependent. Do not rely on any properties.
     */
    ɵprov: unknown;
}

export interface InjectableType<T> extends Type<T> {
    /**
     * Opaque type whose structure is highly version dependent. Do not rely on any properties.
     */
    ɵprov: unknown;
}

export interface InjectorType<T> extends Type<T> {
    ɵfac?: unknown;
    ɵinj: unknown;
}


export interface InjectorTypeWithProviders<T> {
    ngModule: InjectorType<T>;
    providers?: (Type<any>|ValueProvider|ExistingProvider|FactoryProvider|ConstructorProvider|
        StaticClassProvider|ClassProvider|any[])[];
}

export function ɵɵdefineInjectable<T>(opts: {
    token: unknown,
    providedIn?: Type<any>|'root'|'platform'|'any'|null, factory: () => T,
}): unknown {
    return {
        token: opts.token,
        providedIn: opts.providedIn as any || null,
        factory: opts.factory,
        value: undefined,
    } as ɵɵInjectableDeclaration<T>;
}

export function ɵɵdefineInjector(options: {providers?: any[], imports?: any[]}): unknown {
    return {providers: options.providers || [], imports: options.imports || []};
}

export function getInjectableDef<T>(type: any): ɵɵInjectableDeclaration<T>|null {
    return getOwnDefinition(type, NG_PROV_DEF) || getOwnDefinition(type, NG_INJECTABLE_DEF);
}

function getOwnDefinition<T>(type: any, field: string): ɵɵInjectableDeclaration<T>|null {
    return type.hasOwnProperty(field) ? type[field] : null;
}

export const NG_INJECTABLE_DEF = getClosureSafeProperty({ngInjectableDef: getClosureSafeProperty});
