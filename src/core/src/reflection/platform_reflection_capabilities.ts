import { Type } from '../interface/type';
import { GetterFn, MethodFn, SetterFn } from './types';

export interface PlatformReflectionCapabilities {
    isReflectionEnabled(): boolean;
    factory(type: Type<any>): Function;
    hasLifecycleHook(type: any, lcProperty: string): boolean;
    guards(type: any): {[key: string]: any};

    /**
     * 返回构造函数参数列表
     */
    parameters(type: Type<any>): any[][];

    /**
     * 返回类上声明的注释列表
     */
    annotations(type: Type<any>): any[];

    /**
     * 返回描述类属性、字段注释的对象文本
     */
    propMetadata(typeOrFunc: Type<any>): {[key: string]: any[]};


    getter(name: string): GetterFn;
    setter(name: string): SetterFn;
    method(name: string): MethodFn;
    importUri(type: Type<any>): string;
    resourceUri(type: Type<any>): string;
    resolveIdentifier(name: string, moduleUrl: string, members: string[], runtime: any): any;
    resolveEnum(enumIdentifier: any, name: string): any;
}
