import { raise } from '../errorHandling';

function TypeNodeFrom(object: any): TypeNode {
    isTypeNode(object) || raise('Object is not a TypeNode');
    return object;
}

export function parseNodeTypes(json: string): TypeNode[] {
    json.length || raise('Empty JSON string was provided');
    let object: any = JSON.parse(json);
    Array.isArray(object) || raise('JSON object is not an array');
    let nodes: TypeNode[] = object.map(TypeNodeFrom);
    return nodes;
}

export type Required<T> = T & { required: true };
export type Optional<T> = T & { required: false };

export type Named<T> = T & { named: true };
export type Anonymous<T> = T & { named: false };

export type Monotype = Exclude<TypeNode, Supertype>;

export type TypeNode = Branch | Leaf | Supertype;

// TODO?: use types exported by official `tree-sitter` bindings if compatible?

export type Leaf = {
    type: string;
    named: boolean;
};

export type Supertype = Named<Leaf> & {
    subtypes: Leaf[];
};

export type Branch = Named<Leaf> & {
    fields: Record<string, Field>;
    children?: Children;
};

export type Field = {
    multiple: boolean;
    required: boolean;
    types: Leaf[];
};

export type Children = {
    multiple: boolean;
    required: boolean;
    types: Leaf[];
};

export function isTypeNode(object: any): object is TypeNode {
    return typeof object.named === 'boolean' && typeof object.type === 'string';
}

export function isLeaf(node: TypeNode): node is Leaf {
    return !('subtypes' in node || isBranch(node));
}

export function isSupertype(node: TypeNode): node is Supertype {
    return 'subtypes' in node;
}

export function isMonotype(node: TypeNode): node is Exclude<TypeNode, Supertype> {
    return !isSupertype(node);
}

export function isBranch(node: TypeNode): node is Branch {
    return 'children' in node || ('fields' in node && Object.entries(node.fields).length > 0);
}

export function isNamed(node: TypeNode): node is Named<TypeNode> {
    return node.named;
}

export function isAnonymous(node: TypeNode): node is Anonymous<TypeNode> {
    return !node.named;
}
