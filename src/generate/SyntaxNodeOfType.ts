import * as ts from 'typescript';
import { factory } from 'typescript';
import { EMPTY, IDENTIFIER } from '../constants';
import {
    ExportedInterface,
    ExpressionWithTypeArguments,
    Extends,
    PropertySignature,
    TypeReferenceNode,
} from '../convenience/constructors';

export function extendsSyntaxNodeOfType(type: string): ts.HeritageClause {
    const typeLiteral: ts.LiteralTypeNode = factory.createLiteralTypeNode(factory.createStringLiteral(type));
    const expression: ts.ExpressionWithTypeArguments = ExpressionWithTypeArguments(IDENTIFIER.SYNTAX_NODE_OF_TYPE, [
        typeLiteral,
    ]);

    const clause: ts.HeritageClause = Extends(expression);
    return clause;
}

export function syntaxNodeOfType(): ts.InterfaceDeclaration {
    const typeParameter: ts.TypeParameterDeclaration = factory.createTypeParameterDeclaration(
        EMPTY.MODIFIERS,
        'T',
        TypeReferenceNode('string')
    );
    const heritageClause: ts.HeritageClause = Extends(IDENTIFIER.SYNTAX_NODE);
    const member: ts.PropertySignature = PropertySignature('type', TypeReferenceNode('T'));

    const SyntaxNodeOfType: ts.InterfaceDeclaration = ExportedInterface(
        IDENTIFIER.SYNTAX_NODE_OF_TYPE,
        [heritageClause],
        [member],
        [typeParameter]
    );
    return SyntaxNodeOfType;
}
