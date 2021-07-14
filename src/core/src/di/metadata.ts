import { attachInjectFlag } from './injector_compatibility';
import { makeParamDecorator } from '../util/decorators';
import { DecoratorFlags, InternalInjectFlags } from '../interface/injector';

export interface Optional {}

export interface OptionalDecorator {
    (): any;
    new(): Optional;
}

export const Optional: OptionalDecorator =
    attachInjectFlag(makeParamDecorator('Optional'), InternalInjectFlags.Optional);


export interface SkipSelfDecorator {
    /**
     * Parameter decorator to be used on constructor parameters,
     * which tells the DI framework to start dependency resolution from the parent injector.
     * Resolution works upward through the injector hierarchy, so the local injector
     * is not checked for a provider.
     *
     * @usageNotes
     *
     * In the following example, the dependency can be resolved when
     * instantiating a child, but not when instantiating the class itself.
     *
     * <code-example path="core/di/ts/metadata_spec.ts" region="SkipSelf">
     * </code-example>
     *
     * @see [Dependency Injection guide](guide/dependency-injection-in-action#skip).
     * @see `Self`
     * @see `Optional`
     *
     */
    (): any;
    new(): SkipSelf;
}

export interface SkipSelf {}

export const SkipSelf: SkipSelfDecorator =
    attachInjectFlag(makeParamDecorator('SkipSelf'), InternalInjectFlags.SkipSelf);


export interface SelfDecorator {
    /**
     * Parameter decorator to be used on constructor parameters,
     * which tells the DI framework to start dependency resolution from the local injector.
     *
     * Resolution works upward through the injector hierarchy, so the children
     * of this class must configure their own providers or be prepared for a `null` result.
     *
     * @usageNotes
     *
     * In the following example, the dependency can be resolved
     * by the local injector when instantiating the class itself, but not
     * when instantiating a child.
     *
     * <code-example path="core/di/ts/metadata_spec.ts" region="Self">
     * </code-example>
     *
     * @see `SkipSelf`
     * @see `Optional`
     *
     */
    (): any;
    new(): Self;
}

export interface Self {}

export const Self: SelfDecorator =
    attachInjectFlag(makeParamDecorator('Self'), InternalInjectFlags.Self);



export interface InjectDecorator {
    /**
     * Parameter decorator on a dependency parameter of a class constructor
     * that specifies a custom provider of the dependency.
     *
     * @usageNotes
     * The following example shows a class constructor that specifies a
     * custom provider of a dependency using the parameter decorator.
     *
     * When `@Inject()` is not present, the injector uses the type annotation of the
     * parameter as the provider.
     *
     * <code-example path="core/di/ts/metadata_spec.ts" region="InjectWithoutDecorator">
     * </code-example>
     *
     * @see ["Dependency Injection Guide"](guide/dependency-injection)
     *
     */
    (token: any): any;
    new(token: any): Inject;
}

export interface Inject {
    /**
     * A [DI token](guide/glossary#di-token) that maps to the dependency to be injected.
     */
    token: any;
}

export const Inject: InjectDecorator = attachInjectFlag(
    makeParamDecorator('Inject', (token: any) => ({token})), DecoratorFlags.Inject);


export interface HostDecorator {
    /**
     * Parameter decorator on a view-provider parameter of a class constructor
     * that tells the DI framework to resolve the view by checking injectors of child
     * elements, and stop when reaching the host element of the current component.
     *
     * @usageNotes
     *
     * The following shows use with the `@Optional` decorator, and allows for a `null` result.
     *
     * <code-example path="core/di/ts/metadata_spec.ts" region="Host">
     * </code-example>
     *
     * For an extended example, see ["Dependency Injection
     * Guide"](guide/dependency-injection-in-action#optional).
     */
    (): any;
    new(): Host;
}

export interface Host {}

export const Host: HostDecorator =
    attachInjectFlag(makeParamDecorator('Host'), InternalInjectFlags.Host);
