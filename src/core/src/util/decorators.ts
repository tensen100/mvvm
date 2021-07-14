import { Type } from '../interface/type';

export const ANNOTATIONS = '__annotations__';
export const PARAMETERS = '__parameters__';
export const PROP_METADATA = '__prop__metadata__';

export interface TypeDecorator {
    /**
     * Invoke as decorator.
     */
        <T extends Type<any>>(type: T): T;

    // Make TypeDecorator assignable to built-in ParameterDecorator type.
    // ParameterDecorator is declared in lib.d.ts as a `declare type`
    // so we cannot declare this interface as a subtype.
    // see https://github.com/angular/angular/issues/3379#issuecomment-126169417
    (target: Object, propertyKey?: string|symbol, parameterIndex?: number): void;
}

function makeMetadataCtor(props?: (...args: any[]) => any): any {
    return function ctor(this: any, ...args: any[]) {
        if (props) {
            const values = props(...args);
            for (const propName in values) {
                this[propName] = values[propName];
            }
        }
    };
}

export function makeDecorator<T>(
    name: string,
    props?: (...args: any[]) => any,
    parentClass?: any,
    additionalProcessing?: (type: Type<T>) => void,
    typeFn?: (type: Type<T>, ...args: any[]) => void):
    {
        new (...args: any[]): any;
        (...args: any[]): any;
        (...args: any[]): (cls: any) => any;
    } {
    console.log(arguments);
    const metaCtor = makeMetadataCtor(props);

    function DecoratorFactory(
        this: unknown|typeof DecoratorFactory,
        ...args: any[]): (cls: Type<T>) => any {
        console.log(arguments)
        if (this instanceof DecoratorFactory) {
            metaCtor.call(this, ...args);
            return this as typeof DecoratorFactory;
        }

        const annotationInstance = new (DecoratorFactory as any)(...args);
        return function TypeDecorator(cls: Type<T>) {
            if (typeFn) typeFn(cls, ...args);
            // Use of Object.defineProperty is important since it creates non-enumerable property which
            // prevents the property is copied during subclassing.
            const annotations = cls.hasOwnProperty(ANNOTATIONS) ?
                (cls as any)[ANNOTATIONS] :
                (Object.defineProperty(cls, ANNOTATIONS, {value: []}) as any)[ANNOTATIONS];
            annotations.push(annotationInstance);


            if (additionalProcessing) additionalProcessing(cls);

            return cls;
        };
    }

    if (parentClass) {
        DecoratorFactory.prototype = Object.create(parentClass.prototype);
    }

    DecoratorFactory.prototype.ngMetadataName = name;
    (DecoratorFactory as any).annotationCls = DecoratorFactory;
    return DecoratorFactory as any;
}

export function makeParamDecorator(
    name: string, props?: (...args: any[]) => any, parentClass?: any): any {
    const metaCtor = makeMetadataCtor(props);
    function ParamDecoratorFactory(
        this: unknown|typeof ParamDecoratorFactory, ...args: any[]): any {
        if (this instanceof ParamDecoratorFactory) {
            metaCtor.apply(this, args);
            return this;
        }
        const annotationInstance = new (<any>ParamDecoratorFactory)(...args);

        (<any>ParamDecorator).annotation = annotationInstance;
        return ParamDecorator;

        function ParamDecorator(cls: any, unusedKey: any, index: number): any {
            // Use of Object.defineProperty is important since it creates non-enumerable property which
            // prevents the property is copied during subclassing.
            const parameters = cls.hasOwnProperty(PARAMETERS) ?
                (cls as any)[PARAMETERS] :
                Object.defineProperty(cls, PARAMETERS, {value: []})[PARAMETERS];

            // there might be gaps if some in between parameters do not have annotations.
            // we pad with nulls.
            while (parameters.length <= index) {
                parameters.push(null);
            }

            (parameters[index] = parameters[index] || []).push(annotationInstance);
            return cls;
        }
    }
    if (parentClass) {
        ParamDecoratorFactory.prototype = Object.create(parentClass.prototype);
    }
    ParamDecoratorFactory.prototype.ngMetadataName = name;
    (<any>ParamDecoratorFactory).annotationCls = ParamDecoratorFactory;
    return ParamDecoratorFactory;
}

