import { describe, test } from '@jest/globals';
import ts from 'typescript';
import { NO } from '../src/constants';
import { staticAssertType } from '../src/types';

describe('`NO` object typing', () => {
    test.each([
        [staticAssertType<ts.AccessorDeclaration | undefined>(NO.Accessor)],
        [staticAssertType<ts.AccessorDeclaration | undefined>(NO.Accessor)],
    ])('Static type assertions', _ => void {});
});
