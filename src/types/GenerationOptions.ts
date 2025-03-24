export type GenerationOptions = {
    debug: boolean;
    includeSyntaxNodeImport: boolean;
    includeSectionComments: boolean;
    includeIdentityFunctions: boolean;
    includeGodType: boolean;
    dryRun: boolean;
};

export const DEFAULT_GENERATION_OPTIONS: GenerationOptions = {
    debug: false,
    includeSyntaxNodeImport: true,
    includeSectionComments: true,
    includeIdentityFunctions: true,
    includeGodType: true,
    dryRun: false
};
