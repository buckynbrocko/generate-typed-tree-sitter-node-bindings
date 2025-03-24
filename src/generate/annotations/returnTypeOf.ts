import * as ts from 'typescript';
import { TYPE_REFERENCE } from '../../constants';
import { UnionType } from '../../convenience/constructors';
import { Children, Named, TypeNode, isAnonymous, isNamed } from '../../types/TypeNode';

export namespace namedChild {
    export function properties(children: Children): ts.TypeNode {
        let returnType: ts.TypeNode;

        let hasNamed: boolean = children.types.some(isNamed);
        if (hasNamed) {
            const named: Named<TypeNode>[] = children.types.filter(isNamed);
            const areRequired: boolean = children.required;
            const hasAnonymous: boolean = children.types.some(isAnonymous);
            const areNullable: boolean = !areRequired || (areRequired && hasAnonymous);

            returnType = UnionType(named, areNullable);
        } else {
            returnType = TYPE_REFERENCE.NULL;
        }

        return returnType;
    }

    export function methods(children: Children): ts.TypeNode {
        const hasNamed: boolean = children.types.some(isNamed);
        if (hasNamed) {
            const named: Named<TypeNode>[] = children.types.filter(isNamed);
            return UnionType(named, true);
        }
        return TYPE_REFERENCE.NULL;
    }
}

export namespace anonymousChild {
    export function properties(children: Children): ts.TypeNode {
        let returnType: ts.UnionTypeNode | ts.TypeReferenceNode;
        const hasNamed: boolean = children.types.some(isNamed);
        if (hasNamed && children.required) {
            returnType = UnionType(children.types, false);
        } else if (hasNamed && !children.required) {
            returnType = UnionType(children.types, true);
        } else if (!hasNamed && children.required) {
            returnType = TYPE_REFERENCE.SYNTAX_NODE;
        } else if (!hasNamed && !children.required) {
            returnType = UnionType([TYPE_REFERENCE.SYNTAX_NODE._typeNodeBrand], true);
        } else {
            throw "The if statements were exhaustive so this *probably* shouldn't happen";
        }
        return returnType;
    }

    export function methods(children: Children): ts.TypeNode {
        let returnType: ts.UnionTypeNode;

        const hasNamed: boolean = children.types.some(isNamed);
        const hasAnonymous: boolean = children.types.some(isAnonymous);

        if (!hasNamed && hasAnonymous) {
            returnType = UnionType([TYPE_REFERENCE.SYNTAX_NODE._typeNodeBrand], true);
        } else if (hasNamed && !hasAnonymous) {
            returnType = UnionType(children.types, true);
        } else if (hasNamed && hasAnonymous) {
            let types = [...children.types, TYPE_REFERENCE.SYNTAX_NODE._typeNodeBrand];
            returnType = UnionType(types, true);
        } else {
            throw 'This is **assumed** to be unreachable, but, well here we are';
        }

        return returnType;
    }
}
