const providerMap = new WeakMap();

export function MyInjectable(): ClassDecorator {
    return function (target: any) {
        providerMap.set(target, null);
    }
}
