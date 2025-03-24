import { describe, test } from '@jest/globals';
import { writeFileSync } from 'fs';
import * as generate from '../src/generate';
import { NonEmptyArray } from '../src/types';
import { TypeNode } from '../src/types/TypeNode';

describe('Utility Generation', () => {
    let node_types: TypeNode[];

    beforeAll(() => {
        node_types = require('./testing-resources/node-types.example.json');
    });

    test('generate example binding', () => {
        let text = generate.dts(node_types as NonEmptyArray);
        writeFileSync('./tests/test-generated-bindings/example_bindings.ts', text);
        expect(text).toBeDefined;
    });
});
