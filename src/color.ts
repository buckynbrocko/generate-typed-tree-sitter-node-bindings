export const yellow: (text: string) => string = foreground(33);
export const green: (text: string) => string = foreground(32);

export function streeng(text: string): string {
    return green(quote(text));
}

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
