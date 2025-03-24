import * as ts from 'typescript';
import { factory } from 'typescript';
import { AssertionType, KeyStartsWithIS, Params, staticAssertType } from './types';

/** Special cases where defaults for empty array arguments are undefined instead of actually empty arrays */
type NO_SPECIAL = {
    TypeArguments?: ts.TypeNode[];
    TypeParameters?: ts.TypeParameterDeclaration[];
};

/**
Maps the name of all asserted types of Type Guards with to a property of either said type or `undefined`.

ex: `function isExpression(node: Node): node is Expression;` becomes `Expression: ts.Expression | undefined;`
*/
type NOType = NO_SPECIAL & {
    [Key in keyof typeof ts as KeyStartsWithIS<Key>]: AssertionType<(typeof ts)[Key]> | undefined;
};

function cast<T>(object: any): T {
    return object;
}

/** All property accesses intentionally return `undefined`. Typecast for auto-completion/type-checking.
 *
 * i.e. `tsc` believes `NO.Expression` is type `Expression | undefined` and `NO.TypeArguments` is `TypeNode[] | undefined`, but both will always actually be `undefined`.*/
export const NO: NOType = cast<NOType>({});

staticAssertType<ts.AccessorDeclaration | undefined>(NO.Accessor);

export namespace EMPTY {
    export const MODIFIERS: ts.Modifier[] = [];
    export const MEMBERS: ts.TypeElement[] = [];
}

export const EXPORT_MODIFIER_ONLY: ts.Modifier[] = [factory.createModifier(ts.SyntaxKind.ExportKeyword)];
export const CHILD_METHOD_PARAMETERS: Params = { index: factory.createTypeReferenceNode('number') };

export const TOKEN = {
    QUESTION: factory.createToken(ts.SyntaxKind.QuestionToken),
    TRIPLE_EQUALS: factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
    FAT_ARROW: factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
};

export const IDENTIFIER = {
    NODE: factory.createIdentifier('node'),
    SYNTAX_NODE: factory.createIdentifier('SyntaxNode'),
    SYNTAX_NODE_OF_TYPE: factory.createIdentifier('SyntaxNodeOfType'),
    NODE_IS: factory.createIdentifier('nodeIs'),
};

export const NODE_QUESTION_DOT_TYPE: ts.PropertyAccessChain = factory.createPropertyAccessChain(
    IDENTIFIER.NODE,
    factory.createToken(ts.SyntaxKind.QuestionDotToken),
    'type'
);

export const TYPE_REFERENCE = {
    NULL: factory.createTypeReferenceNode('null'),
    SYNTAX_NODE: factory.createTypeReferenceNode('SyntaxNode'),
};

export const NODE_PARAMETER: ts.ParameterDeclaration = factory.createParameterDeclaration(
    EMPTY.MODIFIERS,
    NO.DotDotDotToken,
    'node',
    TOKEN.QUESTION,
    TYPE_REFERENCE.SYNTAX_NODE
);
