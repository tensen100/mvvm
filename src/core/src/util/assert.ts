export function throwError(msg: string): never;
export function throwError(msg: string, actual: any, expected: any, comparison: string): never;
export function throwError(msg: string, actual?: any, expected?: any, comparison?: string): never {
    throw new Error(
        `ASSERTION ERROR: ${msg}` +
        (comparison == null ? '' : ` [Expected=> ${expected} ${comparison} ${actual} <=Actual]`));
}


export function assertLessThan<T>(actual: T, expected: T, msg: string): asserts actual is T {
    if (!(actual < expected)) {
        throwError(msg, actual, expected, '<');
    }
}
