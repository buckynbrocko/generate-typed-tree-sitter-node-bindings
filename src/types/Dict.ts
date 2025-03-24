export type Index = symbol | string | number;

export type Mapping<V> = {
    [index: Index]: V;
};

export class Dict<K extends Index, V> extends Map<K, V> {
    map<R = any>(callbackfn: (value: [K, V], index: number, array: [K, V][]) => R, thisArg?: any): R[] {
        return Array.from(this.entries()).map(callbackfn, thisArg);
    }
    static fromRecord<V>(record: Mapping<V>): Dict<string, V> {
        let entries: [string, V][] = Object
            .getOwnPropertyNames(record)
            .map(name => [name, record[name]]);
        return new Dict(entries);
    }
}
