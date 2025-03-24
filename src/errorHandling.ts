type Returns<R> = () => R;
type ReturnsOrIs<R> = R | Returns<R>;

function isFunction(object_: any): object_ is Function {
    return typeof object_ === 'function';
}

const defaultRaiseOnError: string = 'A non-descript error was raised';

export function assert(
    condition: boolean | true | false | Returns<boolean>,
    raiseOnError: any = defaultRaiseOnError,
    useColor: boolean = true
): void {
    if (isFunction(condition)) {
        condition = condition();
    }
    condition || raise(raiseOnError, useColor);
}

export function raise<R>(error_: R | string = defaultRaiseOnError, useColor: boolean = true): never {
    if (error_ instanceof Error) {
        throw error_;
    }
    let error = new Error(errorPrefix(useColor) + error_);
    Error.captureStackTrace(error, raise);
    if (typeof error.stack === 'string') {
        error.stack = error.stack.slice(7);
    }
    throw error;
}

export function errorOut(error: string, useColor: boolean = true): void {
    console.error(errorPrefix(useColor) + error);
    process.exitCode = 1;
    return;
}

function errorPrefix(useColor: boolean): string {
    return useColor ? red('Error: ') : 'Error: ';
}

function red(text: string): string {
    return `\x1b[31m${text}\x1b[39m`;
}

export class CustomError extends Error {
    constructor(message: string) {
        super(message);
        Object.defineProperty(this, 'name', { value: red(new.target.name) });
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class PathDoesNotExistError extends CustomError {
    constructor(path: string, name?: string) {
        let message: string = `${streeng(path)}`;
        if (name !== undefined) {
            message = `Path given for ${yellow(name)} does not exist: ${message}`;
        }
        super(message);
    }
}

export class ParentDirectoryDoesNotExistError extends CustomError {
    constructor(path: string, name?: string) {
        let message: string = `${streeng(path)}`;
        if (name !== undefined) {
            message = `Parent directory for given ${yellow(name)} path does not exist: ${message}`;
        }
        super(message);
    }
}

export class NotAFileError extends CustomError {
    constructor(path: string, name?: string) {
        let message: string = `${streeng(path)}`;
        if (name !== undefined) {
            message = `Path given for ${yellow(name)} is not a file: ${message}`;
        }
        super(message);
    }
}

export class AlreadyExistsAndNotAFileError extends CustomError {
    constructor(path: string, name?: string) {
        let message: string = `${streeng(path)}`;
        if (name !== undefined) {
            message = `Path given for ${yellow(name)} already exists and is not a file: ${message}`;
        }
        super(message);
    }
}

export function streeng(text: string): string {
    return green(quote(text));
}

export const yellow: (text: string) => string = foreground(33);

export const green: (text: string) => string = foreground(32);

type Quote = "'" | '"' | '`';

function quote(text: string, quote: Quote = "'"): string {
    return quote + text + quote;
}

function foreground(colorCode: string | number) {
    return (text: string): string => escape(colorCode) + text + escape(39);
}

function escape(...codes: (string | number)[]): string {
    return `\x1b[${codes.join(';')}m`;
}
