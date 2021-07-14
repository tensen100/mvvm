import { Type } from '../../interface/type';
import { Injectable } from '../injectable';
import { NG_PROV_DEF } from '../interface/defs';
import { getCompilerFacade } from '../../compiler/compiler_facade';

import {angularCoreDiEnv} from './environment';
import { R3InjectableMetadataFacade } from '../../compiler/compiler_facade_interface';
import { ClassSansProvider, ExistingSansProvider, FactorySansProvider, ValueSansProvider } from '../interface/provider';
import { USE_VALUE } from '../injector_compatibility';
import { convertDependencies } from './util';

export function compileInjectable(type: Type<any>, meta?: Injectable): void {
    let ngInjectableDef: any = null;
    let ngFactoryDef: any = null;

    if(!type.hasOwnProperty(NG_PROV_DEF)) {
        Object.defineProperty(type, NG_PROV_DEF, {
            get: () => {
                if (ngInjectableDef === null) {
                    ngInjectableDef = getCompilerFacade().compileInjectable(
                        angularCoreDiEnv, `ng:///${type.name}/ɵprov.js`, getInjectableMetadata(type, meta));
                }

                return ngInjectableDef
            }
        })
    }
}

type UseClassProvider = Injectable&ClassSansProvider&{deps?: any[]};

function isUseClassProvider(meta: Injectable): meta is UseClassProvider {
    return (meta as UseClassProvider).useClass !== undefined;
}
function isUseFactoryProvider(meta: Injectable): meta is Injectable&FactorySansProvider {
    return (meta as FactorySansProvider).useFactory !== undefined;
}

function isUseValueProvider(meta: Injectable): meta is Injectable&ValueSansProvider {
    return USE_VALUE in meta;
}

function isUseExistingProvider(meta: Injectable): meta is Injectable&ExistingSansProvider {
    return (meta as ExistingSansProvider).useExisting !== undefined;
}

function getInjectableMetadata(type: Type<any>, srcMeta?: Injectable): R3InjectableMetadataFacade {
    // Allow the compilation of a class with a `@Injectable()` decorator without parameters
    const meta: Injectable = srcMeta || {providedIn: null};
    const compilerMeta: R3InjectableMetadataFacade = {
        name: type.name,
        type: type,
        typeArgumentCount: 0,
        providedIn: meta.providedIn,
    };
    if ((isUseClassProvider(meta) || isUseFactoryProvider(meta)) && meta.deps !== undefined) {
        compilerMeta.deps = convertDependencies(meta.deps);
    }
    // Check to see if the user explicitly provided a `useXxxx` property.
    if (isUseClassProvider(meta)) {
        compilerMeta.useClass = meta.useClass;
    } else if (isUseValueProvider(meta)) {
        compilerMeta.useValue = meta.useValue;
    } else if (isUseFactoryProvider(meta)) {
        compilerMeta.useFactory = meta.useFactory;
    } else if (isUseExistingProvider(meta)) {
        compilerMeta.useExisting = meta.useExisting;
    }
    return compilerMeta;
}

