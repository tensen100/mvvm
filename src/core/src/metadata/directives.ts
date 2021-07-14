import { makeDecorator, TypeDecorator } from '../util/decorators';
import { Type } from '../interface/type';
import { noop } from '../util/noop';
import {compileComponent as render3CompileComponent, compileDirective as render3CompileDirective} from '../render3/jit/directive';


export interface DirectiveDecorator {
    (obj?: Directive): TypeDecorator;
    new(obj?: Directive): Directive;
}


export interface Directive {
    selector?: string;
}

export const Directive: DirectiveDecorator = makeDecorator(
    'Directive', (dir: Directive = {}) => dir, undefined, undefined,
    (type: Type<any>, meta: Directive) => SWITCH_COMPILE_DIRECTIVE(type, meta));



export interface Component extends Directive {
    template?: string;
    templateUrl?: string;
    styleUrls?: string[];
    styles?: string[];
    animations?: any[];
}


export interface ComponentDecorator {
    (obj: Component): TypeDecorator;
    new(obj: Component): Component;
}


export const Component: ComponentDecorator = makeDecorator(
    'Component', (c: Component = {}) => ({...c}),
    Directive, undefined,
    (type: Type<any>, meta: Component) => SWITCH_COMPILE_COMPONENT(type, meta));

const SWITCH_COMPILE_COMPONENT__PRE_R3__ = noop;
const SWITCH_COMPILE_DIRECTIVE__PRE_R3__ = noop;

const SWITCH_COMPILE_DIRECTIVE: typeof render3CompileDirective = SWITCH_COMPILE_DIRECTIVE__PRE_R3__;
const SWITCH_COMPILE_COMPONENT: typeof render3CompileComponent = SWITCH_COMPILE_COMPONENT__PRE_R3__;
