import { describe, expect, test } from '@jest/globals';
import { TypeNode, isAnonymous, isBranch, isLeaf, isMonotype, isNamed, isSupertype } from '../src/types/TypeNode';
import * as EX from './testing-resources/TypeNode.examples';

function remap_test(input: [TypeNode, boolean]): [string, TypeNode, boolean] {
    return [input[0].type, input[0], input[1]];
}

function remap_tests(tests: [TypeNode, boolean][]): [string, TypeNode, boolean][] {
    return tests.map(remap_test);
}

describe('`TypeNode` discriminator functions', () => {
    test.each(
        remap_tests([
            [EX.LEAF_NAMED, true],
            [EX.LEAF_ANONYMOUS, true],
            [EX.BRANCH_STUBBY, true],
            [EX.BRANCH_WITH_BOTH, false],
            [EX.BRANCH_WITH_FIELDS, false],
            [EX.BRANCH_WITH_CHILDREN, false],
            [EX.SUPERTYPE, false],
            [EX.SUPERTYPE_NO_SUBTYPES, false],
        ])
    )('isLeaf: %s', (_, node: TypeNode, expected: boolean) => {
        const actual = isLeaf(node);
        expect(actual).toEqual(expected);
    });

    test.each(
        remap_tests([
            [EX.LEAF_NAMED, false],
            [EX.LEAF_ANONYMOUS, false],
            [EX.BRANCH_STUBBY, false],
            [EX.BRANCH_WITH_BOTH, true],
            [EX.BRANCH_WITH_FIELDS, true],
            [EX.BRANCH_WITH_CHILDREN, true],
            [EX.SUPERTYPE, false],
            [EX.SUPERTYPE_NO_SUBTYPES, false],
        ])
    )('isBranch: %s', (_, node: TypeNode, expected: boolean) => {
        const actual = isBranch(node);
        expect(actual).toEqual(expected);
    });

    test.each(
        remap_tests([
            [EX.LEAF_NAMED, false],
            [EX.LEAF_ANONYMOUS, false],
            [EX.BRANCH_STUBBY, false],
            [EX.BRANCH_WITH_BOTH, false],
            [EX.BRANCH_WITH_FIELDS, false],
            [EX.BRANCH_WITH_CHILDREN, false],
            [EX.SUPERTYPE, true],
            [EX.SUPERTYPE_NO_SUBTYPES, true],
        ])
    )('isSupertype: %s', (_, node: TypeNode, expected: boolean) => {
        const actual = isSupertype(node);
        expect(actual).toEqual(expected);
    });

    test.each(
        remap_tests([
            [EX.LEAF_NAMED, true],
            [EX.LEAF_ANONYMOUS, true],
            [EX.BRANCH_STUBBY, true],
            [EX.BRANCH_WITH_BOTH, true],
            [EX.BRANCH_WITH_FIELDS, true],
            [EX.BRANCH_WITH_CHILDREN, true],
            [EX.SUPERTYPE, false],
            [EX.SUPERTYPE_NO_SUBTYPES, false],
        ])
    )('isMonotype: %s', (_, node: TypeNode, expected: boolean) => {
        const actual = isMonotype(node);
        expect(actual).toEqual(expected);
    });

    test.each(
        remap_tests([
            [EX.LEAF_NAMED, true],
            [EX.LEAF_ANONYMOUS, false],
            [EX.BRANCH_STUBBY, true],
            [EX.BRANCH_WITH_BOTH, true],
            [EX.BRANCH_WITH_FIELDS, true],
            [EX.BRANCH_WITH_CHILDREN, true],
            [EX.SUPERTYPE, true],
            [EX.SUPERTYPE_NO_SUBTYPES, true],
        ])
    )('isNamed: %s', (_, node: TypeNode, expected: boolean) => {
        const actual = isNamed(node);
        expect(actual).toEqual(expected);
    });

    test.each(
        remap_tests([
            [EX.LEAF_NAMED, false],
            [EX.LEAF_ANONYMOUS, true],
            [EX.BRANCH_STUBBY, false],
            [EX.BRANCH_WITH_BOTH, false],
            [EX.BRANCH_WITH_FIELDS, false],
            [EX.BRANCH_WITH_CHILDREN, false],
            [EX.SUPERTYPE, false],
            [EX.SUPERTYPE_NO_SUBTYPES, false],
        ])
    )('isAnonymous: %s', (_, node: TypeNode, expected: boolean) => {
        const actual = isAnonymous(node);
        expect(actual).toEqual(expected);
    });
});
