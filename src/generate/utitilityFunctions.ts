import * as ts from 'typescript';
import { factory } from 'typescript';
import { EMPTY, EXPORT_MODIFIER_ONLY, IDENTIFIER, NO, NODE_PARAMETER, NODE_QUESTION_DOT_TYPE, TOKEN } from '../constants';
import { addLeadingSingleLineComment, nestedLogicalOr, TypeReferenceNode } from '../convenience/constructors';
import { nodeNameFrom } from '../naming';
import { DEFAULT_GENERATION_OPTIONS, GenerationOptions } from '../types/GenerationOptions';
import { isMonotype, isNamed, isSupertype, Monotype, Named, Supertype, TypeNode } from '../types/TypeNode';

export function utilityFunctions(types: TypeNode[], options: GenerationOptions = DEFAULT_GENERATION_OPTIONS): ts.Statement[] {
    let statements: ts.Statement[] = [];

    // TODO add Nominal/Erroroneous/etc. functions?
    if (options.includeIdentityFunctions) {
        const nodeIs: ts.VariableStatement = nodeIsObjectLiteral(types);
        statements.push(nodeIs);
    }

    if (options.includeSectionComments) {
        statements = addLeadingSingleLineComment(statements, 'Utility Functions');
    }

    return statements;
}

export function nodeIsObjectLiteral(
    types: TypeNode[],
    options: GenerationOptions = DEFAULT_GENERATION_OPTIONS
): ts.VariableStatement {
    let monotypeFunctions: ts.PropertyAssignment[] = types.filter(isMonotype).filter(isNamed).map(monotypeIdentityFunction);
    let supertypeFunctions: ts.PropertyAssignment[] = types.filter(isSupertype).map(supertypeIdentityFunction);

    if (options.includeSectionComments) {
        monotypeFunctions = addLeadingSingleLineComment(monotypeFunctions, 'Monotypes');
        supertypeFunctions = addLeadingSingleLineComment(supertypeFunctions, 'Supertypes');
    }

    const properties: ts.PropertyAssignment[] = [...monotypeFunctions, ...supertypeFunctions];
    const initializer: ts.ObjectLiteralExpression = factory.createObjectLiteralExpression(properties, true);
    const declaration: ts.VariableDeclaration = factory.createVariableDeclaration(
        'nodeIs',
        NO.ExclamationToken,
        NO.TypeNode,
        initializer
    );
    const declarations: ts.VariableDeclarationList = factory.createVariableDeclarationList([declaration], ts.NodeFlags.Const);

    const literal: ts.VariableStatement = factory.createVariableStatement(EXPORT_MODIFIER_ONLY, declarations);
    return literal;
}

export function monotypeIdentityFunction(type_: Named<Monotype>): ts.PropertyAssignment {
    const grammarName: string = type_.type;
    const nodeName: string = nodeNameFrom(grammarName);
    const nodeType: ts.TypeReferenceNode = TypeReferenceNode(nodeName);
    const typePredicate: ts.TypePredicateNode = factory.createTypePredicateNode(NO.AssertsKeyword, IDENTIFIER.NODE, nodeType);

    const expression: ts.BinaryExpression = factory.createBinaryExpression(
        NODE_QUESTION_DOT_TYPE,
        TOKEN.TRIPLE_EQUALS,
        factory.createStringLiteral(grammarName)
    );

    const arrowFunction = factory.createArrowFunction(
        EMPTY.MODIFIERS,
        NO.TypeParameters,
        [NODE_PARAMETER],
        typePredicate,
        TOKEN.FAT_ARROW,
        expression
    );

    const property: ts.PropertyAssignment = factory.createPropertyAssignment(nodeName, arrowFunction);
    return property;
}

export function supertypeIdentityFunction(type_: Supertype): ts.PropertyAssignment {
    const nodeName: string = nodeNameFrom(type_.type);

    const nodeType: ts.TypeReferenceNode = TypeReferenceNode(nodeName);
    const predicate: ts.TypePredicateNode = factory.createTypePredicateNode(NO.AssertsKeyword, IDENTIFIER.NODE, nodeType);

    const body: ts.Expression = supertypeBody(type_.subtypes);
    const expression: ts.Expression = factory.createParenthesizedExpression(body);

    const arrowFunction: ts.ArrowFunction = factory.createArrowFunction(
        EMPTY.MODIFIERS,
        NO.TypeParameters,
        [NODE_PARAMETER],
        predicate,
        TOKEN.FAT_ARROW,
        expression
    );

    const property: ts.PropertyAssignment = factory.createPropertyAssignment(nodeName, arrowFunction);
    return property;
}

function supertypeBody(subtypes: TypeNode[]): ts.Expression {
    const individualCalls: ts.CallExpression[] = subtypes
        .filter(isNamed)
        .map(subtype => nodeNameFrom(subtype.type))
        .map(callIdentityFunction);

    const body: ts.Expression = nestedLogicalOr(individualCalls);
    return body;
}

function callIdentityFunction(name: string): ts.CallExpression {
    const function_: ts.PropertyAccessExpression = factory.createPropertyAccessExpression(IDENTIFIER.NODE_IS, name);

    const call: ts.CallExpression = factory.createCallExpression(function_, NO.TypeArguments, [IDENTIFIER.NODE]);
    return call;
}
