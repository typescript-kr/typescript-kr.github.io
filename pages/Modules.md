> **용어에 대한 참고 사항:**
TypeScript 1.5에서는 명칭이 변경되었습니다.  
"내부(Internal) 모듈"은 이제 "네임스페이스"입니다.  
"외부(External) 모듈"은 이제 [ECMAScript 2015](http://www.ecma-international.org/ecma-262/6.0)의 용어에 맞게  간단히 "모듈"입니다
(즉 `모듈 X {` 는 현재 선호되는 `네임스페이스 X {` 와 동일합니다).

# 소개

ECMAScript 2015부터 JavaScript에는 모듈 개념이 있습니다. TypeScript는 이 개념을 공유합니다.

모듈은 전역 스코프가 아닌 자체 스코프 내에서 실행됩니다.  
이는 [`export` 형식](#export) 중 하나를 사용하여 명시적으로 내보내지 않는 한 모듈에 선언된 변수, 함수, 클래스 등이 모듈 외부에 보이지 않는다는 것을 의미합니다.  
반대로 다른 모듈에서 내보낸 변수, 함수, 클래스, 인터페이스 등을 사용하려면 [`import` 형식](#import) 중 하나를 사용하여 가져와야 합니다.  

모듈은 선언적입니다. 모듈 간의 관계는 파일 수준에서 imports 및 exports 측면에서 지정됩니다.

모듈은 모듈 로더를 사용하여 또 다른 모듈을 import 합니다.  
런타임시 모듈 로더는 모듈을 실행하기 전에 모듈의 모든 의존성을 찾고 실행합니다.  
JavaScript에서 사용되는 잘 알려진 모듈 로더는 Node.js의 [CommonJS](https://en.wikipedia.org/wiki/CommonJS)모듈 로더이며 웹 애플리케이션의 경우 [require.js](http://requirejs.org/)입니다.

TypeScript에서는 ECMAScript 2015와 마찬가지로 최상위 `import` 또는 `export`가 포함된 파일을 모듈로 간주합니다.

# 내보내기 (Export)

## 내보내기 선언 (Exporting a declaration)

변수, 함수, 클래스, 타입 별칭(alias) 또는 인터페이스와 같은 선언문은 `export` 키워드를 추가하여 내보낼 수 있습니다.

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

## 다시 내보내기 (Re-exports)

종종 모듈은 다른 모듈을 확장하고 일부 기능을 부분적으로 노출합니다.  
다시 내보내기(re-export)는 로컬로 import하거나 로컬 변수를 도입하지 않습니다.


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

선택적으로 모듈은 하나 이상의 모듈을 감싸고 `export * from "module"` 구문을 사용하여 모든 export를 결합할 수 있습니다.

##### AllValidators.ts

```ts
export * from "./StringValidator"; // exports interface 'StringValidator'
export * from "./LettersOnlyValidator"; // exports class 'LettersOnlyValidator'
export * from "./ZipCodeValidator";  // exports class 'ZipCodeValidator'
```

# Import

import는 모듈에서 export 만큼 쉽습니다.  
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

## 전체 모듈을 단일 변수로 가져오고 이를 사용하여 모듈 내보내기에 접근하기 (Import the entire module into a single variable, and use it to access the module exports)

```ts
import * as validator from "./ZipCodeValidator";
let myValidator = new validator.ZipCodeValidator();
```

## 부수 효과에 대한 모듈만 가져오기 (Import a module for side-effects only)

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
예를 들어 `JQuery` 같은 라이브러리에는 default export인 `jQuery` 또는 `$`가 있을 수 있으며 이를 `$`나 `jQuery`라는 이름으로도 가져올 수 있습니다.

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

클래스 및 함수 선언은 default exports로 직접 작성될 수 있습니다.  
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

CommonJS와 AMD 모두 일반적으로 모듈의 모든 exports를 포함하는 `exports` 객체 개념을 가지고 있습니다.

또한 `exports` 객체를 커스텀 단일 객체로 대체하는 것을 지원합니다.  
Default exports는이 동작을 대신하는 역할을 합니다.  
그러나 그 둘은 호환되지 않습니다.  
TypeScript는 기존의 CommonJS와 AMD 워크플로우를 모델링하기 위해 `export =`를 지원합니다.

`export =` 구문은 모듈에서 export된 단일 객체를 지정합니다.
클래스, 인터페이스, 네임스페이스, 함수 또는 열거형이 될 수 있습니다.

`export =`를 사용하여 모듈을 import 할 때 모듈을 import 하기 위해 TypeScript에 특정한 `import module = require("module")`을 사용해야합니다.

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

// 시험용 샘플
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

# 간단한 예제 (Simple Example)

아래에서는 각 모듈에서 이름이 지정된 단일 export만 내보내도록 이전 예제에 사용된 Validator 구현을 통합했습니다.

컴파일하려면 커맨드 라인에 모듈 대상을 지정해야 합니다.  
Node.js는 `--module commonjs`를 사용하세요.  
require.js의 경우 --module amd를 사용합니다.  

예를 들면:

```Shell
tsc --module commonjs Test.ts
```
컴파일시 각 모듈은 별도의 `.js` 파일이 됩니다.  
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

// 시험용 샘플
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

# 선택적 모듈 로딩과 기타 고급 로딩 시나리오 (Optional Module Loading and Other Advanced Loading Scenarios)

상황에 따라 일부 조건에서만 모듈을 로드할 수 있습니다.  
TypeScript에서는 아래의 패턴을 통해 다른 고급 로드 시나리오를 구현하여 타입 안전성을 잃지 않고 모듈 로더를 직접 호출할 수 있습니다.  
컴파일러는 각 모듈이 발생된 JavaScript에서 사용되는지 여부를 감지합니다.  
모듈 식별자가 타입 어노테이션의 일부로만 사용되고 표현식으로 사용되지 않으면 해당 모듈에 대한 `require` 호출이 발생하지 않습니다.  
사용하지 않는 참조를 제거하면 성능이 최적화되고 해당 모듈을 선택적으로 로드할 수 있습니다.

이 패턴의 핵심 아이디어는 `import id = require("...")`문이 모듈에 의해 노출된 타입에 접근할 수 있다는 것입니다.  
모듈 로더는 아래의 `if` 블록처럼 동적으로 (`require`를 통해) 호출됩니다.  
이는 참조 생략 최적화가 활용되어 모듈이 필요한 경우에만 로드됩니다.  
이 패턴이 작동하려면 `import`를 통해 정의된 symbol이 타입 위치에서만 사용되어야 합니다(즉 JavaScript로 발생될 수 있는 위치에 절대 존재하지 않습니다).

타입 안전성을 유지하기 위해 `typeof` 키워드를 사용할 수 있습니다.  
`typeof` 키워드는 타입의 위치에서 사용될 때 값의 타입을 생성하며 이 경우 모듈의 타입이 됩니다.

##### Node.js의 동적 모듈 로딩 (Dynamic Module Loading in Node.js)

```ts
declare function require(moduleName: string): any;

import { ZipCodeValidator as Zip } from "./ZipCodeValidator";

if (needZipValidation) {
    let ZipCodeValidator: typeof Zip = require("./ZipCodeValidator");
    let validator = new ZipCodeValidator();
    if (validator.isAcceptable("...")) { /* ... */ }
}
```

##### 샘플: require.js의 동적 모듈 로딩 (Dynamic Module Loading in require.js)

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

##### 샘플: System.js의 동적 모듈 로딩 (Dynamic Module Loading in System.js)

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

# 다른 JavaScript 라이브러리 사용 (Working with Other JavaScript Libraries)

TypeScript로 작성되지 않은 라이브러리의 형태을 설명하려면 라이브러리가 나타내는 API를 선언해야 합니다.

구현을 "ambient"으로 정의하지 않는 선언이라고 하며 
일반적으로 이들은 `.d.ts` 파일에 정의되어 있습니다.  
C/C++에 익숙하다면 이것들을 `.h`파일로 생각할 수 있을 것입니다.

몇 가지 예를 들어보겠습니다

## Ambient Modules

Node.js에서 대부분의 작업은 하나 이상의 모듈을 로드하여 수행됩니다.  
각 모듈을 `.d.ts` 파일에 최상위 수준의 내보내기 선언으로 정의할 수 있지만 더 넓은 `.d.ts` 파일로 작성하는 것이 더 편리합니다.  
그렇게하기 위해서 ambient 네임스페이스와 비슷한 구조를 사용하지만 나중에 import 할 수 있는 모듈의 `module` 키워드와 따옴표 붙은 이름을 사용합니다.

예를 들면:

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

이제 `/// <reference>` `node.d.ts` 를 만들 수 있고 `import url = require("url");` 또는 `import * as URL from "url"`
를 사용하여 모듈을 적재할 수 있습니다.

```ts
/// <reference path="node.d.ts"/>
import * as URL from "url";
let myUrl = URL.parse("http://www.typescriptlang.org");
```

### Shorthand ambient modules

새로운 모듈을 사용하기 전에 선언을 작성하는 시간을 내고 싶지 않다면 shorthand 선언을 사용하여 빠르게 시작할 수 있습니다.

##### declarations.d.ts

```ts
declare module "hot-new-module";
```

shorthand 모듈의 모든 imports는 `any` 타입을 가집니다.

```ts
import x, {y} from "hot-new-module";
x(y);
```

### Wildcard module declarations

[SystemJS](https://github.com/systemjs/systemjs/blob/master/docs/overview.md#plugin-syntax) 및 [AMD](https://github.com/amdjs/amdjs-api/blob/master/LoaderPlugins.md) 같은 일부 모듈 로더들은 JavaScript가 아닌 컨텐츠를 import 할 수 있습니다.  
일반적으로 특별한 로드의 의미론을 나타내는 접두사 또는 접미사를 사용한다.   
이러한 경우를 다루기 위해 Wildcard 모듈 선언을 사용할 수 있습니다.

```ts
declare module "*!text" {
    const content: string;
    export default content;
}
// 일부는 그 반대의 방법을 사용합니다.
declare module "json!*" {
    const value: any;
    export default value;
}
```

이제 `"*!text"` 또는 `"json!*"` 과 일치하는 것을 import 할 수 있습니다.

```ts
import fileContent from "./xyz.txt!text";
import data from "json!http://example.com/data.json";
console.log(data, fileContent);
```

### UMD modules

일부 라이브러리는 많은 모듈 로더에서 사용하도록 설계되었거나 모듈 로드가 없습니다 (글로벌 변수).  
이러한 모듈을 [UMD](https://github.com/umdjs/umd) 모듈이라고 합니다.  
이러한 라이브러리는 import 또는 글로벌 변수를 통해 접근할 수 있습니다.

예를 들면:

##### math-lib.d.ts

```ts
export function isPrime(x: number): boolean;
export as namespace mathLib;
```

그러면 라이브러리를 모듈에서 import로 사용할 수 있습니다.

```ts
import { isPrime } from "math-lib";
isPrime(2);
mathLib.isPrime(2); // 오류: 모듈 내부에서 전역 정의를 할 수 없습니다.
```

글로벌 변수로 사용할 수도 있지만 스크립트 내부에서만 사용할 수 있습니다.  
(스크립트는 imports 또는 exports가 없는 파일입니다)

```ts
mathLib.isPrime(2);
```

# 모듈 구조화를 위한 가이드 (Guidance for structuring modules)

## 최상위 레벨에 가깝게 내보내기 (Export as close to top-level as possible)

모듈의 사용자들은 export 한 것들을 사용할 때 가능한 한 마찰이 적어야 합니다.  
너무 많은 중첩의 레벨을 추가하는 것은 다루기 힘들기 때문에 구조화 방법에 대해 신중히 생각하세요.

모듈에서 네임스페이스를 export 하는 것은 중첩 계층을 너무 많이 추가하는 예입니다.  
네임스페이스가 필요할때도 있지만 모듈을 사용할 때는 추가적인 레벨의 간접 참조를 추가합니다.  
이는 사용자에게 재빠르게 고통이 될 수 있으며 일반적으로 불필요합니다.  

export 클래스의 정적 메서드에도 비슷한 문제가 있습니다 - 클래스 자체적으로 중첩 계층을 추가합니다.  
표현이나 의도가 명확하고 유용한 방식으로 증가하지 않는 한 간단한 헬퍼 함수를 내보내는 것을 고려하세요.

### 단일 `class` 또는 `function`만 export하는 경우 `export default`를 사용하세요 (If you're only exporting a single `class` or `function`, use `export default`)

"최상위 레벨에 가깝게 내보내기"가 모듈 사용자의 마찰을 줄이는 것처럼 default export를 도입하는 것도 마찬가지입니다.   
모듈의 주요 목적이 하나의 특정 export를 저장하는 것이라면 이를 default export로 export 하는 것을 고려해야 합니다.  
이렇게 하면 importing를 사용하며 실제로 import를 더 쉽게 사용할 수 있습니다.

예를 들면:

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

이는 사용자를 위한 최적의 선택입니다.  
타입의 이름을 원하는 대로 지을 수 있으며(이 경우 `t`) 객체를 찾기 위해 과도하게 점을 찍을 필요가 없습니다.

### 다수의 객체를 내보내는 경우 모두 최상위 레벨에 배치하세요. (If you're exporting multiple objects, put them all at top-level)

#### MyThings.ts

```ts
export class SomeType { /* ... */ }
export function someFunc() { /* ... */ }
```

반대로 가져올 때:

### imported 이름을 명시적으로 나열 (Explicitly list imported names)

#### Consumer.ts

```ts
import { SomeType, someFunc } from "./MyThings";
let x = new SomeType();
let y = someFunc();
```

### 다수를 importing 하는 경우 네임스페이스 import 패턴 사용 (Use the namespace import pattern if you're importing a large number of things)

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

## 확장을 위한 다시 내보내기 (Re-export to extend)

종종 모듈의 기능을 확장해야 합니다.  
일반적인 JS 패턴은 JQuery 확장이 작동하는 것과 비슷한 *extensions*을 사용하여 원본 객체를 보강하는 것입니다.  
앞서 언급했듯이 모듈은 전역 네임스페이스 객체처럼 *병합*되지 않습니다.  
권장되는 해결책은 원본 객체를 변형시키지 *않고* 새로운 기능을 제공하는 새로운 엔티티를 export하는  것입니다.

`Calculator.ts` 모듈에 정의된 간단한 계산기 구현을 고려해보세요.  
또한 모듈은 입력 문자열 목록을 전달하고 끝에 결과를 작성하여 계산기 기능을 테스트하는 헬퍼 함수를 exports 합니다.

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

다음은 `test` 함수를 사용한 계산기의 간단한 테스트입니다.

#### TestCalculator.ts

```ts
import { Calculator, test } from "./Calculator";


let c = new Calculator();
test(c, "1+2*33/11="); // 9
```

이제 이것을 확장하여 10이 아닌 다른 수의 입력에 대한 지원을 추가하기 위한 `ProgrammerCalculator.ts`를 작성해 봅시다.

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

// 새롭게 확장된 계산기를 계산기로 export 합니다.
export { ProgrammerCalculator as Calculator };

// 또한 헬퍼 함수를 export 합니다.
export { test } from "./Calculator";
```

다음은 우리의 ProgrammerCalculator 클래스에 대한 테스트입니다.  
새로운 모듈 `ProgrammerCalculator`는 원래 `Calculator` 모듈과 비슷한 API 형태을 export 하지만 원본 모듈의 어떠한 객체도 보강하지 않습니다.

다음은 ProgrammerCalculator 클래스에 대한 테스트입니다:

#### TestProgrammerCalculator.ts

```ts
import { Calculator, test } from "./ProgrammerCalculator";

let c = new Calculator(2);
test(c, "001+010="); // 3
```

## 모듈에서 네임 스페이스를 사용하지 마세요 (Do not use namespaces in modules)

모듈 기반 조직으로 처음 이동할 때의 트렌드는 추가 네임 스페이스 계층에 exports를 래핑하는 것입니다.  
모듈에는 자체적인 스코프가 있으며 exports 선언만 모듈 외부에서 볼 수 있습니다.  
이를 염두에 두고 네임스페이스는 모듈을 사용할 때 매우 작은 값을 제공합니다.

조직 측면에서는 네임스페이스가 논리적으로 관련된 객체와 타입을 전역 스코프로 그룹화할 때 편리합니다.   
예를 들어 C#에서는 System.Collections의 모든 컬렉션 타입을 찾습니다.  

타입을 계층적 네임스페이스로 구성하여 이러한 타입의 사용자에게 훌륭한 "발견" 경험을 제공합니다.  
반면 모듈은 필수적으로 파일 시스템에 이미 존재합니다.  
경로와 파일 이름으로 해결해야 하므로 사용할 수있는 논리적 조직 체계가 있습니다.  
목록 모듈이 포함된 /collections/generic/ 폴더를 사용할 수 있습니다.

전역 스코프에서 충돌된 이름을 지정하지 않으려면 네임스페이스가 중요합니다.  
예를 들어  `My.Application.Customer.AddForm`과 `My.Application.Order.AddForm` 같은 이름이지만 다른 네임스페이스를 가진 두 가지 타입이 있을 수 있습니다.  
그러나 이것은 모듈과 관련된 문제는 아닙니다.  
모듈 내에서 동일한 이름을 가진 두 개의 객체를 갖는 그럴듯한 이유는 없습니다.  
사용자는 모듈을 참조하는 데 사용할 이름을 선택하게 되므로 우연한 이름 충돌은 불가능합니다.

> 모듈과 네임스페이스에 대한 자세한 내용은 [네임 스페이스와 모듈](./Namespaces and Modules.md)을 참조하세요.

## 위험 신호 (Red Flags)

다음은 모두 모듈 구조화를 위한 위험 요소들입니다.  
이 중 하나라도 파일에 적용되는 경우 외부 모듈의 네임스페이스를 지정하려고 하지 않는지 다시 확인하세요.

*  오직 최상위 레벨 선언만 `export namespace Foo { ... }`인 파일 (`Foo`를 제거하고 모든 것을 '위로' 이동시키세요)
* 단일 `export class` 또는 `export function`가 있는 파일 (`export default` 사용을 고려하세요)
* 최상위 파일 위치에 동일한 `export namespace Foo {`를 가진 다수의 파일 (이것들이 `Foo` 하나로 결합될 것이라고 생각하지 마세요!)