import * as ts from 'typescript';
import { addLeadingSingleLineComment, ImportDeclaration } from '../convenience/constructors';
import { emitNodes } from '../convenience/printing';
import { DEFAULT_GENERATION_OPTIONS, GenerationOptions } from '../types/GenerationOptions';
import { TypeNode } from '../types/TypeNode';
import { branches } from './branches';
import { leaves } from './leaves';
import { supertypes } from './supertypes';
import { syntaxNodeOfType } from './SyntaxNodeOfType';
import { utilityFunctions } from './utitilityFunctions';

export function dts(types: TypeNode[], options: GenerationOptions = DEFAULT_GENERATION_OPTIONS): string {
    const statements_: ts.Statement[] = statements(types, options);
    const text: string = emitNodes(statements_);
    return text;
}

export function statements(types: TypeNode[], options: GenerationOptions = DEFAULT_GENERATION_OPTIONS): ts.Statement[] {
    let import_: ts.Statement[] = [];
    if (options.includeSyntaxNodeImport) {
        import_.push(ImportDeclaration('tree-sitter', 'SyntaxNode'));
    }

    const syntaxNodeOfType_: ts.InterfaceDeclaration = syntaxNodeOfType();
    const interfaces_: ts.Statement[] = interfaces(types, options);
    const supertypes_: ts.Statement[] = supertypes(types, options);
    const utilities: ts.Statement[] = utilityFunctions(types, options);

    const statements: ts.Statement[] = [...import_, syntaxNodeOfType_, ...interfaces_, ...supertypes_, ...utilities];
    return statements;
}

export function interfaces(types: TypeNode[], options: GenerationOptions = DEFAULT_GENERATION_OPTIONS): ts.Statement[] {
    let leaves_: ts.InterfaceDeclaration[] = leaves(types);
    let branches_: ts.InterfaceDeclaration[] = branches(types, options);

    if (options.includeSectionComments) {
        leaves_ = addLeadingSingleLineComment(leaves_, 'Leaf Types', true);
        branches_ = addLeadingSingleLineComment(branches_, 'Branch Types', true);
    }

    const interfaces: ts.Statement[] = [...leaves_, ...branches_];
    return interfaces;
}
