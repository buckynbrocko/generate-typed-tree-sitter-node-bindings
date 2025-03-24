import { describe, expect, test } from '@jest/globals';
import { fieldGetterName, nodeClassName, nodeNameFrom } from '../src/naming';

describe('Name-mangling functions', () => {
    test.each([
        ['name', 'NameNode'],
        ['_name', '_NameNode'],
        ['what_is_a_name', 'WhatIsANameNode'],
        ['_what_is_a_name', '_WhatIsANameNode'],
    ])("nodeNameFrom('%s')", (input: string, expected: string) => {
        let mangled: string = nodeNameFrom(input);
        expect(mangled).toEqual(expected);
    });

    test.each([
        ['name', 'NameNode'],
        ['_name', 'NameNode'],
        ['what_is_a_name', 'WhatIsANameNode'],
        ['_what_is_a_name', 'WhatIsANameNode'],
    ])("nodeClassName('%s')", (input: string, expected: string) => {
        let mangled: string = nodeClassName(input);
        expect(mangled).toEqual(expected);
    });

    test.each([
        ['name', 'nameNode'],
        ['_name', 'NameNode'],
        ['what_is_a_name', 'whatIsANameNode'],
        ['_what_is_a_name', 'WhatIsANameNode'],
    ])("fieldNameFrom('%s', false)", (input: string, expected: string) => {
        let actual: string = fieldGetterName(input, false);
        expect(actual).toEqual(expected);
    });

    test.each([
        ['name', 'nameNodes'],
        ['_name', 'NameNodes'],
        ['what_is_a_name', 'whatIsANameNodes'],
        ['_what_is_a_name', 'WhatIsANameNodes'],
    ])("fieldNameFrom('%s', true)", (input: string, expected: string) => {
        let actual: string = fieldGetterName(input, true);
        expect(actual).toEqual(expected);
    });
});
