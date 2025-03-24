import { describe, expect, test } from '@jest/globals';
import {
    AlreadyExistsAndNotAFileError,
    NotAFileError,
    ParentDirectoryDoesNotExistError,
    PathDoesNotExistError,
} from '../src/errorHandling';
import { run } from '../src/main';
import assert = require('assert');

describe('Expected errors', () => {
    const NODE_TYPES = './tests/testing-resources/node-types.example.json';
    const DOES_NOT_EXIST = './tests/testing-resources/does-not-exist';
    const PARENT_DOES_NOT_EXIST = './tests/testing-resources/parent-does-not-exist/does-not-exist';
    const NOT_AN_ARRAY = './tests/testing-resources/not-an-array.json';
    const EMPTY_FILE = './tests/testing-resources/empty-file';
    const WRONG_FILE_TYPE = './tests/testing-resources/TypeNode.examples.ts';
    const NOT_A_FILE = './tests/testing-resources';
    const _ = './tests/test-generated-bindings/wont_be_created.ts';
    test.each([
        [DOES_NOT_EXIST, _, PathDoesNotExistError, ['node-types.json', 'path', 'does not exist']],
        [NOT_A_FILE, _, NotAFileError, ['node-types.json', 'not a file']],
        [NODE_TYPES, NOT_A_FILE, AlreadyExistsAndNotAFileError, ['destination', 'not a file']],
        [NOT_AN_ARRAY, _, Error, ['JSON', 'not an array']],
        [EMPTY_FILE, _, Error, ['Empty', 'JSON', 'string']],
        [WRONG_FILE_TYPE, _, SyntaxError, ['not valid JSON']],
        [
            NODE_TYPES,
            PARENT_DOES_NOT_EXIST,
            ParentDirectoryDoesNotExistError,
            ['directory', 'destination', 'path does not exist'],
        ],
    ])('cli value errors', (nodeTypes: string, destination: string, superclass, substrings: string[]) => {
        try {
            run(nodeTypes, destination, { dryRun: true });
            expect(false).toBeTruthy();
        } catch (error) {
            assert(error instanceof superclass);
            expect(substrings.length).toBeGreaterThan(0);
            substrings.forEach(substring => expect(error.message.toLowerCase()).toContain(substring.toLowerCase()));
        }
    });
});
