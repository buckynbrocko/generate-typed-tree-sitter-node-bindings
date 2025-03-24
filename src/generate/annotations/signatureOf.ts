import * as ts from 'typescript';
import { factory } from 'typescript';
import { CHILD_METHOD_PARAMETERS, TOKEN } from '../../constants';
import { MethodSignature, PropertySignature, UnionType, addLeadingSingleLineComment } from '../../convenience/constructors';
import { fieldGetterName } from '../../naming';
import { Dict } from '../../types/Dict';
import { DEFAULT_GENERATION_OPTIONS, GenerationOptions } from '../../types/GenerationOptions';
import { Branch, Children, Field, isNamed } from '../../types/TypeNode';
import { isSyntaxNodeAndNull } from '../../types/unions';
import * as returnTypeOf from './returnTypeOf';

export type AttributeSignature = ts.PropertySignature | ts.MethodSignature | ts.TypeElement;

export function members(branch: Branch, options: GenerationOptions = DEFAULT_GENERATION_OPTIONS): AttributeSignature[] {
    let fields_: AttributeSignature[] = fields(branch.fields);
    let ambiguousChildren_: AttributeSignature[] = ambiguousChildren(branch.children);
    let namedChildren_: AttributeSignature[] = namedChildren(branch.children);

    if (options.includeSectionComments) {
        fields_ = addLeadingSingleLineComment(fields_, 'Fields');
        ambiguousChildren_ = addLeadingSingleLineComment(ambiguousChildren_, 'Child Properties');
        namedChildren_ = addLeadingSingleLineComment(namedChildren_, 'Named Child Properties');
    }

    const signatures: AttributeSignature[] = [...fields_, ...ambiguousChildren_, ...namedChildren_];
    return signatures;
}

function fields(fields_: Record<string, Field>): ts.PropertySignature[] {
    const signatures: ts.PropertySignature[] = Dict.fromRecord(fields_).map(field_ => field(...field_));
    return signatures;
}

function field(originalName: string, field_: Field): ts.PropertySignature {
    const name: string = fieldGetterName(originalName, field_.multiple);
    const questionToken: ts.QuestionToken | undefined = field_.required ? undefined : TOKEN.QUESTION;
    const union: ts.UnionTypeNode = UnionType(field_.types);

    let annotation: ts.TypeNode;
    if (field_.multiple) {
        annotation = factory.createArrayTypeNode(union);
    } else {
        annotation = union;
    }

    const signature: ts.PropertySignature = PropertySignature(name, annotation, questionToken);

    return signature;
}

function ambiguousChildren(children?: Children): AttributeSignature[] {
    if (children === undefined) {
        return [];
    }

    const properties_: ts.PropertySignature[] = ambiguousChildProperties(children);
    const methods_: ts.MethodSignature[] = ambiguousChildMethods(children);

    const signatures: AttributeSignature[] = [...properties_, ...methods_];
    return signatures;
}

function ambiguousChildProperties(children: Children): ts.PropertySignature[] {
    const nonNullableType: ts.TypeNode = UnionType(children.types);
    const returnType: ts.TypeNode = returnTypeOf.anonymousChild.properties(children);

    const isUnion: boolean = ts.isUnionTypeNode(returnType);
    if (isUnion && isSyntaxNodeAndNull(returnType as ts.UnionTypeNode)) {
        return [];
    }
    const asArray: ts.ArrayTypeNode = factory.createArrayTypeNode(nonNullableType);

    const signatures: ts.PropertySignature[] = [
        PropertySignature('children', asArray),
        PropertySignature('firstChild', returnType),
        PropertySignature('lastChild', returnType),
    ];

    return signatures;
}

function ambiguousChildMethods(children: Children): ts.MethodSignature[] {
    const returnType: ts.TypeNode = returnTypeOf.anonymousChild.methods(children);

    if (isSyntaxNodeAndNull(returnType)) {
        return []; // Would be the same as the plain-old `SyntaxNode`: thus omitted
    }

    const signatures: ts.MethodSignature[] = [
        MethodSignature('child', CHILD_METHOD_PARAMETERS, returnType),
        MethodSignature('firstChildForIndex', CHILD_METHOD_PARAMETERS, returnType),
    ];

    return signatures;
}

function namedChildren(children?: Children): AttributeSignature[] {
    if (children === undefined) {
        return [];
    }

    const properties: ts.PropertySignature[] = namedChildProperties(children);
    const methods: ts.MethodSignature[] = namedChildMethods(children);

    const signatures: AttributeSignature[] = [...properties, ...methods];
    return signatures;
}

function namedChildMethods(children: Children): ts.MethodSignature[] {
    const returnType: ts.TypeNode = returnTypeOf.namedChild.methods(children);

    const signatures: ts.MethodSignature[] = [
        MethodSignature('namedChild', CHILD_METHOD_PARAMETERS, returnType),
        MethodSignature('firstNamedChildForIndex', CHILD_METHOD_PARAMETERS, returnType),
    ];

    return signatures;
}

function namedChildProperties(children: Children): ts.PropertySignature[] {
    const nonNullableType: ts.TypeNode = UnionType(children.types.filter(isNamed));
    const childType: ts.TypeNode = returnTypeOf.namedChild.properties(children);
    const arrayType: ts.ArrayTypeNode = factory.createArrayTypeNode(nonNullableType);

    const signatures: ts.PropertySignature[] = [
        PropertySignature('firstNamedChild', childType),
        PropertySignature('lastNamedChild', childType),
        PropertySignature('namedChildren', arrayType),
    ];

    return signatures;
}
