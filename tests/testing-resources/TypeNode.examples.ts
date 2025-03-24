import { Branch, Leaf, Supertype } from '../../src/types/TypeNode';

export const LEAF_NAMED: Leaf = { type: 'leaf_named', named: true };
export const LEAF_ANONYMOUS: Leaf = { type: 'leaf_anonymous', named: false };
export const SUPERTYPE: Supertype = { type: 'supertype', named: true, subtypes: [LEAF_ANONYMOUS] };
export const SUPERTYPE_NO_SUBTYPES: Supertype = { type: 'supertype_no_subtypes', named: true, subtypes: [] };
export const BRANCH_STUBBY = {
    type: 'branch_stubby',
    named: true,
    fields: {},
};
export const BRANCH_WITH_FIELDS: Branch = {
    type: 'branch_with_fields',
    named: true,
    fields: {
        field: {
            multiple: false,
            required: true,
            types: [LEAF_NAMED],
        },
    },
};
export const BRANCH_WITH_CHILDREN: Branch = {
    type: 'branch_with_children',
    named: true,
    fields: {},
    children: {
        multiple: true,
        required: true,
        types: [LEAF_NAMED, LEAF_ANONYMOUS, SUPERTYPE],
    },
};
export const BRANCH_WITH_BOTH: Branch = {
    type: 'branch_with_both',
    named: true,
    fields: {
        field: {
            multiple: false,
            required: true,
            types: [LEAF_NAMED],
        },
    },
    children: {
        multiple: true,
        required: true,
        types: [LEAF_NAMED, LEAF_ANONYMOUS, SUPERTYPE],
    },
};
