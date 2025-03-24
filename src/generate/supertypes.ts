import * as ts from 'typescript';
import { factory } from 'typescript';
import { EXPORT_MODIFIER_ONLY, NO } from '../constants';
import { UnionType, addLeadingSingleLineComment } from '../convenience/constructors';
import { nodeNameFrom } from '../naming';
import { DEFAULT_GENERATION_OPTIONS, GenerationOptions } from '../types/GenerationOptions';
import { Supertype, TypeNode, isSupertype } from '../types/TypeNode';

export function supertypes(
    types: TypeNode[],
    options: GenerationOptions = DEFAULT_GENERATION_OPTIONS
): ts.TypeAliasDeclaration[] {
    let declarations: ts.TypeAliasDeclaration[] = types.filter(isSupertype).map(supertype);

    if (options.includeSectionComments) {
        declarations = addLeadingSingleLineComment(declarations, 'Supertypes');
    }

    if (options.includeGodType) {
        declarations.push(godtype(types));
    }

    return declarations;
}

export function supertype(supertype: Supertype): ts.TypeAliasDeclaration {
    const name: string = nodeNameFrom(supertype.type);
    const union: ts.UnionTypeNode = UnionType(supertype.subtypes);

    const declaration: ts.TypeAliasDeclaration = factory.createTypeAliasDeclaration(
        EXPORT_MODIFIER_ONLY,
        name,
        NO.TypeParameters,
        union
    );
    return declaration;
}

export function godtype(types: TypeNode[], options: GenerationOptions = DEFAULT_GENERATION_OPTIONS): ts.TypeAliasDeclaration {
    const name: string = 'SyntaxNodeTyped';
    const type: ts.UnionTypeNode = UnionType(types);

    let godtype: ts.TypeAliasDeclaration = factory.createTypeAliasDeclaration(
        EXPORT_MODIFIER_ONLY,
        name,
        NO.TypeParameters,
        type
    );

    if (options.includeSectionComments) {
        godtype = addLeadingSingleLineComment(godtype, 'Godtype');
    }

    return godtype;
}
