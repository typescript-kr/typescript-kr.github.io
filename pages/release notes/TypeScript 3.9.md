* [Improvements in Inference and `Promise.all`](#improvements-in-inference-and-promiseall)
* [Speed Improvements](#speed-improvements)
* [`// @ts-expect-error` Comments](#-ts-expect-error-comments)
* [Uncalled Function Checks in Conditional Expressions](#uncalled-function-checks-in-conditional-expressions)
* [에디터 개선](#editor-improvements)
    * [JavaScript에서 CommonJS 자동-Imports](#commonjs-auto-imports-in-javascript)
    * [코드 작업 개행 유지](#code-actions-preserve-newlines)
    * [누락된 반환문 빠른 수정](#quick-fixes-for-missing-return-expressions)
    * [`tsconfig.json` 파일 "솔루션 스타일" 지원](#support-for-solution-style-tsconfigjson-files)
* [Breaking Changes](#breaking-changes)

## Improvements in Inference and `Promise.all`

Recent versions of TypeScript (around 3.7) have had updates to the declarations of functions like `Promise.all` and `Promise.race`.
Unfortunately, that introduced a few regressions, especially when mixing in values with `null` or `undefined`.

```ts
interface Lion {
    roar(): void
}

interface Seal {
    singKissFromARose(): void
}

async function visitZoo(lionExhibit: Promise<Lion>, sealExhibit: Promise<Seal | undefined>) {
    let [lion, seal] = await Promise.all([lionExhibit, sealExhibit]);
    lion.roar(); // uh oh
//  ~~~~
// Object is possibly 'undefined'.
}
```

This is strange behavior!
The fact that `sealExhibit` contained an `undefined` somehow poisoned type of `lion` to include `undefined`.

Thanks to [a pull request](https://github.com/microsoft/TypeScript/pull/34501) from [Jack Bates](https://github.com/jablko), this has been fixed with improvements in our inference process in TypeScript 3.9.
The above no longer errors.
If you've been stuck on older versions of TypeScript due to issues around `Promise`s, we encourage you to give 3.9 a shot!

### What About the `awaited` Type?

If you've been following our issue tracker and design meeting notes, you might be aware of some work around [a new type operator called `awaited`](https://github.com/microsoft/TypeScript/pull/35998).
This goal of this type operator is to accurately model the way that `Promise` unwrapping works in JavaScript.

We initially anticipated shipping `awaited` in TypeScript 3.9, but as we've run early TypeScript builds with existing codebases, we've realized that the feature needs more design work before we can roll it out to everyone smoothly.
As a result, we've decided to pull the feature out of our main branch until we feel more confident.
We'll be experimenting more with the feature, but we won't be shipping it as part of this release.

## Speed Improvements

TypeScript 3.9 ships with many new speed improvements.
Our team has been focusing on performance after observing extremely poor editing/compilation speed with packages like material-ui and styled-components.
We've dived deep here, with a series of different pull requests that optimize certain pathological cases involving large unions, intersections, conditional types, and mapped types.

* https://github.com/microsoft/TypeScript/pull/36576
* https://github.com/microsoft/TypeScript/pull/36590
* https://github.com/microsoft/TypeScript/pull/36607
* https://github.com/microsoft/TypeScript/pull/36622
* https://github.com/microsoft/TypeScript/pull/36754
* https://github.com/microsoft/TypeScript/pull/36696

Each of these pull requests gains about a 5-10% reduction in compile times on certain codebases.
In total, we believe we've achieved around a 40% reduction in material-ui's compile time!

We also have some changes to file renaming functionality in editor scenarios.
We heard from the Visual Studio Code team that when renaming a file, just figuring out which import statements needed to be updated could take between 5 to 10 seconds.
TypeScript 3.9 addresses this issue by [changing the internals of how the compiler and language service caches file lookups](https://github.com/microsoft/TypeScript/pull/37055).

While there's still room for improvement, we hope this work translates to a snappier experience for everyone!

## `// @ts-expect-error` Comments

Imagine that we're writing a library in TypeScript and we're exporting some function called `doStuff` as part of our public API.
The function's types declare that it takes two `string`s so that other TypeScript users can get type-checking errors, but it also does a runtime check (maybe only in development builds) to give JavaScript users a helpful error.

```ts
function doStuff(abc: string, xyz: string) {
    assert(typeof abc === "string");
    assert(typeof xyz === "string");

    // do some stuff
}
```

So TypeScript users will get a helpful red squiggle and an error message when they misuse this function, and JavaScript users will get an assertion error.
We'd like to test this behavior, so we'll write a unit test.

```ts
expect(() => {
    doStuff(123, 456);
}).toThrow();
```

Unfortunately if our tests are written in TypeScript, TypeScript will give us an error!

```ts
    doStuff(123, 456);
//          ~~~
// error: Type 'number' is not assignable to type 'string'.
```

That's why TypeScript 3.9 brings a new feature: `// @ts-expect-error` comments.
When a line is prefixed with a `// @ts-expect-error` comment, TypeScript will suppress that error from being reported;
but if there's no error, TypeScript will report that `// @ts-expect-error` wasn't necessary.

As a quick example, the following code is okay

```ts
// @ts-expect-error
console.log(47 * "octopus");
```

while the following code

```ts
// @ts-expect-error
console.log(1 + 1);
```

results in the error

```
Unused '@ts-expect-error' directive.
```

We'd like to extend a big thanks to [Josh Goldberg](https://github.com/JoshuaKGoldberg), the contributor who implemented this feature.
For more information, you can take a look at [the `ts-expect-error` pull request](https://github.com/microsoft/TypeScript/pull/36014).

### `ts-ignore` or `ts-expect-error`?

In some ways `// @ts-expect-error` can act as a suppression comment, similar to `// @ts-ignore`.
The difference is that `// @ts-ignore` will do nothing if the following line is error-free.

You might be tempted to switch existing `// @ts-ignore` comments over to `// @ts-expect-error`, and you might be wondering which is appropriate for future code.
While it's entirely up to you and your team, we have some ideas of which to pick in certain situations.

Pick `ts-expect-error` if:

* you're writing test code where you actually want the type system to error on an operation
* you expect a fix to be coming in fairly quickly and you just need a quick workaround
* you're in a reasonably-sized project with a proactive team that wants to remove suppression comments as soon affected code is valid again

Pick `ts-ignore` if:

* you have an a larger project and and new errors have appeared in code with no clear owner
* you are in the middle of an upgrade between two different versions of TypeScript, and a line of code errors in one version but not another.
* you honestly don't have the time to decide which of these options is better.

## Uncalled Function Checks in Conditional Expressions

In TypeScript 3.7 we introduced *uncalled function checks* to report an error when you've forgotten to call a function.

```ts
function hasImportantPermissions(): boolean {
    // ...
}

// Oops!
if (hasImportantPermissions) {
//  ~~~~~~~~~~~~~~~~~~~~~~~
// This condition will always return true since the function is always defined.
// Did you mean to call it instead?
    deleteAllTheImportantFiles();
}
```

However, this error only applied to conditions in `if` statements.
Thanks to [a pull request](https://github.com/microsoft/TypeScript/pull/36402) from [Alexander Tarasyuk](https://github.com/a-tarasyuk), this feature is also now supported in ternary conditionals (i.e. the `cond ? trueExpr : falseExpr` syntax).

```ts
declare function listFilesOfDirectory(dirPath: string): string[];
declare function isDirectory(): boolean;

function getAllFiles(startFileName: string) {
    const result: string[] = [];
    traverse(startFileName);
    return result;

    function traverse(currentPath: string) {
        return isDirectory ?
        //     ~~~~~~~~~~~
        // This condition will always return true
        // since the function is always defined.
        // Did you mean to call it instead?
            listFilesOfDirectory(currentPath).forEach(traverse) :
            result.push(currentPath);
    }
}
```

https://github.com/microsoft/TypeScript/issues/36048

## <span id="editor-improvements" /> 에디터 개선 (Editor Improvements)

TypeScript 컴파일러는 주요 에디터의 TypeScript 작성 경험뿐만 아니라, Visual Studio 계열 에디터의 JavaScript 작성 경험에도 영향을 줍니다.
에디터에서 새로운 TypeScript/JavaScript 기능을 사용하는 것은 에디터에 따라 다르겠지만

* Visual Studio Code는 [다른 버전의 TypeScript 선택](https://code.visualstudio.com/docs/typescript/typescript-compiling#_using-the-workspace-version-of-typescript)을 지원합니다. 또는, 최신으로 유지하기 위한 [JavaScript/TypeScript Nightly Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)도 있습니다.(대체로 안정적입니다.)
* Visual Studio 2017/2019 에는 [SDK 설치 프로그램] 과 [MSBuild 설치](https://www.nuget.org/packages/Microsoft.TypeScript.MSBuild)가 있습니다.
* Sublime Text 3은 [다른 버전의 TypeScript 선택]((https://github.com/microsoft/TypeScript-Sublime-Plugin#note-using-different-versions-of-typescript))을 지원합니다.

### <span id="commonjs-auto-imports-in-javascript" /> JavaScript에서 CommonJS 자동-import (CommonJS Auto-Imports in JavaScript)

CommonJS 모듈을 사용하는 JavaScript 파일에서 자동-import 기능이 크게 개선되었습니다.

이전 버전에서는, TypeScript는 항상 파일에 관계없이 ECMAScript-스타일의 import를 원한다고 가정했습니다.

```js
import * as fs from "fs";
```

하지만, 모든 사람이 JavaScript 파일을 쓸 때 ECMAScript-스타일의 모듈을 원하는 것은 아닙니다.
많은 사용자가 여전히 CommonJS-스타일의 `require(...)` import를 사용하고 있습니다.

```js
const fs = require("fs");
```

이제 TypeScript는 파일 스타일을 깔끔하고 일관되게 유지하기 위해서 사용 중인 import 유형을 자동으로 검색합니다.

<video src="https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2020/03/ERkaliGU0AA5anJ1.mp4"></video>

이 변경에 대한 자세한 내용은, [해당 pull request](https://github.com/microsoft/TypeScript/pull/37027)를 참고하세요.

### <span id="code-actions-preserve-newlines" /> 코드 작업 개행 유지 (Code Actions Preserve Newlines)

TypeScript의 리팩터링과 빠른 수정은 종종 개행을 유지하는데 큰 역할을 하지는 않았습니다.
기본적인 예로 다음 코드를 보겠습니다.

```ts
const maxValue = 100;

/*시작*/
for (let i = 0; i <= maxValue; i++) {
    // 먼저 제곱 값을 구한다.
    let square = i ** 2;

    // 제곱 값을 출력한다.
    console.log(square);
}
/*끝*/
```

에디터에서 `/*시작*/` 에서 `/*끝*/` 까지 범위를 강조하여 새로운 함수로 추출하면, 다음과 같은 코드가 됩니다.

```ts
const maxValue = 100;

printSquares();

function printSquares() {
    for (let i = 0; i <= maxValue; i++) {
        // 먼저 제곱 값을 구한다.
        let square = i ** 2;
        // 제곱값을 출력한다.
        console.log(square);
    }
}
```

![이전 버전의 TypeScript에선 함수로 루프 추출은. 개행을 유지하지 않습니다.](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2020/03/printSquaresWithoutNewlines-3.9.gif.gif)

이건 이상적이지 않습니다 - `for` 루프에서 각각의 문 사이에 빈 줄이 있었지만 리팩터링이 없애버렸습니다!
TypeScript 3.9은 우리가 작성한 것을 보존하기 위해 조금 더 작업을 합니다.

```ts
const maxValue = 100;

printSquares();

function printSquares() {
    for (let i = 0; i <= maxValue; i++) {
        // 먼저 제곱 값을 구한다.
        let square = i ** 2;

        // 제곱값을 출력한다.
        console.log(square);
    }
}
```

![TypeScript 3.9의 함수에 대한 루프 추출. 개행이 보존됨](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2020/03/printSquaresWithNewlines-3.9.gif.gif)

[이 pull request](https://github.com/microsoft/TypeScript/pull/36688)에서 구현에 대해 더 자세히 볼 수 있습니다.

### <span id="quick-fixes-for-missing-return-expressions" /> 누락된 반환 문 빠른 수정 (Quick Fixes for Missing Return Expressions)

특히 화살표 함수에 중괄호를 추가할 때, 함수의 마지막 문의 값을 반환하는 것을 잊는 경우가 있습니다.

```ts
// 이전
let f1 = () => 42

// 실수 - 동일하지 않음!
let f2 = () => { 42 }
```

커뮤니티 멤버인 [Wenlu Wang](https://github.com/Kingwl)의 [pull request](https://github.com/microsoft/TypeScript/pull/26434) 덕분에, TypeScript는 누락된 `return` 문을 추가하거나, 중괄호를 제거하거나, 객체 리터럴 처럼 보이는 화살표 함수 몸체에 괄호를 추가하는 빠른-수정을 제공할 수 있습니다.

![TypeScript는 `return` 문을 추가하거나 중괄호를 제거하여 식이 반환되지 않는 오류를 수정합니다.](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2020/04/missingReturnValue-3-9.gif)

### <span id="support-for-solution-style-tsconfigjson-files" /> `tsconfig.json` 파일 "솔루션 스타일" 지원 (Support for "Solution Style" `tsconfig.json` Files)

에디터는 파일이 어떤 설정 파일에 속하는지 파악하여 적절한 옵션을 적용할 수 있도록 하고 현재 "프로젝트"에 어떤 다른 파일이 포함되어 있는지 파악해야 합니다.
기본적으로, TypeScript의 언어 서버가 영향을 주는 에디터는 각 상위 디렉터리를 따라 올라가 `tsconfig.json`을 찾음으로써 이 작업을 수행합니다.

이 문제가 다소 실패하는 경우 중 하나는 tsconfig.json이 단순히 다른 tsconfig.json 파일을 참조하기 위해 존재할 때였습니다.

```json5
// tsconfig.json
{
    "files": [],
    "references": [
        { "path": "./tsconfig.shared.json" },
        { "path": "./tsconfig.frontend.json" },
        { "path": "./tsconfig.backend.json" },
    ]
}
```

다른 프로젝트 파일을 관리만 하는 이 파일은 어떤 환경에서는 종종 "솔루션"이라고 불립니다.
여기서 `tsconfig.*.json` 파일 중 어떤 파일도 서버에 의해 검색되지 않지만, 현재 `.ts` 파일이 루트의 `tsconfig.json`에 언급된 프로젝트 중 하나에 속한다는 것을 언어 서버가 이해하기를 원합니다.

TypeScript 3.9 는 이 설정에 대한 시나리오 수정을 지원합니다.
더 자세한 사항은, [이 기능을 추가한 pull request](https://github.com/microsoft/TypeScript/pull/37239)를 확인하세요.

## Breaking Changes

### Parsing Differences in Optional Chaining and Non-Null Assertions

TypeScript recently implemented the optional chaining operator, but we've received user feedback that the behavior of optional chaining (`?.`) with the non-null assertion operator (`!`) is extremely counter-intuitive.

Specifically, in previous versions, the code

```ts
foo?.bar!.baz
```

was interpreted to be equivalent to the following JavaScript.

```js
(foo?.bar).baz
```

In the above code the parentheses stop the "short-circuiting" behavior of optional chaining, so if `foo` is `undefined`, accessing `baz` will cause a runtime error.

The Babel team who pointed this behavior out, and most users who provided feedback to us, believe that this behavior is wrong.
We do too!
The thing we heard the most was that the `!` operator should just "disappear" since the intent was to remove `null` and `undefined` from the type of `bar`.

In other words, most people felt that the original snippet should be interpreted as

```js
foo?.bar.baz
```

which just evaluates to `undefined` when `foo` is `undefined`.

This is a breaking change, but we believe most code was written with the new interpretation in mind.
Users who want to revert to the old behavior can add explicit parentheses around the left side of the `!` operator.

```ts
(foo?.bar)!.baz
```

### `}` and `>` are Now Invalid JSX Text Characters

The JSX Specification forbids the use of the `}` and `>` characters in text positions.
TypeScript and Babel have both decided to enforce this rule to be more comformant.
The new way to insert these characters is to use an HTML escape code (e.g. `<span> 2 &gt 1 </div>`) or insert an expression with a string literal (e.g. `<span> 2 {">"} 1 </div>`).

Luckily, thanks to the [pull request](https://github.com/microsoft/TypeScript/pull/36636) enforcing this from [Brad Zacher](https://github.com/bradzacher), you'll get an error message along the lines of

```
Unexpected token. Did you mean `{'>'}` or `&gt;`?
Unexpected token. Did you mean `{'}'}` or `&rbrace;`?
```

For example:

```tsx
let directions = <span>Navigate to: Menu Bar > Tools > Options</div>
//                                           ~       ~
// Unexpected token. Did you mean `{'>'}` or `&gt;`?
```

That error message came with a handy quick fix, and thanks to [Alexander Tarasyuk](https://github.com/a-tarasyuk), [you can apply these changes in bulk](https://github.com/microsoft/TypeScript/pull/37436) if you have a lot of errors.

### Stricter Checks on Intersections and Optional Properties

Generally, an intersection type like `A & B` is assignable to `C` if either `A` or `B` is assignable to `C`; however, sometimes that has problems with optional properties.
For example, take the following:

```ts
interface A {
    a: number; // notice this is 'number'
}

interface B {
    b: string;
}

interface C {
    a?: boolean; // notice this is 'boolean'
    b: string;
}

declare let x: A & B;
declare let y: C;

y = x;
```

In previous versions of TypeScript, this was allowed because while `A` was totally incompatible with `C`, `B` *was* compatible with `C`.

In TypeScript 3.9, so long as every type in an intersection is a concrete object type, the type system will consider all of the properties at once.
As a result, TypeScript will see that the `a` property of `A & B` is incompatible with that of `C`:

```
Type 'A & B' is not assignable to type 'C'.
  Types of property 'a' are incompatible.
    Type 'number' is not assignable to type 'boolean | undefined'.
```

For more information on this change, [see the corresponding pull request](https://github.com/microsoft/TypeScript/pull/37195).

### Intersections Reduced By Discriminant Properties

There are a few cases where you might end up with types that describe values that just don't exist.
For example

```ts
declare function smushObjects<T, U>(x: T, y: U): T & U;

interface Circle {
    kind: "circle";
    radius: number;
}

interface Square {
    kind: "square";
    sideLength: number;
}

declare let x: Circle;
declare let y: Square;

let z = smushObjects(x, y);
console.log(z.kind);
```

This code is slightly weird because there's really no way to create an intersection of a `Circle` and a `Square` - they have two incompatible `kind` fields.
In previous versions of TypeScript, this code was allowed and the type of `kind` itself was `never` because `"circle" & "square"` described a set of values that could `never` exist.

In TypeScript 3.9, the type system is more aggressive here - it notices that it's impossible to intersect `Circle` and `Square` because of their `kind` properties.
So instead of collapsing the type of `z.kind` to `never`, it collapses the type of `z` itself (`Circle & Square`) to `never`.
That means the above code now errors with:

```
Property 'kind' does not exist on type 'never'.
```

Most of the breaks we observed seem to correspond with slightly incorrect type declarations.
For more details, [see the original pull request](https://github.com/microsoft/TypeScript/pull/36696).

### Getters/Setters are No Longer Enumerable

In older versions of TypeScript, `get` and `set` accessors in classes were emitted in a way that made them enumerable; however, this wasn't compliant with the ECMAScript specification which states that they must be non-enumerable.
As a result, TypeScript code that targeted ES5 and ES2015 could differ in behavior.

Thanks to [a pull request](https://github.com/microsoft/TypeScript/pull/32264) from GitHub user [pathurs](https://github.com/pathurs), TypeScript 3.9 now conforms more closely with ECMAScript in this regard.

### Type Parameters That Extend `any` No Longer Act as `any`

In previous versions of TypeScript, a type parameter constrained to `any` could be treated as `any`.

```ts
function foo<T extends any>(arg: T) {
    arg.spfjgerijghoied; // no error!
}
```

This was an oversight, so TypeScript 3.9 takes a more conservative approach and issues an error on these questionable operations.

```ts
function foo<T extends any>(arg: T) {
    arg.spfjgerijghoied;
    //  ~~~~~~~~~~~~~~~
    // Property 'spfjgerijghoied' does not exist on type 'T'.
}
```

### `export *` is Always Retained

In previous TypeScript versions, declarations like `export * from "foo"` would be dropped in our JavaScript output if `foo` didn't export any values.
This sort of emit is problematic because it's type-directed and can't be emulated by Babel.
TypeScript 3.9 will always emit these `export *` declarations.
In practice, we don't expect this to break much existing code.
