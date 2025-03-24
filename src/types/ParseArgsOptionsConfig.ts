// Ripped from `node.util.d.ts`. Not originally exported (for some reason), but the compiler throws a type error with `parseArgs`, so let's repeat ourselves
interface ParseArgsOptionConfig {
    type: 'string' | 'boolean';
    multiple?: boolean | undefined;
    short?: string | undefined;
    default?: string | boolean | string[] | boolean[] | undefined;
}

interface ParseArgsOptionsConfig {
    [longOption: string]: ParseArgsOptionConfig;
}

export const PARSE_ARGS_OPTIONS: ParseArgsOptionsConfig = {
    nodeTypes: {
        type: 'string',
    },
    destination: {
        type: 'string',
    },
    debug: {
        type: 'boolean',
        default: false,
    },
    includeSyntaxNodeImport: {
        type: 'boolean',
        default: true,
    },
    includeSectionComments: {
        type: 'boolean',
        default: true,
    },
    includeIdentityFunctions: {
        type: 'boolean',
        default: true,
    },
    includeGodType: {
        type: 'boolean',
        default: true,
    },
};
