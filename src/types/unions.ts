import * as ts from 'typescript';
import { TYPE_REFERENCE } from '../constants';

export function unionContainsNull(union: ts.UnionTypeNode): boolean {
    let result: boolean = !!(union.flags & ts.TypeFlags.Null);
    return result;
}

export function unionIsSyntaxNode(union: ts.UnionTypeNode): boolean {
    let result: boolean = union.types.length === 1 && union.types[0] === TYPE_REFERENCE.SYNTAX_NODE;
    return result;
}

export function isSyntaxNodeAndNull(union: ts.UnionTypeNode): boolean;
export function isSyntaxNodeAndNull(notUnion: NotUnionType): false;
export function isSyntaxNodeAndNull(node: ts.TypeNode): boolean {
    let result: boolean = ts.isUnionTypeNode(node) && unionIsSyntaxNode(node) && unionContainsNull(node);
    return result;
}
export type NotUnionType = Exclude<ts.TypeNode, ts.UnionTypeNode>;
