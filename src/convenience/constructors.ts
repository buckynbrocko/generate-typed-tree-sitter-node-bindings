import * as ts from 'typescript';
import { factory } from 'typescript';
import { EMPTY, EXPORT_MODIFIER_ONLY, NO, TYPE_REFERENCE } from '../constants';
import { nodeNameFrom } from '../naming';
import { Params } from '../types';
import { Dict } from '../types/Dict';
import { TypeNode, isNamed } from '../types/TypeNode';

export function TypeReferenceNode(
    typeName: string | ts.EntityName,
    typeArguments?: readonly ts.TypeNode[]
): ts.TypeReferenceNode {
    let node: ts.TypeReferenceNode = factory.createTypeReferenceNode(typeName, typeArguments);
    return node;
}

export function ExportedInterface(
    name: string | ts.Identifier,
    heritageClauses: ts.HeritageClause[] | undefined,
    members: ts.TypeElement[] = EMPTY.MEMBERS,
    typeParameters: ts.TypeParameterDeclaration[] | undefined = NO.TypeParameters
): ts.InterfaceDeclaration {
    let declaration: ts.InterfaceDeclaration = factory.createInterfaceDeclaration(
        EXPORT_MODIFIER_ONLY,
        name,
        typeParameters,
        heritageClauses,
        members
    );
    return declaration;
}

export function PropertySignature(name: string, type_: ts.TypeNode, questionToken = NO.QuestionToken): ts.PropertySignature {
    return factory.createPropertySignature(EMPTY.MODIFIERS, name, questionToken, type_);
}

export function MethodSignature(name: string, parameters: Params, returnType: ts.TypeNode): ts.MethodSignature {
    const parameters_: ts.ParameterDeclaration[] = Dict.fromRecord(parameters).map(ParameterDeclarationFromTuple);
    const signature: ts.MethodSignature = factory.createMethodSignature(
        EMPTY.MODIFIERS,
        name,
        NO.QuestionToken,
        NO.TypeParameters,
        parameters_,
        returnType
    );
    return signature;
}

function ParameterDeclarationFromTuple(tuple: [name: string, _type: ts.TypeNode]): ts.ParameterDeclaration {
    return ParameterDeclaration(...tuple);
}

function ParameterDeclaration(name: string, type_: ts.TypeNode): ts.ParameterDeclaration {
    return factory.createParameterDeclaration(EMPTY.MODIFIERS, NO.DotDotDotToken, name, NO.QuestionToken, type_, NO.Expression);
}

export function UnionType(types: TypeNode[], nullable: boolean = false): ts.UnionTypeNode {
    let subtypes: ts.TypeNode[] = types
        .filter(isNamed)
        .map(subtype => subtype.type)
        .map(name => nodeNameFrom(name))
        .map(name => TypeReferenceNode(name));

    if (nullable) {
        subtypes.push(TYPE_REFERENCE.NULL);
    }

    const union: ts.UnionTypeNode = factory.createUnionTypeNode(subtypes);

    return union;
}

export function ImportDeclaration(module: string, ...bindingNames: string[]): ts.ImportDeclaration {
    const elements: ts.ImportSpecifier[] = bindingNames
        .map(factory.createIdentifier)
        .map(id => factory.createImportSpecifier(false, NO.Identifier, id));

    const namedBindings: ts.NamedImports = factory.createNamedImports(elements);
    const importClause = factory.createImportClause(false, NO.Identifier, namedBindings);
    const moduleSpecifier: ts.StringLiteral = factory.createStringLiteral(module);

    const declaration: ts.ImportDeclaration = factory.createImportDeclaration(EMPTY.MODIFIERS, importClause, moduleSpecifier);
    return declaration;
}

export function typeParameterDeclaration(name: string, constraints?: ts.TypeNode): ts.TypeParameterDeclaration {
    return factory.createTypeParameterDeclaration(EMPTY.MODIFIERS, name, constraints);
}

export function Extends(types: ts.Expression | ts.Expression[]): ts.HeritageClause {
    if (!Array.isArray(types)) {
        types = [types];
    }
    const expressions = types.map(exp => ExpressionWithTypeArguments(exp));
    const clause: ts.HeritageClause = factory.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, expressions);
    return clause;
}

export function ExpressionWithTypeArguments(
    expression: ts.Expression,
    typeArguments?: ts.TypeNode[]
): ts.ExpressionWithTypeArguments {
    if (ts.isExpressionWithTypeArguments(expression)) {
        return expression;
    }
    let newExpression = factory.createExpressionWithTypeArguments(expression, typeArguments);
    return newExpression;
}

export function addLeadingSingleLineComment<T extends ts.Node>(
    node: T,
    text: string,
    hasTrailingNewLine?: boolean,
    leadingWhitespace?: string
): T;
export function addLeadingSingleLineComment<T extends ts.Node>(
    node: T[],
    text: string,
    hasTrailingNewLine?: boolean,
    leadingWhitespace?: string
): T[];
export function addLeadingSingleLineComment<T extends ts.Node>(
    node: T | T[],
    text: string,
    hasTrailingNewLine?: boolean,
    leadingWhitespace: string = ' '
): T | T[] {
    if (Array.isArray(node)) {
        if (node.length) {
            node[0] = addLeadingSingleLineComment(node[0], text, hasTrailingNewLine, leadingWhitespace);
        }
        return node;
    }
    const commented: T = ts.addSyntheticLeadingComment(
        node,
        ts.SyntaxKind.SingleLineCommentTrivia,
        leadingWhitespace + text,
        hasTrailingNewLine
    );
    return commented;
}

// Un-recurse-ify if performance is needed or stack-size limit is reached
export function nestedLogicalOr(expressions: ts.Expression[]): ts.Expression {
    let left: ts.Expression;
    let right: ts.Expression;
    switch (expressions.length) {
        case 0:
            throw 'Need more than one expression';
        case 1:
            return expressions[0];
        default:
            let rest: ts.Expression[];
            [left, ...rest] = expressions;
            right = nestedLogicalOr(rest);
    }
    const binaryExpression: ts.BinaryExpression = factory.createBinaryExpression(left, ts.SyntaxKind.BarBarToken, right);
    const expression: ts.Expression = factory.restoreOuterExpressions(right, binaryExpression);
    return expression;
}
