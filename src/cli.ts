import { parseArgs } from 'util';
import { yellow } from './color';
import { raise } from './errorHandling';
import { run } from './main';
import { DEFAULT_GENERATION_OPTIONS, GenerationOptions } from './types';
import { PARSE_ARGS_OPTIONS } from './types/ParseArgsOptionsConfig';

const { values, positionals } = parseArgs({ options: PARSE_ARGS_OPTIONS, allowPositionals: true });

const debug: boolean = !!values['debug'];
if (debug) {
    console.log('values:');
    console.log(values);
    console.log('positionals');
    console.log(positionals);
}

const nodeTypes: string =
    typeof values['nodeTypes'] === 'string'
        ? values['nodeTypes']
        : positionals.shift() || raise(`Required argument ${yellow('`nodeTypes`')} missing`);
const destination: string =
    typeof values['destination'] === 'string'
        ? values['destination']
        : positionals.shift() || raise(`Required argument ${yellow('`destination`')} missing`);

const generationOptions: GenerationOptions = {
    ...DEFAULT_GENERATION_OPTIONS,
    debug: debug,
    includeSyntaxNodeImport: !!values['includeSyntaxNodeImport'],
    includeSectionComments: !!values['includeSectionComments'],
    includeIdentityFunctions: !!values['includeIdentityFunctions'],
    includeGodType: !!values['includeGodType'],
    dryRun: !!values['dryRun'],
};

run(nodeTypes, destination, generationOptions);
