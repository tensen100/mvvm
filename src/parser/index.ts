import { ASTAttr, ASTElement, ASTNodeType, ASTText } from '../domain';
import { parseHtml } from './parse-html';

function createASTElement(tag: string, attrs: ASTAttr[], parent?: ASTElement): ASTElement {
    const element: ASTElement = {
        type: ASTNodeType.ELEMENT,
        tag,
        attrs,
        children: []
    }
    if (parent) {
        parent.children.push(element);
    }
    return element;
}

export function parse(template: string): ASTElement {

    let root: ASTElement;
    let currentParent: ASTElement;
    const stack: ASTElement[] = [];
    parseHtml(template, {
            start: (tag, attrs): void => {
                // console.log('start ==>', tag, attrs)
                const element: ASTElement = createASTElement(tag, attrs, currentParent)
                if (!root) {
                    root = element;
                }
                currentParent = element;
                stack.push(element);
            },
            end: (tag): void => {
                // console.log('end ==>', tag)
                stack.pop();
                currentParent = stack[stack.length - 1]
            },
            text: (text): void => {
                // console.log('text ==>', text);
                if (currentParent) {
                    const children = currentParent.children;
                    const element: ASTText = { text, type: ASTNodeType.TEXT };
                    children.push(element)
                }
            }
        }
    )

    return root;
}
