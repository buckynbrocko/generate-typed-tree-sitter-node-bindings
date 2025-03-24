// Typed, but otherwise Taken from https://github.com/tree-sitter/node-tree-sitter/blob/8ff5c15c1fb521a42b192f0139ed8e7b5bc67ed9/index.js#L905
function referenceCamelCase(name: string, capital: boolean): string {
    name = name.replace(/_(\w)/g, (_match, letter) => letter.toUpperCase());
    if (capital) name = name[0].toUpperCase() + name.slice(1);
    return name;
}

function camelCase(text: string): string {
    let camel = text.replace(/_(\w)/g, (_match, letter) => letter.toUpperCase());
    return camel;
}

function pascalCase(text: string): string {
    let camel = camelCase(text);
    let pascal = camel[0].toUpperCase() + camel.slice(1);
    return pascal;
}

export function nodeClassName(name: string): string {
    const result = pascalCase(name) + 'Node';
    return result;
}

export function fieldGetterName(name: string, multiple: boolean): string {
    let result = camelCase(name) + 'Node';
    if (multiple) {
        result += 's';
    }
    return result;
}


export function nodeNameFrom(originalName: string, cache?: Map<string, string>): string {
    if (cache?.has(originalName)) {
        let cached: string = cache.get(originalName)!;
        return cached;
    }

    let nodeIsHidden: boolean = originalName.startsWith('_');
    let nodeName: string = nodeClassName(originalName);

    if (nodeIsHidden) {
        nodeName = '_' + nodeName;
    }

    if (cache) {
        cache.set(originalName, nodeName);
    }

    return nodeName;
}
