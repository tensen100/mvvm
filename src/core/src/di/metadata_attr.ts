import { makeParamDecorator } from '../util/decorators';

export interface AttributeDecorator {
    /**
     * Parameter decorator for a directive constructor that designates
     * a host-element attribute whose value is injected as a constant string literal.
     *
     * @usageNotes
     *
     * Suppose we have an `<input>` element and want to know its `type`.
     *
     * ```html
     * <input type="text">
     * ```
     *
     * The following example uses the decorator to inject the string literal `text` in a directive.
     *
     * {@example core/ts/metadata/metadata.ts region='attributeMetadata'}
     *
     * The following example uses the decorator in a component constructor.
     *
     * {@example core/ts/metadata/metadata.ts region='attributeFactory'}
     *
     */
    (name: string): any;
    new(name: string): Attribute;
}

/**
 * Type of the Attribute metadata.
 *
 * @publicApi
 */
export interface Attribute {
    /**
     * The name of the attribute whose value can be injected.
     */
    attributeName: string;
}

function CREATE_ATTRIBUTE_DECORATOR__PRE_R3__(): AttributeDecorator {
    return makeParamDecorator('Attribute', (attributeName?: string) => ({attributeName}));
}

const CREATE_ATTRIBUTE_DECORATOR_IMPL = CREATE_ATTRIBUTE_DECORATOR__PRE_R3__;


export const Attribute: AttributeDecorator = CREATE_ATTRIBUTE_DECORATOR_IMPL();
