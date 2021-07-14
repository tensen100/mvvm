export function newArray<T = any>(size: number): T[];
export function newArray<T>(size: number, value: T): T[];
export function newArray<T>(size: number, value?: T): T[] {
    const list: T[] = [];
    for (let i =0; i<size; i++) {
        list.push(value!);
    }
    return list
}
