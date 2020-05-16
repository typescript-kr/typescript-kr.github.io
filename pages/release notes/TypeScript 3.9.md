* [Improvements in Inference and `Promise.all`](#improvements-in-inference-and-promiseall)
* [Speed Improvements](#speed-improvements)
* [`// @ts-expect-error` 주석](#-ts-expect-error-comments)
* [조건문에서 호출되지 않은 함수 체크](#uncalled-function-checks-in-conditional-expressions)
* [Editor Improvements](#editor-improvements)
    * [CommonJS Auto-Imports in JavaScript](#commonjs-auto-imports-in-javascript)
    * [Code Actions Preserve Newlines](#code-actions-preserve-newlines)
    * [Quick Fixes for Missing Return Expressions](#quick-fixes-for-missing-return-expressions)
    * [Support for "Solution Style" `tsconfig.json` Files](#support-for-solution-style-tsconfigjson-files)
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

## <span id="-ts-expect-error-comments" /> `// @ts-expect-error` 주석 (`// @ts-expect-error` Comments)

TypeScript에 라이브러리를 작성하고 퍼블릭 API의 일부분으로 `doStuff`라는 함수를 export 한다고 상상해보세요.
TypeScript 사용자가 타입-체크 오류를 받을 수 있도록 `doStuff` 함수의 타입은 두 개의 `string`을 갖는다고 선언하지만, 또한 JavaScript 사용자에게 유용한 오류를 제공하기 위해 런타임 오류 체크를 합니다 (개발 빌드 시에만 가능).

```ts
function doStuff(abc: string, xyz: string) {
    assert(typeof abc === "string");
    assert(typeof xyz === "string");

    // 어떤 작업을 하세요
}
```

그래서 TypeScript 사용자는 함수를 잘못 사용할 경우 유용한 빨간 오류 밑줄과 오류 메시지를 받게 되며, JavaScript 사용자는 단언 오류를 얻게 됩니다.
이러한 작동을 테스트하기 위해서, 유닛 테스트를 작성하겠습니다.

```ts
expect(() => {
    doStuff(123, 456);
}).toThrow();
```

불행히도 위의 테스트가 TypeScript에서 작성된다면, TypeScript는 오류를 발생시킬 것입니다!

```ts
    doStuff(123, 456);
//          ~~~
// 오류: 'number' 타입은 'string' 타입에 할당할 수 없습니다.
```

그래서 TypeScript 3.9는 새로운 기능을 도입했습니다: `// @ts-expect-error` 주석.
라인 앞에 '// @ts-expect-error' 주석이 붙어 있을 경우, TypeScript는 해당 오류를 보고하는 것을 멈춥니다;
그러나 오류가 존재하지 않으면, TypeScript는 `// @ts-expect-error`가 필요하지 않다고 보고할 것입니다.

간단한 예로, 다음 코드는 괜찮습니다

```ts
// @ts-expect-error
console.log(47 * "octopus");
```

그러나 다음 코드는

```ts
// @ts-expect-error
console.log(1 + 1);
```

오류로 이어질 것입니다

```
Unused '@ts-expect-error' directive.
```

이 기능을 구현한 컨트리뷰터, [Josh Goldberg](https://github.com/JoshuaKGoldberg)에게 큰 감사를 드립니다.
자세한 내용은 [the `ts-expect-error` pull request](https://github.com/microsoft/TypeScript/pull/36014)를 참고하세요.

### `ts-ignore` 또는 `ts-expect-error`? (`ts-ignore` or `ts-expect-error`?)

어떤 점에서는 `// @ts-expect-error`가 `// @ts-ignore`과 유사하게 억제 주석(suppression comment)으로 작용할 수 있습니다.
차이점은 `// @ts-ignore`는 다음 행에 오류가 없을 경우 아무것도 하지 않는다는 것입니다.

기존 `// @ts-ignore` 주석을 `// @ts-expect-error`로 바꾸고 싶은 마음이 들 수 있으며, 향후 코드에 무엇이 적합한지 궁금할 수 있습니다.
전적으로 당신과 당신 팀의 선택이지만, 우리는 어떤 상황에서 어떤 것을 선택할 것인지에 대한 몇 가지 아이디어를 가지고 있습니다.

`ts-expect-error`를 선택하세요 만약:

* 타입 시스템이 작동에 대한 오류를 발생시키는 테스트 코드 작성을 원하는 경우
* 수정이 빨리 이루어지길 원하며 빠른 해결책이 필요한 경우
* 오류가 발생한 코드가 다시 유효해지면 바로 억제 주석을 삭제하길 원하는 혁신적인 팀이 이끄는 적당한-크기의 프로젝트에서 작업하는 경우

`ts-ignore`를 선택하세요 만약:

* 더 큰 프로젝트를 갖고 있고 코드에서 발생한 새로운 오류의 명확한 책임자를 찾기 힘든 경우
* TypeScript의 두 가지 버전 사이에서 업그레이드하는 중이고, 한 버전에서는 코드 오류가 발생하지만 나머지 버전에서는 그렇지 않은 경우
* 솔직히 어떤 옵션 더 나은지 결정할 시간이 없는 경우

## <span id="uncalled-function-checks-in-conditional-expressions" /> 조건문에서 호출되지 않은 함수 체크 (Uncalled Function Checks in Conditional Expressions)

TypeScript 3.7에서 함수 호출을 잊어버렸을 경우 오류를 보고하기 위해 *호출되지 않은 함수 체크*를 도입했습니다.

```ts
function hasImportantPermissions(): boolean {
    // ...
}

// 이런!
if (hasImportantPermissions) {
//  ~~~~~~~~~~~~~~~~~~~~~~~
// hasImportantPermissions 함수가 항상 정의되어 있기 때문에, 이 조건문은 항상 true를 반환합니다.
// 대신 이것을 호출하려 하셨나요?
    deleteAllTheImportantFiles();
}
```

그러나, 이 오류는 `if` 문의 조건에만 적용됩니다.
[Alexander Tarasyuk](https://github.com/a-tarasyuk)의 [a pull request](https://github.com/microsoft/TypeScript/pull/36402) 덕분에, 이 기능은 삼항 조건 연산자도 지원하게 되었습니다 (예. `cond ? trueExpr : falseExpr` 구문).

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
        // isDirectory 함수가 항상 정의되어 있기 때문에,
        // 이 조건은 항상 true를 반환합니다
        // 대신 이것을 호출하려 하셨나요?
            listFilesOfDirectory(currentPath).forEach(traverse) :
            result.push(currentPath);
    }
}
```

https://github.com/microso0ft/TypeScript/issues/36048

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