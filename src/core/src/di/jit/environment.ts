import { resolveForwardRef } from '../forward_ref';
import { ɵɵdefineInjectable, ɵɵdefineInjector } from '../interface/defs';
import { ɵɵinject, ɵɵinvalidFactoryDep } from '../injector_compatibility';

export const angularCoreDiEnv: {[name: string]: Function} = {
    'ɵɵdefineInjectable': ɵɵdefineInjectable,
    'ɵɵdefineInjector': ɵɵdefineInjector,
    'ɵɵinject': ɵɵinject,
    'ɵɵinvalidFactoryDep': ɵɵinvalidFactoryDep,
    'resolveForwardRef': resolveForwardRef,
};
