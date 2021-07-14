export enum InjectFlags {
    // TODO(alxhub): make this 'const' (and remove `InternalInjectFlags` enum) when ngc no longer
    // writes exports of it into ngfactory files.

    /** Check self and check parent injector if needed */
    Default = 0b0000,

    /**
     * Specifies that an injector should retrieve a dependency from any injector until reaching the
     * host element of the current component. (Only used with Element Injector)
     */
    Host = 0b0001,

    /** Don't ascend to ancestors of the node requesting injection. */
    Self = 0b0010,

    /** Skip the node that is requesting injection. */
    SkipSelf = 0b0100,

    /** Inject `defaultValue` instead if token not found. */
    Optional = 0b1000,
}

export const enum InternalInjectFlags {
    /** Check self and check parent injector if needed */
    Default = 0b0000,

    /**
     * Specifies that an injector should retrieve a dependency from any injector until reaching the
     * host element of the current component. (Only used with Element Injector)
     */
    Host = 0b0001,

    /** Don't ascend to ancestors of the node requesting injection. */
    Self = 0b0010,

    /** Skip the node that is requesting injection. */
    SkipSelf = 0b0100,

    /** Inject `defaultValue` instead if token not found. */
    Optional = 0b1000,

    /**
     * This token is being injected into a pipe.
     *
     * This flag is intentionally not in the public facing `InjectFlags` because it is only added by
     * the compiler and is not a developer applicable flag.
     */
    ForPipe = 0b10000,
}

export const enum DecoratorFlags {
    Inject = -1
}
