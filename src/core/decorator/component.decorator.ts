import { ComponentConfig } from '../../domain';

export function MyComponent(obj: ComponentConfig): ClassDecorator {
    return function (target: Function): void {
        console.log('---')
        target.prototype.template  = obj.template;
        target.prototype.selector = obj.template;
    }
}
