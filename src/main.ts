import * as fs from 'fs';
import * as path from 'path';
import { streeng, yellow } from './color';
import {
    AlreadyExistsAndNotAFileError,
    NotAFileError,
    ParentDirectoryDoesNotExistError,
    PathDoesNotExistError,
} from './errorHandling';
import * as generate from './generate';
import { PathString, TypeNode, parseNodeTypes } from './types';
import { DEFAULT_GENERATION_OPTIONS, GenerationOptions } from './types/GenerationOptions';

function noop(text: string): string {
    return text;
}

export function run(nodeTypes: PathString, destination: PathString, options_: Partial<GenerationOptions> = {}) {
    let options: GenerationOptions = { ...DEFAULT_GENERATION_OPTIONS, ...options_ };

    if (options.debug) {
        console.log(`cwd: ${streeng(process.cwd())}`);
        console.log(`Given ${yellow('node-types.json')} path: ${streeng(nodeTypes)}`);
        console.log(`Given ${yellow('destination')} path: ${streeng(destination)}`);
    }
    nodeTypes = path.resolve(nodeTypes);
    destination = path.resolve(destination);
    if (options.debug) {
        console.log(`Resolved ${yellow('node-types.json')} path: ${streeng(nodeTypes)}`);
        console.log(`Resolved ${yellow('destination')} path: ${streeng(destination)}`);
    }

    validatePaths(nodeTypes, destination);

    let json: string = fs.readFileSync(nodeTypes, 'utf-8');
    let types: TypeNode[] = parseNodeTypes(json);
    let text: string = generate.dts(types, options);

    if (!options.dryRun) {
        fs.writeFileSync(destination, text, { encoding: 'utf-8' });
    }
}

function validatePaths(nodeTypes: string, destination: string) {
    if (!fs.existsSync(nodeTypes)) {
        throw new PathDoesNotExistError(nodeTypes, 'node-types.json');
    } else if (!fs.lstatSync(nodeTypes).isFile()) {
        throw new NotAFileError(nodeTypes, 'node-types.json');
    }

    const destinationParent: string = path.dirname(destination);
    if (!fs.existsSync(destinationParent)) {
        throw new ParentDirectoryDoesNotExistError(destinationParent, 'destination');
    } else if (fs.existsSync(destination) && !fs.lstatSync(destination).isFile()) {
        throw new AlreadyExistsAndNotAFileError(destination, 'destination');
    }
}
