import { PlatformReflectionCapabilities } from './platform_reflection_capabilities';
import { isType, Type } from '../interface/type';
import { GetterFn, MethodFn, SetterFn } from './types';
import { ANNOTATIONS, PARAMETERS, PROP_METADATA } from '../util/decorators';
import { newArray } from '../util/array_utils';

export const ES5_DELEGATE_CTOR =
    /^function\s+\S+\(\)\s*{[\s\S]+\.apply\(this,\s*(arguments|(?:[^()]+\(\[\],)?[^()]+\(arguments\))\)/;

export const ES2015_INHERITED_CLASS = /^class\s+[A-Za-z\d$_]*\s*extends\s+[^{]+{/;

export const ES2015_INHERITED_CLASS_WITH_DELEGATE_CTOR =
    /^class\s+[A-Za-z\d$_]*\s*extends\s+[^{]+{[\s\S]*constructor\s*\(\)\s*{\s*super\(\.\.\.arguments\)/;

export const ES2015_INHERITED_CLASS_WITH_CTOR =
    /^class\s+[A-Za-z\d$_]*\s*extends\s+[^{]+{[\s\S]*constructor\s*\(/;

export function isDelegateCtor(typeStr: string): boolean {
    return ES5_DELEGATE_CTOR.test(typeStr) ||
        ES2015_INHERITED_CLASS_WITH_DELEGATE_CTOR.test(typeStr) ||
        (ES2015_INHERITED_CLASS.test(typeStr) && !ES2015_INHERITED_CLASS_WITH_CTOR.test(typeStr));
}

export class ReflectionCapabilities implements PlatformReflectionCapabilities {

    factory(type: Type<any>): Function {
        return (...args: any[]) => new type(...args);
    }

    getter(name: string): GetterFn {
        return <GetterFn>new Function('o', `return o.${name};`);
    }

    setter(name: string): SetterFn {
        return <SetterFn>new Function('o', 'v', `return o.${name} = v;`);
    }

    method(name: string): MethodFn {
        const functionBody = `if (!o.${name}) throw new Error('"${name}" is undefined');
        return o.${name}.apply(o, arg)`;
        return <MethodFn>new Function('o', 'arg', functionBody);
    }

    private _ownAnnotations(typeOrFunc: Type<any>, parentCtor: any): any[] | null {
        if ((<any>typeOrFunc).annotations && (<any>typeOrFunc).annotations !== parentCtor.annotations) {
            let annotations = (<any>typeOrFunc).annotations;

            if (typeof annotations === 'function' && annotations.annotations) {
                annotations = annotations.annotations;
            }
            return annotations;
        }

        if ((<any>typeOrFunc).decorators && (<any>typeOrFunc).decorators !== parentCtor.decorators) {
            return convertTsickleDecoratorIntoMetadata((<any>typeOrFunc).decorators)
        }

        if (typeOrFunc.hasOwnProperty(ANNOTATIONS)) {
            return (<any>typeOrFunc)[ANNOTATIONS]
        }

        return null;
    }

    annotations(typeOrFunc: Type<any>): any[] {
        if (!isType(typeOrFunc)) {
            return [];
        }
        const parentCtor = getParentCtor(typeOrFunc);
        const ownAnnotations = this._ownAnnotations(typeOrFunc, parentCtor) || [];
        const parentAnnotations = parentCtor !== Object ? this.annotations(parentCtor) : [];
        return parentAnnotations.concat(ownAnnotations);
    }

    private _ownPropMetadata(typeOrFunc: any, parentCtor: any): { [key: string]: any[] } {
        if (typeOrFunc.propMetadata && typeOrFunc.propMetadata !== parentCtor.propMetadata) {
            let propMetadata: any = typeOrFunc.propMetadata;
            if (typeof propMetadata === 'function' && propMetadata.propMetadata) {
                propMetadata = propMetadata.propMetadata;
            }
            return propMetadata;
        }

        if (typeOrFunc.propDecorators && typeOrFunc.propDecorators !== parentCtor.propDecorators) {
            const propDecorators: any = typeOrFunc.propDecorators;
            const propMetadata = <{ [key: string]: any[] }>{};

            Object.keys(propDecorators).forEach(prop => {
                propMetadata[prop] = convertTsickleDecoratorIntoMetadata(propDecorators[prop]);
            })
            return propMetadata;
        }

        if (typeOrFunc.hasOwnProperty(PROP_METADATA)) {
            return typeOrFunc[PROP_METADATA]
        }

        return null;
    }

    propMetadata(typeOrFunc: Type<any>): { [key: string]: any[] } {
        if (!isType(typeOrFunc)) {
            return {};
        }

        const parentCtor = getParentCtor(typeOrFunc);

        const propMetadata: { [key: string]: any[] } = {};
        if (parentCtor !== Object) {
            const parentPropMetadata = this.propMetadata(parentCtor);
            Object.keys(parentPropMetadata).forEach(propName => {
                propMetadata[propName] = parentPropMetadata[propName];
            });
        }

        const ownPropMetadata = this._ownPropMetadata(typeOrFunc, parentCtor);

        if (ownPropMetadata) {
            Object.keys(ownPropMetadata).forEach(propName => {
                const decorators: any[] = [];

                if (propMetadata.hasOwnProperty(propName)) {
                    decorators.push(...propMetadata[propName]);
                }

                decorators.push(...ownPropMetadata[propName]);
                propMetadata[propName] = decorators;
            })
        }

        return propMetadata;

    }

    ownPropMetadata(typeOrFunc: Type<any>): { [key: string]: any[] } {
        if (!isType(typeOrFunc)) {
            return {}
        }

        return this._ownPropMetadata(typeOrFunc, getParentCtor(typeOrFunc)) || {};
    }

    private _zipTypesAndAnnotations(paramTypes: any[], paramAnnotations: any[]): any[][] {
        let result: any[][];

        if (typeof paramTypes === 'undefined') {
            result = newArray(paramAnnotations.length)
        } else {
            result = newArray(paramTypes.length)
        }

        for (let i = 0; i < result.length; i++) {
            if (typeof paramTypes === 'undefined') {
                result[i] = [];
            } else if (paramTypes[i] && paramTypes[i] != Object) {
                result[i] = [paramTypes[i]]
            } else {
                result[i] = []
            }

            if (paramAnnotations && paramAnnotations[i] !== null) {
                result[i] = result[i].concat(paramAnnotations[i])
            }
        }

        return result;
    }

    private _ownParameters(type: Type<any>, parentCtor: any): any[][] | null {
        const typeStr = type.toString();

        if (isDelegateCtor(typeStr)) {
            return null;
        }

        if ((<any>type).parameters && (<any>type).parameters !== parentCtor.parameters) {
            return (<any>type).parameters
        }

        const tsickCtorParams = (<any>type).ctorParameters;

        if (tsickCtorParams && tsickCtorParams !== parentCtor.ctorParameters) {
            const ctorParameters = typeof tsickCtorParams === 'function' ? tsickCtorParams() : tsickCtorParams;

            const paramTypes = ctorParameters.map((ctorParam: any) => ctorParam && ctorParam.type);

            const paramAnnotations = ctorParameters.map((ctorParam: any) => {
                return ctorParam && convertTsickleDecoratorIntoMetadata(ctorParam.decorators)
            })

            return this._zipTypesAndAnnotations(paramTypes, paramAnnotations);
        }

        const paramAnnotations = type.hasOwnProperty(PARAMETERS) && (type as any)[PARAMETERS];

        const paramTypes = Reflect.getOwnMetadata('design:paramtypes', type);

        if (paramTypes || paramAnnotations) {
            return this._zipTypesAndAnnotations(paramTypes, paramAnnotations);
        }

        return newArray<any[]>(type.length)

    }

    parameters(type: Type<any>): any[][] {
        if (!isType(type)) {
            return []
        }
        const parentCtor = getParentCtor(type);

        let parameters = this._ownParameters(type, parentCtor);

        if (!parameters && parentCtor !== Object) {
            parameters = this.parameters(parentCtor);
        }
        return parameters || [];
    }

    isReflectionEnabled(): boolean {
        return true;
    }

    guards(type: any): { [p: string]: any } {
        return {};
    }

    hasLifecycleHook(type: any, lcProperty: string): boolean {
        return false;
    }

    importUri(type: Type<any>): string {
        return '';
    }


    resolveEnum(enumIdentifier: any, name: string): any {
    }

    resolveIdentifier(name: string, moduleUrl: string, members: string[], runtime: any): any {
    }

    resourceUri(type: Type<any>): string {
        return '';
    }


}

function convertTsickleDecoratorIntoMetadata(decoratorInvocations: any[]): any[] {
    if (!decoratorInvocations) {
        return [];
    }

    return decoratorInvocations.map(decoratorInvocation => {
        const decoratorType = decoratorInvocation.type;
        const annotationCls = decoratorType.annotationCls;
        const annotationArgs = decoratorInvocation.args || [];

        return new annotationCls(...annotationArgs);
    })
}


function getParentCtor(ctor: Function): Type<any> {
    const parentProto = ctor.prototype ? Object.getPrototypeOf(ctor.prototype) : null;
    const parentCtor = parentProto ? parentProto.constructor : null;

    return parentCtor || Object;
}
