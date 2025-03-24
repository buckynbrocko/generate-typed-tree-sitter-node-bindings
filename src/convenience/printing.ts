import * as ts from 'typescript';

const DUMMY_SOURCE: ts.SourceFile = ts.createSourceFile('', '', ts.ScriptTarget.Latest);
const PRINTER = ts.createPrinter();

export function emitNode(node: ts.Node): string {
    let text: string = PRINTER.printNode(ts.EmitHint.Unspecified, node, DUMMY_SOURCE);

    return text;
}

export function emitNodes(nodes: ts.Node[], separator: string = '\n'): string {
    let texts: string[] = nodes.map(emitNode);
    let text: string = texts.join(separator);

    return text;
}
