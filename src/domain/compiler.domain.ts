export enum ASTNodeType {
    ELEMENT,
    TEXT
}
export interface ASTAttr {
    name: string;
    value: any;
    start?: number;
    end?: number
}

export interface ASTText {
    type: ASTNodeType
    text: string;
}

export type ASTNode = ASTElement | ASTText;

export interface ASTElement {
    type: ASTNodeType
    tag: string;
    attrs: ASTAttr[];
    children: ASTNode[];
    start?: number;
    end?: number;
}

export interface ParseOptions {
    start: (tag: string, attrs: any[]) => void;
    end: (tag: string) => void;
    text: (text: string) => void;
}
