TypeScript 2.3 이상의 버전에서는 `--checkJs`를 사용해 `.js` 파일에서 타입 검사 및 오류 보고를 지원합니다.

`// @ts-nocheck` 주석을 달아 일부 파일에서 타입 검사를 건너뛸 수 있으며; 반대로 `// @ts-check` 주석을 달아 `--checkJs`를 사용하지 않고 일부 `.js` 파일에 대해서만 타입 검사를 하도록 선택할 수 있습니다.
또한 특정 부분의 앞 줄에 `// @ts-ignore`를 달아 에러를 무시할 수도 있습니다.
`tsconfig.json`이 있는 경우, JavaScript 검사는 `noImplicitAny`, `strictNullChecks` 등의 엄격한 플래그를 우선시한다는 점을 알아두세요.
하지만, JavaScript 검사의 상대적인 느슨함 덕분에 엄격한 플래그와 결합하여 사용하는 것은 놀라운 결과를 보여줄 것입니다.

`.ts` 파일과 `.js` 파일은 타입을 검사하는 방법에 몇 가지 주목할만한 차이점이 있습니다:

## 타입 정보로 사용되는 JSDoc 타입 (JSDoc types are used for type information)

`.js` 파일에서는, 흔히 `.ts` 파일처럼 타입을 추론해볼 수 있습니다.
타입을 추론할 수 없는 경우, `.ts`의 타입 표시와 같은 방법으로 JSDoc을 사용해 이를 지정할 수 있습니다.
TypeScript와 마찬가지로, `--noImplicitAny`는 컴파일러가 타입을 유추할 수 없는 부분에서 오류를 보고할 것입니다.
(확장 가능한 객체 리터럴을 제외하고; 자세한 내용은 아래를 참고하세요.)

선언에 JSDoc 표시를 사용하면 해당 선언의 타입을 설정할 수 있습니다. 예를 들면:

```js
/** @type {number} */
var x;

x = 0;      // 성공
x = false;  // 오류: 불리언(boolean)에는 숫자를 할당할 수 없음
```

사용 가능한 JSDoc 패턴 목록은 [이곳](#지원되는-JSDoc-supported-jsdoc)에서 확인할 수 있습니다.

## 클래스 본문의 할당에서 추론된 프로퍼티 (Properties are inferred from assignments in class bodies)

ES2015에는 클래스에 프로퍼티를 선언할 수 있는 수단이 없습니다. 프로퍼티는 객체 리터럴과 같이 동적으로 할당됩니다.

`.js` 파일에서, 컴파일러는 클래스 본문 내부에서 할당된 프로퍼티로부터 프로퍼티들을 추론합니다.
생성자가 정의되어 있지 않거나, 생성자에서 정의된 타입이 `undefined`나 `null`이 아닐 경우, 프로퍼티의 타입은 생성자에서 주어진 타입과 동일합니다.
전자에 해당 프로퍼티의 경우, 할당되었던 모든 값들의 타입을 가진 유니언 타입이 됩니다.
생성자에 정의된 프로퍼티는 항상 존재하는 것으로 가정하는 반면, 메서드, getter, setter에서만 정의된 프로퍼티는 선택적인 것으로 간주합니다.

```js
class C {
    constructor() {
        this.constructorOnly = 0
        this.constructorUnknown = undefined
    }
    method() {
        this.constructorOnly = false // 오류, constructorOnly는 Number 타입임
        this.constructorUnknown = "plunkbat" // 성공, constructorUnknown의 타입은 string | undefined
        this.methodOnly = 'ok'  // 성공, 그러나 methodOnly는 undefined 타입 또한 허용됨
    }
    method2() {
        this.methodOnly = true  // 이 또한 성공, methodOnly의 타입은 string | boolean | undefined
    }
}
```

프로퍼티가 클래스 본문에서 설정되지 않았다면, 알 수 없는 것으로 간주합니다.
클래스에 읽기 전용 프로퍼티가 있는 경우, 생성자에서 선언에 JSDoc을 사용하여 타입을 추가하여 표시합니다.
이후엔 초기화하더라도 값을 지정할 필요가 없습니다.

```js
class C {
    constructor() {
        /** @type {number | undefined} */
        this.prop = undefined;
        /** @type {number | undefined} */
        this.count;
    }
}

let c = new C();
c.prop = 0;          // 성공
c.count = "string";  // 오류: string 은 number|undefined에 할당할 수 없음
```

## 생성자 함수와 클래스는 동일 (Constructor functions are equivalent to classes)

ES2015 이전에는, JavaScript는 클래스 대신 생성자 함수를 사용했습니다.
컴파일러는 이러한 패턴을 지원하며 생성자 함수를 ES2015 클래스와 동일한 것으로 이해합니다.
앞서 설명한 프로퍼티 추론 규칙 또한 정확히 같은 방식으로 작용합니다.

```js
function C() {
    this.constructorOnly = 0
    this.constructorUnknown = undefined
}
C.prototype.method = function() {
    this.constructorOnly = false // 오류
    this.constructorUnknown = "plunkbat" // 성공, 타입은 string | undefined가 됨
}
```

## CommonJS 모듈 지원 (CommonJS modules are supported)

`.js` 파일에서, TypeScript는 CommonJS 모듈 포맷을 이해합니다.
`exports`와 `module.exports` 할당은 export 선언으로 인식됩니다.
마찬가지로, `require` 함수 호출은 모듈 import로 인식됩니다. 예를 들어:

```js
// `import module "fs"`와 같음
const fs = require("fs");

// `export function readFile`과 같음
module.exports.readFile = function(f) {
    return fs.readFileSync(f);
}
```

JavaScript의 모듈 지원은 TypeScript의 모듈 지원보다 구문적으로 훨씬 관용적입니다.
따라서 대부분의 할당과 선언의 조합이 지원됩니다.

## 클래스, 함수, 객체 리터럴은 네임스페이스 (Classes, functions, and object literals are namespaces)

`.js` 파일에 있는 클래스는 네임스페이스입니다.
예를 들어, 다음과 같이 클래스를 중첩하는 데에 사용할 수 있습니다:

```js
class C {
}
C.D = class {
}
```

그리고 ES2015 이전 코드의 경우, 정적 메서드를 나타내는 데에 사용할 수도 있습니다:

```js
function Outer() {
  this.y = 2
}
Outer.Inner = function() {
  this.yy = 2
}
```

또한 간단한 네임스페이스를 생성하는 데에 사용할 수도 있습니다:

```js
var ns = {}
ns.C = class {
}
ns.func = function() {
}
```

다른 번형도 허용됩니다:

```js
// 즉시 호출 함수(IIFE)
var ns = (function (n) {
  return n || {};
})();
ns.CONST = 1

// 전역으로 기본 설정
var assign = assign || function() {
  // 여기엔 코드를
}
assign.extra = 1
```

## 객체 리터럴은 확장 가능 (Object literals are open-ended)

`.ts` 파일에서, 변수 선언을 초기화하는 객체 리터럴은 선언에 해당 타입을 부여합니다.
원본 리터럴에 명시되어 있지 않은 새 멤버는 추가될 수 없습니다.
이 규칙은 `.js` 파일에선 완화됩니다; 객체 리터럴은 원본에 정의되지 않은 새로운 프로퍼티를 조회하고 추가하는 것이 허용되는 확장 가능한 타입(인덱스 시그니처)을 갖습니다.
예를 들어:

```js
var obj = { a: 1 };
obj.b = 2;  // 허용됨
```

객체 리터럴은 마치 닫힌 객체가 아니라 열린 맵(maps)으로 다뤄지도록 `[x:string]: any`와 같은 인덱스 시그니처를 가진 것처럼 동작합니다.

다른 특정 JavaScript 검사 동작과 마찬가지로, 해당 동작은 변수에 JSDoc 타입을 지정하여 변경할 수 있습니다. 예를 들어:

```js
/** @type {{a: number}} */
var obj = { a: 1 };
obj.b = 2;  // 오류, {a: number}타입엔 b 프로퍼티가 없음
```

## null, undefined 및 빈 배열 이니셜라이저는 any 혹은 any[] 타입 (null, undefined, and empty array initializers are of type any or any[])

null 또는 undefined로 초기화된 변수나 매개변수 또는 프로퍼티는, 엄격한 null 검사가 있더라도 any 타입을 갖게 될 것입니다.
[]로 초기화된 변수나 매개변수 또는 프로퍼티는, 엄격한 null 검사가 있더라도 any[] 타입을 갖게 될 것입니다.
위에서 설명한 여러 이니셜라이저(initializer)를 갖는 프로퍼티만이 유일한 예외입니다.

```js
function Foo(i = null) {
    if (!i) i = 1;
    var j = undefined;
    j = 2;
    this.l = [];
}
var foo = new Foo();
foo.l.push(foo.i);
foo.l.push("end");
```

## 함수 매개변수는 기본적으로 선택 사항 (Function parameters are optional by default)

ES2015 이전의 JavaScript는 선택적인 매개변수를 지정할 방법이 없었기 때문에, `.js` 파일에선 모든 함수의 매개변수는 선택적인 것으로 간주됩니다.
선언된 매개변수보다 적은 인수로 호출하는 것이 허용됩니다.

그러나 너무 많은 인수를 넣어 호출하면 오류를 일으킨다는 것에 유의하세요.

예를 들어:

```js
function bar(a, b) {
    console.log(a + " " + b);
}

bar(1);       // 성공, 두 번째 인수는 선택 사항임
bar(1, 2);
bar(1, 2, 3); // 오류, 인수의 갯수가 너무 많음
```

JSDoc 표시가 된 함수는 이 규칙에서 예외입니다.
JSDoc의 선택적 매개변수 구문을 사용하여 선택 사항을 표시할 수 있습니다. 예시:

```js
/**
 * @param {string} [somebody] - 누군가의 이름
 */
function sayHello(somebody) {
    if (!somebody) {
        somebody = 'John Doe';
    }
    console.log('Hello ' + somebody);
}

sayHello();
```

## `arguments` 사용으로부터 추론된 var-args 매개변수 선언 (Var-args parameter declaration inferred from use of `arguments`)

`arguments` 참조를 참조하는 본문을 가진 함수는, 암묵적으로 var-args 매개변수(예: `(...arg: any[]) => any`)를 갖는 것으로 간주합니다. JSDoc의 var-args 구문을 사용하여 인수의 타입을 지정할 수 있습니다.

```js
/** @param {...number} args */
function sum(/* numbers */) {
    var total = 0
    for (var i = 0; i < arguments.length; i++) {
      total += arguments[i]
    }
    return total
}
```

## 타입이 지정되지 않은 매개변수는 기본적으로 `any`임 (Unspecified type parameters default to `any`)

JavaScript에는 제네릭 타입의 매개변수를 지정하는 구문이 없으므로, 타입이 지정되지 않은 매개변수는 기본적으로 `any` 타입입니다.

### 확장 절에서 (In extends clause)

예를 들어, `React.Component`는 `Props`와 `State`라는 두 타입의 매개변수를 갖도록 정의되어 있습니다.
`.js` 파일에는 이러한 것들을 확장 절에 지정할 수 있는 정당한 방법이 없습니다. 기본적으로 해당 타입 인수는 `any`가 될 것입니다:

```js
import { Component } from "react";

class MyComponent extends Component {
    render() {
        this.props.b; // this.props의 타입이 any이므로 허용됨
    }
}
```

타입을 명시적으로 지정하려면 JSDoc의 `@augments`를 사용하세요. 예를 들어:

```js
import { Component } from "react";

/**
 * @augments {Component<{a: number}, State>}
 */
class MyComponent extends Component {
    render() {
        this.props.b; // 오류: b 는 {a:number}에 속하지 않음
    }
}
```

### JSDoc 참조에서 (In JSDoc references)

JSDoc의 지정되지 않은 타입 인수는 기본적으로 any입니다:

```js
/** @type{Array} */
var x = [];

x.push(1);        // 성공
x.push("string"); // 성공, x는 Array<any> 타입임

/** @type{Array.<number>} */
var y = [];

y.push(1);        // 성공
y.push("string"); // 오류, string을 number 타입에 할당할 수 없음

```

### 함수 호출에서 (In function calls)

제네릭 함수의 호출은 인수를 사용해 타입 매개변수를 추론합니다. 때때로 이 과정은 추론 소스가 부족하여 어떠한 타입도 추론하지 못하는 경우가 있습니다; 이러한 경우, 매개변수 타입은 기본적으로 `any`입니다. 예를 들어:

```js
var p = new Promise((resolve, reject) => { reject() });

p; // Promise<any>;
```

# 지원되는 JSDoc (Supported JSDoc)

아래의 구성은 JavaScript 파일에서 JSDoc 주석을 사용하여 타입 정보를 제공할 때 지원되는 목록입니다.

아래에 명시되지 않은 태그(`@async` 등)는 아직 지원되지 않는다는 점에 유의하세요.

* `@type`
* `@param` (또는 `@arg` 또는 `@argument`)
* `@returns` (또는 `@return`)
* `@typedef`
* `@callback`
* `@template`
* `@class` (또는 `@constructor`)
* `@this`
* `@extends` (또는 `@augments`)
* `@enum`

대부분의 태그의 의미는 usejsdoc.org에서 설명하는 태그의 의미와 같습니다.
아래의 코드는 차이점을 설명하고 각 태그의 사용 예시를 설명합니다.

## `@type`

"@type" 태그를 사용하고 타입 이름을 참조(원래 TypeScript의 선언에 정의된 것 또는 JSDoc의 "@typedef" 태그 중 하나)할 수 있습니다.
모든 TypeScript의 타입, 대부분의 JSDoc 타입 중 어떤 것이든 사용할 수 있습니다.

```js
/**
 * @type {string}
 */
var s;

/** @type {Window} */
var win;

/** @type {PromiseLike<string>} */
var promisedString;

// HTML 요소를 DOM 프로퍼티로 지정할 수 있음
/** @type {HTMLElement} */
var myElement = document.querySelector(selector);
element.dataset.myData = '';

```

`@type`은 유니언 타입으로 지정할 수 있습니다; 예를 들어, 문자열과 불리언 중 어떤 것이든 될 수 있습니다.

```js
/**
 * @type {(string | boolean)}
 */
var sb;
```

유니언 타입에는 괄호가 선택 사항이라는 점에 유의하세요.

```js
/**
 * @type {string | boolean}
 */
var sb;
```

다양한 구문을 사용하여 배열 타입을 지정할 수도 있습니다:

```js
/** @type {number[]} */
var ns;
/** @type {Array.<number>} */
var nds;
/** @type {Array<number>} */
var nas;
```

또한 객체 리터럴 타입을 지정할 수도 있습니다.
예를 들어, 프로퍼티 'a' (string) 와 'b' (number)를 갖는 오브젝트라면 다음과 같은 구문을 사용할 수 있습니다.

```js
/** @type {{ a: string, b: number }} */
var var9;
```

표준 JSDoc 구문 또는 TypeScript 구문을 통해 문자열 혹은 숫자 인덱스 시그니처를 사용하여 유사-맵 혹은 유사-배열 오브젝트를 지정할 수도 있습니다.

```js
/**
 * 임의의 `string` 프로퍼티를 `number`에 매핑하는 유사-맵 객체.
 *
 * @type {Object.<string, number>}
 */
var stringToNumber;

/** @type {Object.<number, object>} */
var arrayLike;
```

앞의 두 타입은 TypeScript의 `{ [x: string]: number }` 그리고 `{ [x: number]: any }`와 동일합니다. 컴파일러는 두 구문을 모두 이해할 것입니다.

함수 타입은 TypeScript 또는 클로저 구문을 사용하여 지정할 수 있습니다:

```js
/** @type {function(string, boolean): number} Closure 구문 */
var sbn;
/** @type {(s: string, b: boolean) => number} TypeScript 구문 */
var sbn2;
```

혹은 단순히 지정되지 않은 `Function` 타입을 사용할 수도 있습니다:

```js
/** @type {Function} */
var fn7;
/** @type {function} */
var fn6;
```

Closure의 다른 타입 또한 동작합니다:

```js
/**
 * @type {*} - 어떠한 타입이든 될 수 있음
 */
var star;
/**
 * @type {?} - 식별되지 않은 타입 ('any'와 같음)
 */
var question;
```

### 캐스트 (Casts)

TypeScript는 클로저의 캐스트(cast) 구문을 차용합니다.
이는 괄호화된 표현식 앞에 `@type` 태그를 사용하여 다른 타입으로의 캐스트를 가능케 합니다.

```js
/**
 * @type {number | string}
 */
var numberOrString = Math.random() < 0.5 ? "hello" : 100;
var typeAssertedNumber = /** @type {number} */ (numberOrString)
```

### 타입 import (Import types)

타입 import를 사용하여 다른 파일의 선언을 가져올 수도 있습니다.
이 구문은 TypeScript에 특화된 것이며 JSDoc 표준과는 조금 다릅니다:

```js
/**
 * @param p { import("./a").Pet }
 */
function walk(p) {
    console.log(`Walking ${p.name}...`);
}
```

타입 import는 타입 별칭 선언에서도 쓰일 수 있습니다:

```js
/**
 * @typedef { import("./a").Pet } Pet
 */

/**
 * @type {Pet}
 */
var myPet;
myPet.name;
```

타입을 모르거나 입력하기 귀찮은 큰 타입이 있을 경우, 타입 import를 사용하여 모듈에서 값의 타입을 가져올 수 있습니다:

```js
/**
 * @type {typeof import("./a").x }
 */
var x = require("./a").x;
```

## `@param` and `@returns`

`@param`은 `@type`과 같은 종류의 구문을 사용하지만, 매개변수의 이름이 추가됩니다.
매개변수는 이름을 대괄호로 둘러싸서 선택적으로 선언할 수 있습니다:

```js
// 매개변수는 다양한 형태의 구문으로 선언될 수 있음
/**
 * @param {string}  p1 - 문자열 매개변수.
 * @param {string=} p2 - 선택적 문자열 매개변수 (클로저 구문)
 * @param {string} [p3] - 또다른 선택적 매개변수 (JSDoc 구문).
 * @param {string} [p4="test"] - 기본값을 가진 선택적 매개변수
 * @return {string} 결과
 */
function stringsStringStrings(p1, p2, p3, p4){
  // TODO
}
```

마찬가지로, 함수의 반환 타입으로는:

```js
/**
 * @return {PromiseLike<string>}
 */
function ps(){}

/**
 * @returns {{ a: string, b: number }} - '@returns'과 '@return' 모두 사용 가능
 */
function ab(){}
```

## `@typedef`, `@callback`, and `@param`

`@typedef`를 사용해 복잡한 타입을 정의할 수 있습니다.
`@param`과 비슷한 구문으로 동작합니다.

```js
/**
 * @typedef {Object} SpecialType - 'SpecialType'이라는 새 타입을 생성
 * @property {string} prop1 - SpecialType의 문자열 프로퍼티
 * @property {number} prop2 - SpecialType의 숫자 프로퍼티
 * @property {number=} prop3 - SpecialType의 선택적 숫자 프로퍼티
 * @prop {number} [prop4] - SpecialType의 선택적 숫자 프로퍼티
 * @prop {number} [prop5=42] - SpecialType의 기본값을 가진 선택적 숫자 프로퍼티
 */
/** @type {SpecialType} */
var specialTypeObject;
```

첫 번째 줄에 `object`나 `Object`를 사용할 수 있습니다.

```js
/**
 * @typedef {object} SpecialType1 - 'SpecialType1'이라는 새 타입 생성
 * @property {string} prop1 - SpecialType1의 문자열 프로퍼티
 * @property {number} prop2 - SpecialType1의 숫자 프로퍼티
 * @property {number=} prop3 - SpecialType1의 선택적 숫자 프로퍼티
 */
/** @type {SpecialType1} */
var specialTypeObject1;
```

`@param`은 일회성인 타입 지정에 대한 비슷한 구문을 허용합니다.
중첩된 프로퍼티 이름 앞엔 매개변수 이름을 붙여야 함을 유의하세요:

```js
/**
 * @param {Object} options - 해당 형태는 위의 SpecialType과 동일
 * @param {string} options.prop1
 * @param {number} options.prop2
 * @param {number=} options.prop3
 * @param {number} [options.prop4]
 * @param {number} [options.prop5=42]
 */
function special(options) {
  return (options.prop4 || 1001) + options.prop5;
}
```

`@callback`은 `@typedef`와 비슷합니다만, 객체 타입 대신 함수의 타입을 지정합니다:

```js
/**
 * @callback Predicate
 * @param {string} data
 * @param {number} [index]
 * @returns {boolean}
 */
/** @type {Predicate} */
const ok = s => !(s.length % 2);
```

물론, 이러한 유형 중 어떤 것이라도 단일 라인의 `@typedef` TypeScript 구문을 사용해 선언될 수 있습니다:

```js
/** @typedef {{ prop1: string, prop2: string, prop3?: number }} SpecialType */
/** @typedef {(data: string, index?: number) => boolean} Predicate */
```

## `@template`

`@template` 태그로 제네릭 타입을 선언할 수 있습니다:

```js
/**
 * @template T
 * @param {T} x - 리턴 타입까지 사용되는 제네릭 매개변수
 * @return {T}
 */
function id(x){ return x }
```

콤마 또는 여러 태그를 사용하여 여러 매개변수 타입을 선언할 수 있습니다:

```js
/**
 * @template T,U,V
 * @template W,X
 */
```

타입 매개변수 이름 앞에 타입 제약 조건을 지정할 수도 있습니다.
목록의 첫 번째 매개변수의 타입만 제한됩니다:

```js
/**
 * @template {string} K - K는 문자열 혹은 문자열 리터럴이어야만 함
 * @template {{ serious(): string }} Seriousalizable - serious 메서드를 가져야만 함
 * @param {K} key
 * @param {Seriousalizable} object
 */
function seriousalize(key, object) {
  // ????
}
```

## `@constructor`

컴파일러는 this-프로퍼티 할당을 기반으로 생성자 함수를 추론합니다만, `@constructor` 태그를 추가하여 보다 엄격한 검사와 더 나은 제안이 되도록 만들 수 있습니다.

```js
/**
 * @constructor
 * @param {number} data
 */
function C(data) {
  this.size = 0;
  this.initialize(data); // 이니셜라이저에 문자열이 들어갈 경우, 오류 발생 가능
}
/**
 * @param {string} s
 */
C.prototype.initialize = function (s) {
  this.size = s.length
}

var c = new C(0);
var result = C(1); // C는 새 인스턴스로만 호출해야 함
```

`@constructor`를 사용하면, `this`는 `C`의 생성자 함수 내부에서 검사되므로, `initailize` 메서드에 대하여 알 수 있을 것이며 숫자를 넘길 경우 오류가 발생할 것입니다. 또한 `C`를 생성하지 않고 호출할 경우 오류를 일으킬 것입니다.

불행하게도, 이는 호출 가능한 생성자 함수는 `@constructor`를 사용할 수 없다는 것을 의미합니다.

## `@this`

컴파일러는 대게 작업할 컨텍스트가 있을 때 `this`의 타입을 알아낼 수 있습니다. 그렇지 않은 경우, `@this`를 사용해 `this`의 타입을 명시할 수 있습니다:

```js
/**
 * @this {HTMLElement}
 * @param {*} e
 */
function callbackForLater(e) {
    this.clientHeight = parseInt(e) // 잘 되어야 함!
}
```

## `@extends`

JavaScript 클래스엔 제네릭 기초 클래스를 확장할 때, 매개변수가 어떤 타입이 되어야 하는지 지정할 곳이 없습니다. `@extends` 태그는 해당 매개변수 타입에 대한 위치를 제공합니다:

```js
/**
 * @template T
 * @extends {Set<T>}
 */
class SortableSet extends Set {
  // ...
}
```

`@extends`는 클래스에서만 작동한다는 점을 알아두세요. 현재로서는, 생성자 함수가 클래스를 확장하는 방법은 없습니다.

## `@enum`

`@enum` 태그를 사용하면 해당 멤버가 모두 지정된 타입인 객체 리터럴을 생성할 수 있습니다. 대부분의 JavaScript 객체 리터럴과는 다르게, 다른 멤버는 허용되지 않습니다.

```js
/** @enum {number} */
const JSDocState = {
  BeginningOfLine: 0,
  SawAsterisk: 1,
  SavingComments: 2,
}
```

`@enum`은 TypeScript의 `enum` 과는 꽤 다르며, 훨씬 단순하다는 점에 유의하세요. 그러나 TypeScript의 열거형과는 달리, `@enum`은 어떠한 타입이든 가질 수 있습니다:

```js
/** @enum {function(number): number} */
const Math = {
  add1: n => n + 1,
  id: n => -n,
  sub1: n => n - 1,
}
```

## 다른 예제들 (More examples)

```js
var someObj = {
  /**
   * @param {string} param1 - 프로퍼티 할당에 대한 Docs
   */
  x: function(param1){}
};

/**
 * 변수 할당에 대한 docs처럼
 * @return {Window}
 */
let someFunc = function(){};

/**
 * 클래스 메서드
 * @param {string} greeting 사용할 인사말
 */
Foo.prototype.sayHi = (greeting) => console.log("Hi!");

/**
 * 화살표 함수 표현
 * @param {number} x - A multiplier
 */
let myArrow = x => x * x;

/**
 * JSX의 무상태 함수 컴포넌트에서도 사용됨.
 * @param {{a: string, b: number}} test - Some param
 */
var fc = (test) => <div>{test.a.charAt(0)}</div>;

/**
 * 클로저 구문을 사용하여, 매개변수가 클래스 생성자가 될 수 있음.
 *
 * @param {{new(...args: any[]): object}} C - 등록할 클래스
 */
function registerClass(C) {}

/**
 * @param {...string} p1 - A 'rest' arg (array) of strings. ('any'로 취급됨)
 */
function fn10(p1){}

/**
 * @param {...string} p1 - A 'rest' arg (array) of strings. ('any'로 취급됨)
 */
function fn9(p1) {
  return p1.join();
}
```

## 지원되지 않을 것으로 알려진 패턴들 (Patterns that are known NOT to be supported)

생성자 함수처럼, 값 공간(value space)에 있는 객체를 타입으로 참조하는 것은 객체가 타입을 생성하지 않는 한 작동하지 않습니다.

```js
function aNormalFunction() {

}
/**
 * @type {aNormalFunction}
 */
var wrong;
/**
 * 'typeof' 대신 사용:
 * @type {typeof aNormalFunction}
 */
var right;
```

접미사는 객체 리터럴 유형의 프로퍼티 유형과 동일하며 선택적 프로퍼티를 지정하지 않습니다:

```js
/**
 * @type {{ a: string, b: number= }}
 */
var wrong;
/**
 * 프로퍼티 이름에 물음표 접미사 사용
 * @type {{ a: string, b?: number }}
 */
var right;
```

Nullable 타입은 `strictNullChecks`이 활성화되어있는 때만 의미가 있습니다.

```js
/**
 * @type {?number}
 * With strictNullChecks: true -- number | null
 * With strictNullChecks: off  -- number
 */
var nullable;
```

Nullable이 아닌 타입은 의미가 없으며 원래의 타입으로 취급됩니다:

```js
/**
 * @type {!number}
 * 단순히 숫자 타입을 갖게 됨
 */
var normal;
```

JSDoc의 타입 시스템과는 다르게, TypeScript는 null 값을 포함하는지, 안 하는지에 대해서만 표시할 수 있습니다.
명시적인 non-nullability는 없습니다 -- strictNullChecks이 활성화되어 있다면, `number`는 nullable이 아닐 것입니다.
활성화되어있지 않다면, `number`는 nullable 일 것입니다.
