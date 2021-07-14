// export function Input() {
//     return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//         console.log(target, propertyKey, descriptor);
//         descriptor.get = function () {
//             console.log('get')
//             return descriptor.value;
//         }
//         descriptor.set = function (val) {
//             console.log('set')
//             descriptor.value = val;
//         }
//     }
// }

export function Input() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log(target, propertyKey, descriptor);
        descriptor.get = function () {
            console.log('get')
            return descriptor.value;
        }
        descriptor.set = function (val) {
            console.log('set')
            descriptor.value = val;
        }
    }
}
