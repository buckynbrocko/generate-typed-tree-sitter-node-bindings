import * as ts from 'typescript';
import { Index, Mapping } from './Dict';

export * from './Dict';
export * from './GenerationOptions';
export * from './TypeNode';
export function staticAssertType<T>(arg: T): void {}

export * from './unions';

export type PathString = string;

export type Params = Mapping<ts.TypeNode>;

export type TypeAssertion<T> = (arg: any) => arg is T;
export type AssertionType<F> = F extends TypeAssertion<infer T> ? T : never;
export type TypeAssertionObject<O> = O extends Record<Index, TypeAssertion<unknown>>
    ? {
          [Property in keyof O]: O[Property] extends TypeAssertion<infer T> ? TypeAssertion<T> : never;
      }
    : never;

export type KeyStartsWithIS<T> = T extends `is${infer Key}` ? Key : never;

export type EmptyArrayOf<T = any> = T[] & [];
export type EmptyArray<T = any> = EmptyArrayOf<T>;
export type NonEmptyArrayOf<T> = [T, ...T[]];
export type NonEmptyArray = NonEmptyArrayOf<any>;

export function cast<T>(object: any): T {
    return object;
}
