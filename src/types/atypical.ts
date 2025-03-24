import { SyntaxNode } from 'tree-sitter';


export type HasAmbiguousProperties<T extends SyntaxNode> = T & {
    parent: SyntaxNode | null;
    children: Array<SyntaxNode>;
    namedChildren: Array<SyntaxNode>;
    childCount: number;
    namedChildCount: number;
    firstChild: SyntaxNode | null;
    firstNamedChild: SyntaxNode | null;
    lastChild: SyntaxNode | null;
    lastNamedChild: SyntaxNode | null;
    nextSibling: SyntaxNode | null;
    nextNamedSibling: SyntaxNode | null;
    previousSibling: SyntaxNode | null;
    previousNamedSibling: SyntaxNode | null;
    descendantCount: number;
};


export type Missing<T extends SyntaxNode> = T & { isMissing: true };
export type Extra<T extends SyntaxNode> = T & { isExtra: true };
export type IsError<T extends SyntaxNode> = HasAmbiguousProperties<T> & { isError: true };
export type HasError<T extends SyntaxNode> = HasAmbiguousProperties<T> & { hasError: true };
export type Erroneous<T extends SyntaxNode> = HasError<T> | IsError<T>;

export type Nominal<T extends SyntaxNode> = T & {
    isMissing: false;
    isError: false;
    hasError: false;
};

export function isMissing<T extends SyntaxNode>(node: T): node is Missing<T> {
    return !!node.isMissing;
}

export function isExtra<T extends SyntaxNode>(node: T): node is Extra<T> {
    return !!node.isExtra;
}

export function isError<T extends SyntaxNode>(node: T): node is IsError<T> {
    return !!node.isError;
}

export function hasError<T extends SyntaxNode>(node: T): node is HasError<T> {
    return !!node.hasError;
}

export function isErroneous<T extends SyntaxNode>(node: T): node is Erroneous<T> {
    return isError(node) || hasError(node);
}

export function isNominal<T extends SyntaxNode>(node: T): node is Nominal<T> {
    return isErroneous(node) || isMissing(node);
}
