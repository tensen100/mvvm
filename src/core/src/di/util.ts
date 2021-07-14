import {
    ClassSansProvider,
    ConstructorSansProvider,
    ExistingSansProvider, FactorySansProvider,
    StaticClassSansProvider,
    ValueSansProvider
} from './interface/provider';
import { Type } from '../interface/type';
import { ReflectionCapabilities } from '../reflection/reflection_capabilities';
import { injectArgs, USE_VALUE, ɵɵinject } from './injector_compatibility';
import { resolveForwardRef } from './forward_ref';
import { EMPTY_ARRAY } from '../util/empty';


export function convertInjectableProviderToFactory(
    type: Type<any>,
    provider?: ValueSansProvider|ExistingSansProvider|StaticClassSansProvider|
        ConstructorSansProvider|FactorySansProvider|ClassSansProvider): () => any {
    if (!provider) {
        const reflectionCapabilities = new ReflectionCapabilities();
        const deps = reflectionCapabilities.parameters(type);
        // TODO - convert to flags.
        return () => new type(...injectArgs(deps as any[]));
    }

    if (USE_VALUE in provider) {
        const valueProvider = (provider as ValueSansProvider);
        return () => valueProvider.useValue;
    } else if ((provider as ExistingSansProvider).useExisting) {
        const existingProvider = (provider as ExistingSansProvider);
        return () => ɵɵinject(resolveForwardRef(existingProvider.useExisting));
    } else if ((provider as FactorySansProvider).useFactory) {
        const factoryProvider = (provider as FactorySansProvider);
        return () => factoryProvider.useFactory(...injectArgs(factoryProvider.deps || EMPTY_ARRAY));
    } else if ((provider as StaticClassSansProvider | ClassSansProvider).useClass) {
        const classProvider = (provider as StaticClassSansProvider | ClassSansProvider);
        let deps = (provider as StaticClassSansProvider).deps;
        if (!deps) {
            const reflectionCapabilities = new ReflectionCapabilities();
            deps = reflectionCapabilities.parameters(type);
        }
        return () => new (resolveForwardRef(classProvider.useClass))(...injectArgs(deps));
    } else {
        let deps = (provider as ConstructorSansProvider).deps;
        if (!deps) {
            const reflectionCapabilities = new ReflectionCapabilities();
            deps = reflectionCapabilities.parameters(type);
        }
        return () => new type(...injectArgs(deps!));
    }
}

