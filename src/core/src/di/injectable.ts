import { Type } from '../interface/type';
import { makeDecorator, TypeDecorator } from '../util/decorators';
import {
    ClassSansProvider,
    ConstructorSansProvider,
    ExistingSansProvider, FactorySansProvider,
    StaticClassSansProvider,
    ValueSansProvider
} from './interface/provider';
import { compileInjectable } from './jit/injectable';
import { getInjectableDef, InjectableType, ɵɵdefineInjectable } from './interface/defs';
import { convertInjectableProviderToFactory } from './util';

export type InjectableProvider = ValueSansProvider|ExistingSansProvider|StaticClassSansProvider|
    ConstructorSansProvider|FactorySansProvider|ClassSansProvider;

export interface InjectableDecorator {
    (): TypeDecorator;
    (options?: {providedIn: Type<any>|'root'|'platform'|'any'|null}&
        InjectableProvider): TypeDecorator;
    new(): Injectable;
    new(options?: {providedIn: Type<any>|'root'|'platform'|'any'|null}&
        InjectableProvider): Injectable;
}

export interface Injectable {
    providedIn?: Type<any>|'root'|'platform'|'any'|null;
}

export const Injectable: InjectableDecorator = makeDecorator(
    'Injectable', undefined, undefined, undefined,
    (type: Type<any>, meta: Injectable) => SWITCH_COMPILE_INJECTABLE(type as any, meta));

function render2CompileInjectable(
    injectableType: Type<any>,
    options?: {providedIn?: Type<any>|'root'|'platform'|'any'|null}&InjectableProvider): void {
    if (options && options.providedIn !== undefined && !getInjectableDef(injectableType)) {
        (injectableType as InjectableType<any>).ɵprov = ɵɵdefineInjectable({
            token: injectableType,
            providedIn: options.providedIn,
            factory: convertInjectableProviderToFactory(injectableType, options),
        });
    }
}


const SWITCH_COMPILE_INJECTABLE__PRE_R3__ = render2CompileInjectable;
const SWITCH_COMPILE_INJECTABLE: typeof compileInjectable = SWITCH_COMPILE_INJECTABLE__PRE_R3__;
