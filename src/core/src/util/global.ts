
declare var WorkerGlobalScope: any

declare var global: any;

const __globalThis = typeof globalThis !== 'undefined' && globalThis;

const __window = typeof window !== 'undefined' && window;
const __self = typeof self !== 'undefined' && typeof WorkerGlobalScope !== 'undefined' && self instanceof  WorkerGlobalScope && self;
const __global = typeof global !== 'undefined' && global;

const _global = __globalThis || __global || __window || __self;

export {_global as global};
