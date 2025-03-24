import * as ts from 'typescript';
import { ExportedInterface } from '../convenience/constructors';
import { nodeNameFrom } from '../naming';
import { isLeaf, isNamed, Leaf, Named, TypeNode } from '../types/TypeNode';
import { extendsSyntaxNodeOfType } from './SyntaxNodeOfType';

export function leaves(types: TypeNode[]): ts.InterfaceDeclaration[] {
    const leaves: ts.InterfaceDeclaration[] = types.filter(isLeaf).filter(isNamed).map(leaf);
    return leaves;
}

export function leaf(leaf: Named<Leaf>): ts.InterfaceDeclaration {
    const name: string = nodeNameFrom(leaf.type);
    const heritageClause: ts.HeritageClause = extendsSyntaxNodeOfType(leaf.type);

    const declaration: ts.InterfaceDeclaration = ExportedInterface(name, [heritageClause]);
    return declaration;
}
