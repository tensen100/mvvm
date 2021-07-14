import { ASTElement, ASTNode, ASTNodeType, ASTText } from '../domain';

function genText(el: ASTText): string {
    return `_v(${el.text})`
}

function genNode(node: ASTNode): string {
    if (node.type === ASTNodeType.ELEMENT) {
        return genElement(node as ASTElement)
    } else {
        return genText(node as ASTText)
    }
}

function genChildren(children: ASTNode[]): string {
    return `[${children.map(genNode).join(',')}]`
}

function genElement(el: ASTElement): string {
    const children = genChildren(el.children);
    const code = `_c('${el.tag}'${
        children ? `,${children}` : '' // children
    })`
    return code;
}

export function generate(ast: ASTElement): string {
    const code = genElement(ast)
    return `with(this){return ${code}}`
}
