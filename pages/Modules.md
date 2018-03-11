> **용어에 대한 참고 사항:**
TypeScript 1.5에서는 명칭이 변경되었습니다.  
"내부(Internal) 모듈"은 이제 "네임스페이스"입니다.  
"외부(External) 모듈"은 이제 [ECMAScript 2015](http://www.ecma-international.org/ecma-262/6.0)의 용어에 맞게  간단히 "모듈"입니다
(즉 `모듈 X {` 는 현재 선호되는 `네임스페이스 X {` 와 동일합니다).

# 소개

ECMAScript 2015부터 JavaScript에는 모듈 개념이 있습니다. TypeScript는 이 개념을 공유합니다.

모듈은 전역 스코프가 아닌 자체 스코프내에서 실행됩니다.  
이는 [`export` 형식](#export) 중 하나를 사용하여 명시적으로 내보내지 않는 한 모듈에 선언된 변수, 함수, 클래스 등이 모듈 외부에 보이지 않는다는 것을 의미합니다.  
반대로 다른 모듈에서 내보낸 변수, 함수, 클래스, 인터페이스 등을 사용하려면 [`import` 형식](#import) 중 하나를 사용하여 가져와야합니다.  

모듈은 선언적입니다. 모듈 간의 관계는 파일 수준에서 imports 및 exports 측면에서 지정됩니다.

모듈은 모듈 로더를 사용하여 또 다른 모듈을 import 합니다.  
런타임시 모듈 로더는 모듈을 실행하기 전에 모듈의 모든 의존성을 찾고 실행합니다.  
JavaScript에서 사용되는 잘 알려진 모듈 로더는 Node.js의 [CommonJS](https://en.wikipedia.org/wiki/CommonJS)모듈 로더이며 웹 어플리케이션의 경우 [require.js](http://requirejs.org/)입니다.

TypeScript에서는 ECMAScript 2015와 마찬가지로 최상위 `import` 또는 `export`가 포함된 파일을 모듈로 간주합니다.

# 내보내기 (Export)

## 내보내기 선언 (Exporting a declaration)

변수, 함수, 클래스, 타입 별칭 또는 인터페이스와 같은 선언문은 `export` 키워드를 추가하여 내보낼 수 있습니다.

##### Validation.ts

```ts
export interface StringValidator {
    isAcceptable(s: string): boolean;
}
```

##### ZipCodeValidator.ts

```ts
export const numberRegexp = /^[0-9]+$/;

export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}
```

## 내보내기 문 (Export statements)

Export 문은 사용자를 위해 Export의 이름을 변경해야 하는 경우에 유용하므로 위의 예제를 다음과 같이 작성할 수 있습니다:

```ts
class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}
export { ZipCodeValidator };
export { ZipCodeValidator as mainValidator };
```

## Re-exports

종종 모듈은 다른 모듈을 확장하고 일부 기능을 부분적으로 노출합니다.  
re-export는 로컬로 import하거나 로컬 변수를 도입하지 않습니다.


##### ParseIntBasedZipCodeValidator.ts

```ts
export class ParseIntBasedZipCodeValidator {
    isAcceptable(s: string) {
        return s.length === 5 && parseInt(s).toString() === s;
    }
}

// 원본 validator 내보내지만 이름을 변경합니다
export {ZipCodeValidator as RegExpBasedZipCodeValidator} from "./ZipCodeValidator";
```

선택적으로 모듈은 하나 이상의 모듈을 랩핑하고 `export * from "module"` 구문을 사용하여 모든 내보내기를 결합할 수 있습니다.

##### AllValidators.ts

```ts
export * from "./StringValidator"; // exports interface 'StringValidator'
export * from "./LettersOnlyValidator"; // exports class 'LettersOnlyValidator'
export * from "./ZipCodeValidator";  // exports class 'ZipCodeValidator'
```

# Import

import는 모듈에서 export만큼 쉽습니다.  
export 선언을 가져오려면 아래의 `import` 형식 중 하나를 사용하십시오.

## 모듈에서 단일 내보내기 가져오기 (Import a single export from a module)

```ts
import { ZipCodeValidator } from "./ZipCodeValidator";

let myValidator = new ZipCodeValidator();
```

imports 이름을 변경할 수도 있습니다.

```ts
import { ZipCodeValidator as ZCV } from "./ZipCodeValidator";
let myValidator = new ZCV();
```

## 전체 모듈을 단일 변수로 가져오고 이를 사용하여 모듈 내보내기에 접근합니다 (Import the entire module into a single variable, and use it to access the module exports)

```ts
import * as validator from "./ZipCodeValidator";
let myValidator = new validator.ZipCodeValidator();
```

## 부수-효과에 대한 모듈만 가져오기 (Import a module for side-effects only)

권장되지는 않지만 일부 모듈은 다른 모듈에서 사용할 수 있는 글로벌 상태를 설정합니다.  
이러한 모듈에는 어떠한 exports도 없거나 사용자가 해당 exports에 관심이 없을 수 있습니다.

이러한 모듈을 가져오려면 다음을 사용합니다:

```ts
import "./my-module.js";
```

# 기본 내보내기 (Default exports)

각 모듈은 선택적으로 `default` export를 내보낼 수 있습니다.  
Default exports는 `default` 키워드로 표시됩니다. 모듈별 `default` exports는 하나만 가능합니다.  
`default` exports는 다른 import 형식을 사용하여 가져옵니다.

`default` exports는 정말 편리합니다.  
예를 들어 `JQuery` 같은 라이브러리에는 default export인 `jQuery`또는 `$`가 있을 수 있으며 이를 `$`나 `jQuery`라는 이름으로도 가져올 수 있습니다.

##### JQuery.d.ts

```ts
declare let $: JQuery;
export default $;
```

##### App.ts

```ts
import $ from "JQuery";

$("button.continue").html( "Next Step..." );
```

클래스 및 함수 선언은  default exports로 직접 작성될 수 있습니다.  
Default export 클래스와 함수 선언 네이밍은 선택적입니다.

##### ZipCodeValidator.ts

```ts
export default class ZipCodeValidator {
    static numberRegexp = /^[0-9]+$/;
    isAcceptable(s: string) {
        return s.length === 5 && ZipCodeValidator.numberRegexp.test(s);
    }
}
```

##### Test.ts

```ts
import validator from "./ZipCodeValidator";

let myValidator = new validator();
```

또는

##### StaticZipCodeValidator.ts

```ts
const numberRegexp = /^[0-9]+$/;

export default function (s: string) {
    return s.length === 5 && numberRegexp.test(s);
}
```

##### Test.ts

```ts
import validate from "./StaticZipCodeValidator";

let strings = ["Hello", "98052", "101"];

// 함수 유효성 검사 사용
strings.forEach(s => {
  console.log(`"${s}" ${validate(s) ? " matches" : " does not match"}`);
});
```

`default` exports는 값 일 수도 있습니다:

##### OneTwoThree.ts

```ts
export default "123";
```

##### Log.ts

```ts
import num from "./OneTwoThree";

console.log(num); // "123"
```

# `export =` and `import = require()`

CommonJS와 AMD 모두 일반적으로 모듈의 모든 exports를 포함하는`exports` 객체 개념을 가지고 있습니다.

또한 `exports` 객체를 커스텀 단일 객체로 대체하는 것을 지원합니다.  
Default exports는이 동작을 대신하는 역할을 합니다.  
그러나 그 둘은 호환되지 않습니다.  
TypeScript는 기존의 CommonJS와 AMD 워크플로우를 모델링하기 위해 `export =`를 지원합니다.

`export =` 구문은 모듈에서 export된 단일 객체를 지정합니다.
클래스, 인터페이스, 네임스페이스, 함수 또는 열거 형이 될 수 있습니다.

`export =`를 사용하여 모듈을 가져올 때 모듈을 임포트하기 위해 TypeScript에 특정한 `import module = require("module")`을 사용해야합니다.

##### ZipCodeValidator.ts

```ts
let numberRegexp = /^[0-9]+$/;
class ZipCodeValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}
export = ZipCodeValidator;
```

##### Test.ts

```ts
import zip = require("./ZipCodeValidator");

// 시도할 샘플 몇개
let strings = ["Hello", "98052", "101"];

// 사용할 Validators
let validator = new zip();

// 각 문자열이 각 Validator를 통과했는지 여부를 보여줍니다.
strings.forEach(s => {
  console.log(`"${ s }" - ${ validator.isAcceptable(s) ? "matches" : "does not match" }`);
});
```

# 모듈을 위한 코드 생성 (Code Generation for Modules)

컴파일시 지정된 모듈 대상에 따라 컴파일러는 Node.js ([CommonJS](http://wiki.commonjs.org/wiki/CommonJS)), require.js ([AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)), [UMD](https://github.com/umdjs/umd), [SystemJS](https://github.com/systemjs/systemjs) 또는 [ECMAScript 2015 네이티브 모듈](http://www.ecma-international.org/ecma-262/6.0/#sec-modules) (ES6)에 적절한 코드를 생성합니다.  
생성된 코드에서 `define`, `require` 및 `register` 호출에 대한 자세한 정보는 각 모듈 로더에 대한 문서를 참조하세요.

이 간단한 예제는 import 및 export 중에 사용되는 이름이 모듈 로딩 코드로 어떻게 변환되는지 보여줍니다.

##### SimpleModule.ts

```ts
import m = require("mod");
export let t = m.something + 1;
```

##### AMD / RequireJS SimpleModule.js

```js
define(["require", "exports", "./mod"], function (require, exports, mod_1) {
    exports.t = mod_1.something + 1;
});
```

##### CommonJS / Node SimpleModule.js

```js
var mod_1 = require("./mod");
exports.t = mod_1.something + 1;
```

##### UMD SimpleModule.js

```js
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./mod"], factory);
    }
})(function (require, exports) {
    var mod_1 = require("./mod");
    exports.t = mod_1.something + 1;
});
```

##### System SimpleModule.js

```js
System.register(["./mod"], function(exports_1) {
    var mod_1;
    var t;
    return {
        setters:[
            function (mod_1_1) {
                mod_1 = mod_1_1;
            }],
        execute: function() {
            exports_1("t", t = mod_1.something + 1);
        }
    }
});
```

##### Native ECMAScript 2015 modules SimpleModule.js

```js
import { something } from "./mod";
export var t = something + 1;
```

# Simple Example

아래에서는 각 모듈에서 이름이 지정된 단일 export만 내보내도록 이전 예제에 사용된 Validator 구현을 통합했습니다.

컴파일하려면 커맨드 라인에 모듈 대상을 지정해야합니다.  
Node.js는 `--module commonjs`를 사용하세요.  
require.js의 경우, --module amd를 사용합니다.  
예를 들면:

```Shell
tsc --module commonjs Test.ts
```
컴파일시 각 모듈은 별도의 `.js` 파일이됩니다.  
참조 태그와 마찬가지로 컴파일러는 의존된 파일들을 컴파일하기 위해 `import` 문을 따릅니다.

##### Validation.ts

```ts
export interface StringValidator {
    isAcceptable(s: string): boolean;
}
```

##### LettersOnlyValidator.ts

```ts
import { StringValidator } from "./Validation";

const lettersRegexp = /^[A-Za-z]+$/;

export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
        return lettersRegexp.test(s);
    }
}
```

##### ZipCodeValidator.ts

```ts
import { StringValidator } from "./Validation";

const numberRegexp = /^[0-9]+$/;

export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}
```

##### Test.ts

```ts
import { StringValidator } from "./Validation";
import { ZipCodeValidator } from "./ZipCodeValidator";
import { LettersOnlyValidator } from "./LettersOnlyValidator";

// 시도할 샘플 몇개
let strings = ["Hello", "98052", "101"];

// 사용할 Validators
let validators: { [s: string]: StringValidator; } = {};
validators["ZIP code"] = new ZipCodeValidator();
validators["Letters only"] = new LettersOnlyValidator();

// 각 문자열이 각 Validator를 통과했는지 여부를 보여줍니다.
strings.forEach(s => {
    for (let name in validators) {
        console.log(`"${ s }" - ${ validators[name].isAcceptable(s) ? "matches" : "does not match" } ${ name }`);
    }
});
```

# Optional Module Loading and Other Advanced Loading Scenarios

In some cases, you may want to only load a module under some conditions.
In TypeScript, we can use the pattern shown below to implement this and other advanced loading scenarios to directly invoke the module loaders without losing type safety.

The compiler detects whether each module is used in the emitted JavaScript.
If a module identifier is only ever used as part of a type annotations and never as an expression, then no `require` call is emitted for that module.
This elision of unused references is a good performance optimization, and also allows for optional loading of those modules.

The core idea of the pattern is that the `import id = require("...")` statement gives us access to the types exposed by the module.
The module loader is invoked (through `require`) dynamically, as shown in the `if` blocks below.
This leverages the reference-elision optimization so that the module is only loaded when needed.
For this pattern to work, it's important that the symbol defined via an `import` is only used in type positions (i.e. never in a position that would be emitted into the JavaScript).

To maintain type safety, we can use the `typeof` keyword.
The `typeof` keyword, when used in a type position, produces the type of a value, in this case the type of the module.

##### Dynamic Module Loading in Node.js

```ts
declare function require(moduleName: string): any;

import { ZipCodeValidator as Zip } from "./ZipCodeValidator";

if (needZipValidation) {
    let ZipCodeValidator: typeof Zip = require("./ZipCodeValidator");
    let validator = new ZipCodeValidator();
    if (validator.isAcceptable("...")) { /* ... */ }
}
```

##### Sample: Dynamic Module Loading in require.js

```ts
declare function require(moduleNames: string[], onLoad: (...args: any[]) => void): void;

import * as Zip from "./ZipCodeValidator";

if (needZipValidation) {
    require(["./ZipCodeValidator"], (ZipCodeValidator: typeof Zip) => {
        let validator = new ZipCodeValidator.ZipCodeValidator();
        if (validator.isAcceptable("...")) { /* ... */ }
    });
}
```

##### Sample: Dynamic Module Loading in System.js

```ts
declare const System: any;

import { ZipCodeValidator as Zip } from "./ZipCodeValidator";

if (needZipValidation) {
    System.import("./ZipCodeValidator").then((ZipCodeValidator: typeof Zip) => {
        var x = new ZipCodeValidator();
        if (x.isAcceptable("...")) { /* ... */ }
    });
}
```

# Working with Other JavaScript Libraries

To describe the shape of libraries not written in TypeScript, we need to declare the API that the library exposes.

We call declarations that don't define an implementation "ambient".
Typically, these are defined in `.d.ts` files.
If you're familiar with C/C++, you can think of these as `.h` files.
Let's look at a few examples.

## Ambient Modules

In Node.js, most tasks are accomplished by loading one or more modules.
We could define each module in its own `.d.ts` file with top-level export declarations, but it's more convenient to write them as one larger `.d.ts` file.
To do so, we use a construct similar to ambient namespaces, but we use the `module` keyword and the quoted name of the module which will be available to a later import.
For example:

##### node.d.ts (simplified excerpt)

```ts
declare module "url" {
    export interface Url {
        protocol?: string;
        hostname?: string;
        pathname?: string;
    }

    export function parse(urlStr: string, parseQueryString?, slashesDenoteHost?): Url;
}

declare module "path" {
    export function normalize(p: string): string;
    export function join(...paths: any[]): string;
    export var sep: string;
}
```

Now we can `/// <reference>` `node.d.ts` and then load the modules using `import url = require("url");` or `import * as URL from "url"`.

```ts
/// <reference path="node.d.ts"/>
import * as URL from "url";
let myUrl = URL.parse("http://www.typescriptlang.org");
```

### Shorthand ambient modules

If you don't want to take the time to write out declarations before using a new module, you can use a shorthand declaration to get started quickly.

##### declarations.d.ts

```ts
declare module "hot-new-module";
```

All imports from a shorthand module will have the `any` type.

```ts
import x, {y} from "hot-new-module";
x(y);
```

### Wildcard module declarations

Some module loaders such as [SystemJS](https://github.com/systemjs/systemjs/blob/master/docs/overview.md#plugin-syntax)
and [AMD](https://github.com/amdjs/amdjs-api/blob/master/LoaderPlugins.md) allow non-JavaScript content to be imported.
These typically use a prefix or suffix to indicate the special loading semantics.
Wildcard module declarations can be used to cover these cases.

```ts
declare module "*!text" {
    const content: string;
    export default content;
}
// Some do it the other way around.
declare module "json!*" {
    const value: any;
    export default value;
}
```

Now you can import things that match `"*!text"` or `"json!*"`.

```ts
import fileContent from "./xyz.txt!text";
import data from "json!http://example.com/data.json";
console.log(data, fileContent);
```

### UMD modules

Some libraries are designed to be used in many module loaders, or with no module loading (global variables).
These are known as [UMD](https://github.com/umdjs/umd) modules.
These libraries can be accessed through either an import or a global variable.
For example:

##### math-lib.d.ts

```ts
export function isPrime(x: number): boolean;
export as namespace mathLib;
```

The library can then be used as an import within modules:

```ts
import { isPrime } from "math-lib";
isPrime(2);
mathLib.isPrime(2); // ERROR: can't use the global definition from inside a module
```

It can also be used as a global variable, but only inside of a script.
(A script is a file with no imports or exports.)

```ts
mathLib.isPrime(2);
```

# Guidance for structuring modules

## Export as close to top-level as possible

Consumers of your module should have as little friction as possible when using things that you export.
Adding too many levels of nesting tends to be cumbersome, so think carefully about how you want to structure things.

Exporting a namespace from your module is an example of adding too many layers of nesting.
While namespaces sometime have their uses, they add an extra level of indirection when using modules.
This can quickly become a pain point for users, and is usually unnecessary.

Static methods on an exported class have a similar problem - the class itself adds a layer of nesting.
Unless it increases expressivity or intent in a clearly useful way, consider simply exporting a helper function.

### If you're only exporting a single `class` or `function`, use `export default`

Just as "exporting near the top-level" reduces friction on your module's consumers, so does introducing a default export.
If a module's primary purpose is to house one specific export, then you should consider exporting it as a default export.
This makes both importing and actually using the import a little easier.
For example:

#### MyClass.ts

```ts
export default class SomeType {
  constructor() { ... }
}
```

#### MyFunc.ts

```ts
export default function getThing() { return "thing"; }
```

#### Consumer.ts

```ts
import t from "./MyClass";
import f from "./MyFunc";
let x = new t();
console.log(f());
```

This is optimal for consumers. They can name your type whatever they want (`t` in this case) and don't have to do any excessive dotting to find your objects.

### If you're exporting multiple objects, put them all at top-level

#### MyThings.ts

```ts
export class SomeType { /* ... */ }
export function someFunc() { /* ... */ }
```

Conversely when importing:

### Explicitly list imported names

#### Consumer.ts

```ts
import { SomeType, someFunc } from "./MyThings";
let x = new SomeType();
let y = someFunc();
```

### Use the namespace import pattern if you're importing a large number of things

#### MyLargeModule.ts

```ts
export class Dog { ... }
export class Cat { ... }
export class Tree { ... }
export class Flower { ... }
```

#### Consumer.ts

```ts
import * as myLargeModule from "./MyLargeModule.ts";
let x = new myLargeModule.Dog();
```

## Re-export to extend

Often you will need to extend functionality on a module.
A common JS pattern is to augment the original object with *extensions*, similar to how JQuery extensions work.
As we've mentioned before, modules do not *merge* like global namespace objects would.
The recommended solution is to *not* mutate the original object, but rather export a new entity that provides the new functionality.

Consider a simple calculator implementation defined in module `Calculator.ts`.
The module also exports a helper function to test the calculator functionality by passing a list of input strings and writing the result at the end.

#### Calculator.ts

```ts
export class Calculator {
    private current = 0;
    private memory = 0;
    private operator: string;

    protected processDigit(digit: string, currentValue: number) {
        if (digit >= "0" && digit <= "9") {
            return currentValue * 10 + (digit.charCodeAt(0) - "0".charCodeAt(0));
        }
    }

    protected processOperator(operator: string) {
        if (["+", "-", "*", "/"].indexOf(operator) >= 0) {
            return operator;
        }
    }

    protected evaluateOperator(operator: string, left: number, right: number): number {
        switch (this.operator) {
            case "+": return left + right;
            case "-": return left - right;
            case "*": return left * right;
            case "/": return left / right;
        }
    }

    private evaluate() {
        if (this.operator) {
            this.memory = this.evaluateOperator(this.operator, this.memory, this.current);
        }
        else {
            this.memory = this.current;
        }
        this.current = 0;
    }

    public handelChar(char: string) {
        if (char === "=") {
            this.evaluate();
            return;
        }
        else {
            let value = this.processDigit(char, this.current);
            if (value !== undefined) {
                this.current = value;
                return;
            }
            else {
                let value = this.processOperator(char);
                if (value !== undefined) {
                    this.evaluate();
                    this.operator = value;
                    return;
                }
            }
        }
        throw new Error(`Unsupported input: '${char}'`);
    }

    public getResult() {
        return this.memory;
    }
}

export function test(c: Calculator, input: string) {
    for (let i = 0; i < input.length; i++) {
        c.handelChar(input[i]);
    }

    console.log(`result of '${input}' is '${c.getResult()}'`);
}
```

Here is a simple test for the calculator using the exposed `test` function.

#### TestCalculator.ts

```ts
import { Calculator, test } from "./Calculator";


let c = new Calculator();
test(c, "1+2*33/11="); // prints 9
```

Now to extend this to add support for input with numbers in bases other than 10, let's create `ProgrammerCalculator.ts`

#### ProgrammerCalculator.ts

```ts
import { Calculator } from "./Calculator";

class ProgrammerCalculator extends Calculator {
    static digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];

    constructor(public base: number) {
        super();
        if (base <= 0 || base > ProgrammerCalculator.digits.length) {
            throw new Error("base has to be within 0 to 16 inclusive.");
        }
    }

    protected processDigit(digit: string, currentValue: number) {
        if (ProgrammerCalculator.digits.indexOf(digit) >= 0) {
            return currentValue * this.base + ProgrammerCalculator.digits.indexOf(digit);
        }
    }
}

// Export the new extended calculator as Calculator
export { ProgrammerCalculator as Calculator };

// Also, export the helper function
export { test } from "./Calculator";
```

The new module `ProgrammerCalculator` exports an API shape similar to that of the original `Calculator` module, but does not augment any objects in the original module.
Here is a test for our ProgrammerCalculator class:

#### TestProgrammerCalculator.ts

```ts
import { Calculator, test } from "./ProgrammerCalculator";

let c = new Calculator(2);
test(c, "001+010="); // prints 3
```

## Do not use namespaces in modules

When first moving to a module-based organization, a common tendency is to wrap exports in an additional layer of namespaces.
Modules have their own scope, and only exported declarations are visible from outside the module.
With this in mind, namespace provide very little, if any, value when working with modules.

On the organization front, namespaces are handy for grouping together logically-related objects and types in the global scope.
For example, in C#, you're going to find all the collection types in System.Collections.
By organizing our types into hierarchical namespaces, we provide a good "discovery" experience for users of those types.
Modules, on the other hand, are already present in a file system, necessarily.
We have to resolve them by path and filename, so there's a logical organization scheme for us to use.
We can have a /collections/generic/ folder with a list module in it.

Namespaces are important to avoid naming collisions in the global scope.
For example, you might have `My.Application.Customer.AddForm` and `My.Application.Order.AddForm` -- two types with the same name, but a different namespace.
This, however, is not an issue with modules.
Within a module, there's no plausible reason to have two objects with the same name.
From the consumption side, the consumer of any given module gets to pick the name that they will use to refer to the module, so accidental naming conflicts are impossible.

> For more discussion about modules and namespaces see [Namespaces and Modules](./Namespaces and Modules.md).

## Red Flags

All of the following are red flags for module structuring. Double-check that you're not trying to namespace your external modules if any of these apply to your files:

* A file whose only top-level declaration is `export namespace Foo { ... }` (remove `Foo` and move everything 'up' a level)
* A file that has a single `export class` or `export function` (consider using `export default`)
* Multiple files that have the same `export namespace Foo {` at top-level (don't think that these are going to combine into one `Foo`!)
