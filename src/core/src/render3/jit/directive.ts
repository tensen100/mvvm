import { Type } from '../../interface/type';
import { Component, Directive } from '../../metadata/directives';

export function compileComponent(type: Type<any>, metadata: Component): void {
    console.log('compileComponent run !')
}

export function compileDirective(type: Type<any>, directive: Directive | null): void {
    console.log('compileComponent run !')
}
