import * as ts from 'typescript';
import { ExportedInterface } from '../convenience/constructors';
import { nodeNameFrom } from '../naming';
import { DEFAULT_GENERATION_OPTIONS, GenerationOptions } from '../types/GenerationOptions';
import { Branch, TypeNode, isBranch } from '../types/TypeNode';
import * as signatureOf from './annotations/signatureOf';
import { extendsSyntaxNodeOfType } from './SyntaxNodeOfType';

export function branches(
    types: TypeNode[],
    options: GenerationOptions = DEFAULT_GENERATION_OPTIONS
): ts.InterfaceDeclaration[] {
    const branches: ts.InterfaceDeclaration[] = types.filter(isBranch).map(branch_ => branch(branch_, options));
    return branches;
}

export function branch(branch: Branch, options: GenerationOptions = DEFAULT_GENERATION_OPTIONS): ts.InterfaceDeclaration {
    const name: string = nodeNameFrom(branch.type);
    const heritageClause: ts.HeritageClause = extendsSyntaxNodeOfType(branch.type);
    const memberSignatures: ts.TypeElement[] = signatureOf.members(branch, options);

    const declaration: ts.InterfaceDeclaration = ExportedInterface(name, [heritageClause], memberSignatures);
    return declaration;
}
