export const Type = Function;

export function isType(v: any): v is Type<any> {
    return typeof v === 'function';
}

export interface AbstractType<T> extends Function {
    prototype: T;
}


export interface Type<T> extends Function {
    new(...args: any[]): T;
}


