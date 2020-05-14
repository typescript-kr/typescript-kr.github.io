* [추론과 `Promise.all` 개선](#improvements-in-inference-and-promiseall)
* [속도 향상](#speed-improvements)
* [`// @ts-expect-error` Comments](#-ts-expect-error-comments)
* [Uncalled Function Checks in Conditional Expressions](#uncalled-function-checks-in-conditional-expressions)
* [Editor Improvements](#editor-improvements)
    * [CommonJS Auto-Imports in JavaScript](#commonjs-auto-imports-in-javascript)
    * [Code Actions Preserve Newlines](#code-actions-preserve-newlines)
    * [Quick Fixes for Missing Return Expressions](#quick-fixes-for-missing-return-expressions)
    * [Support for "Solution Style" `tsconfig.json` Files](#support-for-solution-style-tsconfigjson-files)
* [Breaking Changes](#breaking-changes)

## <span id="improvements-in-inference-and-promiseall" /> 추론과 `Promise.all` 개선 (`Improvements in Inference and `Promise.all`)

최신 버전의 TypeScript(약 3.7)는 `Promise.all` 및 `Promise.race`와 같은 함수 선언이 업데이트되었습니다.
운이 안 좋게도, 특히 `null` 또는 `undefined`와 값을 혼합할 때, 약간의 회귀가 발생했습니다.

```ts
interface Lion {
    roar(): void
}

interface Seal {
    singKissFromARose(): void
}

async function visitZoo(lionExhibit: Promise<Lion>, sealExhibit: Promise<Seal | undefined>) {
    let [lion, seal] = await Promise.all([lionExhibit, sealExhibit]);
    lion.roar(); // 오 이런
//  ~~~~
// 객체는 아마도 'undefined' 일 것입니다.
}
```

이건 이상한 행동입니다!
`sealExhibit`가 `undefined`를 포함하는 것은 어떻게든 `lion` 타입에 `undefined`를 주입합니다.

[Jack Bates](https://github.com/jablko)의 [풀 리퀘스트](https://github.com/microsoft/TypeScript/pull/34501) 덕분에, TypeScript 3.9의 추론 프로세스가 개선되었습니다.
위 오류는 더 이상 없습니다.
`Promise`들과 관련된 문제로 인해 이전 버전의 TypeScript에서 고생을 했다면, 3.9를 사용하는 것이 좋습니다.

### `awaited` 타입은 무엇입니까? (What About the `awaited` Type?)

이슈 트래커와 설계 회의 노트를 보면, [`awaited`이라는 새로운 연산자](https://github.com/microsoft/TypeScript/pull/35998)에 대한 일부 작업을 알 수도 있습니다.
이 타입 연산자의 목표는 JavaScript에서 `Promise`를 푸는 방식을 정확하게 모델링 하는 것입니다.

처음에는 TypeScript 3.9에서 `awaited`을 제공할 것으로 예상했지만, 기존 코드 베이스와 함께 초기 TypeScript 빌드를 실행함으로써 모든 사용자에게 원활하게 배포하기 전에 이 기능에 더 많은 설계 작업이 필요하다는 사실을 알았습니다.
결과적으로 더 많은 확신이 생기면 주요 브랜치에 기능을 추가하기로 결정했습니다.
이 기능에 대해 더 많은 실험을 할 예정이지만, 이번 릴리스에서는 제공하진 않습니다.

## <span id="speed-improvements" /> 속도 향상 (Speed Improvements)

TypeScript 3.9는 많은 새로운 속도 향상 기능이 포함되어 있습니다.
우리 팀은 material-ui 및 스타일 구성 요소와 같은 패키지를 사용하여 편집 / 컴파일 속도가 매우 열악한 것을 확인한 후 성능에 중점을 두었습니다.
거대한 유니언, 인터섹션, 조건별 타입 그리고 매핑된 타입과 관련된 특정 병리학적 사례를 최적화하는 다양한 풀 레퀘스트로 심층 분석했습니다.

* https://github.com/microsoft/TypeScript/pull/36576
* https://github.com/microsoft/TypeScript/pull/36590
* https://github.com/microsoft/TypeScript/pull/36607
* https://github.com/microsoft/TypeScript/pull/36622
* https://github.com/microsoft/TypeScript/pull/36754
* https://github.com/microsoft/TypeScript/pull/36696

이러한 각 풀 리퀘스트는 특정 코드 베이스에서 컴파일 시간이 약 5-10% 단축됩니다.
전체적으로 material-ui의 컴파일 시간이 약 40% 단축되었습니다!

또한 에디터 시나리오에서 파일 이름 변경 기능이 일부 변경되었습니다.
Visual Studio Code 팀은 파일 이름을 바꿀 때 어떤 import 문을 업데이트해야 하는지 파악하는데 5초에서 10초가 소요될 수 있다고 들었습니다.
TypeScript 3.9는 [컴파일러 및 언어 서비스가 파일 조회를 캐싱 하는 방식의 내부 변경](https://github.com/microsoft/TypeScript/pull/37055)을 통해 이 문제를 해결합니다.

여전히 개선의 여지가 있지만, 이 작업이 모든 사람들에게 보다 빠른 경험으로 이어지기를 바랍니다!

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