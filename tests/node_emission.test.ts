import { describe, expect, test } from '@jest/globals';
import { emitNode, emitNodes } from '../src/convenience/printing';
import * as generate from '../src/generate';
import { TypeNode } from '../src/types/TypeNode';

describe('DTS', () => {
    let node_types_json: TypeNode[];

    beforeAll(() => {
        node_types_json = require('./testing-resources/node-types.example.json');
    });

    test('Leaves', () => {
        let leaves = generate.leaves(node_types_json);
        expect(leaves.length).toBeGreaterThan(0);

        let text = emitNodes(leaves);
        expect(text.length).toBeTruthy;
    });

    test('SuperTypes', () => {
        let supertypes = generate.supertypes(node_types_json);
        expect(supertypes.length).toBeGreaterThan(0);

        let text = emitNodes(supertypes);
        expect(text.length).toBeTruthy;
    });

    test('Branches', () => {
        let branches = generate.branches(node_types_json);
        expect(branches.length).toBeGreaterThan(0);

        let text = emitNodes(branches);
        expect(text.length).toBeTruthy;
    });

    test('Godtype', () => {
        let godtype = generate.godtype(node_types_json);
        let text = emitNode(godtype);
        expect(text.length).toBeTruthy;
    });
});
