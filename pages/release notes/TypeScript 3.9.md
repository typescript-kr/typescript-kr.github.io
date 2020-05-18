* [Improvements in Inference and `Promise.all`](#improvements-in-inference-and-promiseall)
* [Speed Improvements](#speed-improvements)
* [`// @ts-expect-error` Comments](#-ts-expect-error-comments)
* [Uncalled Function Checks in Conditional Expressions](#uncalled-function-checks-in-conditional-expressions)
* [Editor Improvements](#editor-improvements)
    * [CommonJS Auto-Imports in JavaScript](#commonjs-auto-imports-in-javascript)
    * [Code Actions Preserve Newlines](#code-actions-preserve-newlines)
    * [Quick Fixes for Missing Return Expressions](#quick-fixes-for-missing-return-expressions)
    * [Support for "Solution Style" `tsconfig.json` Files](#support-for-solution-style-tsconfigjson-files)
* [주요 변경 사항](#주요-변경-사항-breaking-changes)

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

## Editor Improvements

The TypeScript compiler not only powers the TypeScript editing experience in most major editors, it also powers the JavaScript experience in the Visual Studio family of editors and more.
Using new TypeScript/JavaScript functionality in your editor will differ depending on your editor, but

* Visual Studio Code supports [selecting different versions of TypeScript](https://code.visualstudio.com/docs/typescript/typescript-compiling#_using-the-workspace-version-of-typescript). Alternatively, there's the [JavaScript/TypeScript Nightly Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next) to stay on the bleeding edge (which is typically very stable).
* Visual Studio 2017/2019 have [the SDK installers above] and [MSBuild installs](https://www.nuget.org/packages/Microsoft.TypeScript.MSBuild).
* Sublime Text 3 supports [selecting different versions of TypeScript](https://github.com/microsoft/TypeScript-Sublime-Plugin#note-using-different-versions-of-typescript)

### CommonJS Auto-Imports in JavaScript

One great new improvement is in auto-imports in JavaScript files using CommonJS modules.

In older versions, TypeScript always assumed that regardless of your file, you wanted an ECMAScript-style import like

```js
import * as fs from "fs";
```

However, not everyone is targeting ECMAScript-style modules when writing JavaScript files.
Plenty of users still use CommonJS-style `require(...)` imports like so

```js
const fs = require("fs");
```

TypeScript now automatically detects the types of imports you're using to keep your file's style clean and consistent.

<video src="https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2020/03/ERkaliGU0AA5anJ1.mp4"></video>

For more details on the change, see [the corresponding pull request](https://github.com/microsoft/TypeScript/pull/37027).

### Code Actions Preserve Newlines

TypeScript's refactorings and quick fixes often didn't do a great job of preserving newlines.
As a really basic example, take the following code.

```ts
const maxValue = 100;

/*start*/
for (let i = 0; i <= maxValue; i++) {
    // First get the squared value.
    let square = i ** 2;

    // Now print the squared value.
    console.log(square);
}
/*end*/
```

If we highlighted the range from `/*start*/` to `/*end*/` in our editor to extract to a new function, we'd end up with code like the following.

```ts
const maxValue = 100;

printSquares();

function printSquares() {
    for (let i = 0; i <= maxValue; i++) {
        // First get the squared value.
        let square = i ** 2;
        // Now print the squared value.
        console.log(square);
    }
}
```

![Extracting the for loop to a function in older versions of TypeScript. A newline is not preserved.](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2020/03/printSquaresWithoutNewlines-3.9.gif.gif)

That's not ideal - we had a blank line between each statement in our `for` loop, but the refactoring got rid of it!
TypeScript 3.9 does a little more work to preserve what we write.

```ts
const maxValue = 100;

printSquares();

function printSquares() {
    for (let i = 0; i <= maxValue; i++) {
        // First get the squared value.
        let square = i ** 2;

        // Now print the squared value.
        console.log(square);
    }
}
```

![Extracting the for loop to a function in TypeScript 3.9. A newline is preserved.](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2020/03/printSquaresWithNewlines-3.9.gif.gif)

You can see more about the implementation [in this pull request](https://github.com/microsoft/TypeScript/pull/36688)

### Quick Fixes for Missing Return Expressions

There are occasions where we might forget to return the value of the last statement in a function, especially when adding curly braces to arrow functions.

```ts
// before
let f1 = () => 42

// oops - not the same!
let f2 = () => { 42 }
```

Thanks to [a pull request](https://github.com/microsoft/TypeScript/pull/26434) from community member [Wenlu Wang](https://github.com/Kingwl), TypeScript can provide a quick-fix to add missing `return` statements, remove curly braces, or add parentheses to arrow function bodies that look suspiciously like object literals.

![TypeScript fixing an error where no expression is returned by adding a `return` statement or removing curly braces.](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2020/04/missingReturnValue-3-9.gif)

### Support for "Solution Style" `tsconfig.json` Files

Editors need to figure out which configuration file a file belongs to so that it can apply the appropriate options and figure out which other files are included in the current "project".
By default, editors powered by TypeScript's language server do this by walking up each parent directory to find a `tsconfig.json`.

One case where this slightly fell over is when a `tsconfig.json` simply existed to reference other `tsconfig.json` files.

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

This file that really does nothing but manage other project files is often called a "solution" in some environments.
Here, none of these `tsconfig.*.json` files get picked up by the server, but we'd really like the language server to understand that the current `.ts` file probably belongs to one of the mentioned projects in this root `tsconfig.json`.

TypeScript 3.9 adds support to editing scenarios for this configuration.
For more details, take a look at [the pull request that added this functionality](https://github.com/microsoft/TypeScript/pull/37239).

## 주요 변경 사항 (Breaking Changes)

### 선택적 체이닝과 널이 아닌 단언에서 파싱 차이점 (Parsing Differences in Optional Chaining and Non-Null Assertions)

최근에 TypeScript는 선택적 체이닝 연산자를 도입했지만, 널이 아닌 단언 연산자 (`!`)와 함께 사용하는 선택적 체이닝 (`?.`)의 동작이 매우 직관적이지 않다는 사용자 피드백을 받았습니다.

구체적으로, 이전 버전에서는 코드가

```ts
foo?.bar!.baz
```

다음 JavaScript와 동등하게 해석되었습니다.

```js
(foo?.bar).baz
```

위에 코드에서 괄호는 선택적 체이닝의 "단락" 동작을 중단합니다 그래서 만약 `foo`가 `undefined`이면, `baz`에 접근하는 것은 런타임 오류를 발생시킵니다.

이 동작을 지적한 바벨팀과 피드백을 준 대부분의 사용자들은 이 동작이 잘못되었다고 생각합니다.
저희도 그렇게 생각합니다!
`bar`의 타입에서 `null`과 `undefined`를 제거하는 것이 의도이기 때문에 가장 많이 들은 말은  `!` 연산자는 그냥 "사라져야 한다"입니다.

즉, 대부분의 사람들은 원본 문장이 다음과 같이

```js
foo?.bar.baz
```

`foo`가 `undefined`일 때, 그냥 `undefined`로 평가하는 것으로 해석되어야 한다고 생각합니다

이것이 주요 변경 사항이지만, 대부분의 코드가 새로운 해석을 염두에 두고 작성되었다고 생각합니다.
이전 동작으로 되돌리고 싶은 사용자는 `!` 연산자 왼쪽에 명시적인 괄호를 추가할 수 있습니다.

```ts
(foo?.bar)!.baz
```

### `}` 와 `>` 는 이제 유효하지 않은 JSX 텍스트 문자입니다 (`}` and `>` are Now Invalid JSX Text Characters)

JSX 명세서에는 텍스트 위치에 `}`와 `>` 문자의 사용을 금지합니다.
TypeScript와 바벨은 이 규칙을 더 적합하게 적용하기로 결정했습니다.
이 문자를 넣기 위한 새로운 방법은 HTML 이스케이프 코드를 사용하거나 (예를 들어, `<span> 2 &gt 1 </div>`) 문자열 리터럴로 표현식을 넣는 것입니다 (예를 들어, `<span> 2 {">"} 1 </div`).

다행히, [Brad Zacher](https://github.com/bradzacher)의 [pull request](https://github.com/microsoft/TypeScript/pull/36636) 덕분에, 다음 문장과 함께 오류 메시지를 받을 수 있습니다

```
Unexpected token. Did you mean `{'>'}` or `&gt;`?
Unexpected token. Did you mean `{'}'}` or `&rbrace;`?
```

예를 들어:

```tsx
let directions = <span>Navigate to: Menu Bar > Tools > Options</div>
//                                           ~       ~
// Unexpected token. Did you mean `{'>'}` or `&gt;`?
```

이 오류 메시지는 편리하고 빠른 수정과 함께 제공되고 [Alexander Tarasyuk](https://github.com/a-tarasyuk) 덕분에, 많은 오류가 있으면 [이 변경사항을 일괄 적용 할 수 있습니다](https://github.com/microsoft/TypeScript/pull/37436).

### 교집합과 선택적 프로퍼티에 대한 더 엄격해진 검사 (Stricter Checks on Intersections and Optional Properties)

일반적으로, `A & B`와 같은 교차 타입은 `A` 또는 `B`가 `C`에 할당할 수 있으면, `A & B`는 `C`에 할당할 수 있습니다; 하지만, 가끔 선택적 프로퍼티에서 문제가 생깁니다.
예를 들어, 다음을 봅시다:

```ts
interface A {
    a: number; // 'number' 인것에 주목
}

interface B {
    b: string;
}

interface C {
    a?: boolean; // 'boolean' 인것에 주목
    b: string;
}

declare let x: A & B;
declare let y: C;

y = x;
```

이전 버전의 TypeScript에서는, `A`가 `C`와 완전히 호환되지 않지만, `B`가 `C`와 호환 *되었기* 때문에 허용되었습니다.

TypeScript 3.9에서는, 교집합 안의 모든 타입이 구제적인 객체 타입이면, 타입 시스템은 모든 프로퍼티를 한 번에 고려합니다.
결과적으로, TypeScript는 `A & B`의 `a` 프로퍼티는 `C`의 `a` 프로퍼티와 호환되지 않는다고 봅니다:

```
'A & B' 타입은 'C' 타입에 할당할 수 없습니다.
  'a' 프로퍼티의 타입은 호환되지 않습니다.
    'number' 타입은 'boolean | undefined' 타입에 할당할 수 없습니다.
```

이 변경사항에 대한 자세한 정보는, [해당 pull request](https://github.com/microsoft/TypeScript/pull/37195)를 참조하세요.

### 판별 프로퍼티로 줄어든 교집합 (Intersections Reduced By Discriminant Properties)

존재하지 않는 값을 기술하는 타입으로 끝날 수 있는 몇 가지 경우가 있습니다.
예를 들어

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

이 코드는 `Circle`과 `Square`의 교집합을 생성할 방법이 전혀 없기 때문에 약간 이상합니다 - 호환되지 않는 두 `kind` 필드가 있습니다.
이전 버전의 TypeScript에서는, 이 코드는 허용되었고 `"circle" & "square"`가 `절대(never)` 존재할 수 없는 값의 집합을 기술했기 때문에 `kind` 자체의 타입은 `never`였습니다.

TypeScript 3.9에서는, 타입 시스템이 더 공격적입니다 - `kind` 프로퍼티 때문에 `Circle`과 `Square`를 교차하는 것이 불가능하다는 것을 알고 있습니다.
그래서 `z.kind`를 `never`로 축소하는 대신, `z` 자체(`Circle & Square`) 타입을 `never`로 축소합니다.
즉 위의 코드는 다음과 같은 오류를 발생합니다:

```
'kind' 프로퍼티는 'never' 타입에 존재하지 않습니다.
```

관찰한 대부분의 오류는 잘못된 타입 선언과 일치하는 것으로 보입니다.
자세한 내용은 [원문 pull request](https://github.com/microsoft/TypeScript/pull/36696)를 보세요.

### Getters/Setter는 더 이상 열거하지 않습니다 (Getters/Setters are No Longer Enumerable)

이전 버전의 TypeScript에서, 클래스의 `get`과 `set` 접근자는 열거 가능한 방법으로 방출되었습니다; 하지만, `get`과 `set`은 열거할 수 없다는 ECMAScript 사양을 따르지 않았습니다.
결과적으로, ES5와 ES2015를 타겟팅 하는 TypeScript 코드는 동작이 다를 수 있습니다.

깃허브 사용자 [pathurs](https://github.com/pathurs)의 [pull request](https://github.com/microsoft/TypeScript/pull/32264) 덕분에, TypeScript 3.9는 이와 관련하여 ECMAScript와 더 밀접하게 호환됩니다.

### `any`로 확장된 타입 매개변수는 더 이상 `any` 처럼 행동하지 않음 (Type Parameters That Extend `any` No Longer Act as `any`)

이전 버전의 TypeScript에서 `any`로 제한된 타입 매개변수는 `any`로 다룰 수 있었습니다.

```ts
function foo<T extends any>(arg: T) {
    arg.spfjgerijghoied; // 오류가 아님!
}
```

이는 실수였습니다, 그래서 TypeScript 3.9에서는 더 보수적인 접근을 취하고 이런 의심스러운 작업에 대해 오류를 발생시킵니다.

```ts
function foo<T extends any>(arg: T) {
    arg.spfjgerijghoied;
    //  ~~~~~~~~~~~~~~~
    // 'spfjgerijghoied' 프로퍼티는 'T' 타입에 존재하지 않습니다.
}
```

### `export *`은 항상 유지됩니다 (`export *` is Always Retained)

이전 TypeScript 버전에서 `export * from "foo"` 같은 선언은 `foo`가 어떠한 값도 export 하지 않으면 JavaScript 출력에서 제외되었습니다.
이런 내보내기는 타입-지향적이고 바벨에서 에뮬레이트 될 수 없기 때문에 문제가 됩니다.
TypeScrip 3.9는 이런 `export *` 선언을 항상 내보냅니다.
실제로 이 변화가 기존 코드를 깨뜨릴 것이라고 생각하지 않습니다.