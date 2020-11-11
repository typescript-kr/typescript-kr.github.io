---
title: JSDoc Reference
layout: docs
permalink: /docs/handbook/jsdoc-supported-types.html
oneline: What JSDoc does TypeScript-powered JavaScript support?
---

아래 목록은 JavaScript 파일에 타입 정보 제공을 위해 JSDoc 어노테이션을 사용할 때
현재 지원되는 구성의 개요를 다룹니다.

아래 명시적으로 나열되지 않은 태그(예 `@async`)는 아직 지원되지 않습니다.

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

의미는 일반적으로 [jsdoc.app](https://jsdoc.app)에서 제공하는 태그의 의미와 같거나 상위 집합입니다.
아래 코드는 각 태그의 차이점을 설명하고 예시를 제공합니다.

**Note:** [JSDoc 지원을 탐색하는 playground](/play?useJavaScript=truee=4#example/jsdoc-support)를 사용할 수 있습니다.

## `@type`

"@type" 태그를 사용하여 타입의 이름을 참조할 수 있습니다 (다음 경우 중 하나인 원시 타입과 TypeScript에 정의되어있거나 JSDoc "@typedef" 태그로 정의되어있거나).
당신은 대부분 JSDoc 타입들이나 TypeScript 타입을 사용할 것입니다,[기존에 많이 사용하는 `string`](/docs/handbook/basic-types.html)부터 [조건부 타입인 고급 타입](/docs/handbook/advanced-types.html)까지.

```js
/**
 * @type {string}
 */
var s;

/** @type {Window} */
var win;

/** @type {PromiseLike<string>} */
var promisedString;

// DOM 프로퍼티를 사용하여 HTML 요소를 지정할 수 있습니다
/** @type {HTMLElement} */
var myElement = document.querySelector(selector);
element.dataset.myData = "";
```

`@type` 을 이용하여 유니언 타입을 지정할 수 있습니다. 예를 들어 어떤 것은 string 또는 boolean 일 수 있습니다.

```js
/**
 * @type {(string | boolean)}
 */
var sb;
```

괄호는 유니언 타입에 대한 선택 사항입니다.

```js
/**
 * @type {string | boolean}
 */
var sb;
```

다양한 구문을 통하여 배열 타입을 지정할 수 있습니다:

```js
/** @type {number[]} */
var ns;
/** @type {Array.<number>} */
var nds;
/** @type {Array<number>} */
var nas;
```

또한 객체 리터럴 타입들도 지정할 수 있습니다.
예를 들어, 오브젝트에 프로퍼티 'a' (string) 와 'b' (number)을 사용한 경우 다음 구문을 사용합니다:

```js
/** @type {{ a: string, b: number }} */
var var9;
```

당신은 JSDoc 구문이나 TypeScript 구문을 사용하여 문자열 및 숫자 인덱스 맵과 배열과 비슷한 오브젝트를 표시할 수 있습니다.

```js
/**
 * 맵 같은 object는 임의의 `string` 프로퍼티들을 `number`로 바꿔줍니다.
 *
 * @type {Object.<string, number>}
 */
var stringToNumber;

/** @type {Object.<number, object>} */
var arrayLike;
```

앞의 두 타입은 TypeScript의 타입인 `{ [x: string]: number }` 와 `{ [x: number]: any }`를 동일합니다. 컴파일러는 이 두 구문을 모두 이해합니다.

TypeScript나 클로저 구문을 사용하여 함수 타입을 지정할 수 있습니다:

```js
/** @type {function(string, boolean): number} 클로저 구문 */
var sbn;
/** @type {(s: string, b: boolean) => number} TypeScript 구문 */
var sbn2;
```

혹은 특정하지 않은 `Function` 타입을 사용할 수 있습니다:

```js
/** @type {Function} */
var fn7;
/** @type {function} */
var fn6;
```

클로저의 다른 타입들 또한 작동합니다:

```js
/**
 * @type {*} - 'any' 타입으로 쓸 수 있습니다
 */
var star;
/**
 * @type {?} - 알 수 없는 타입 ('any'와 같습니다)
 */
var question;
```

### 형변환 (Casts)

TypeScript는 클로저 구문을 차용합니다.
이렇게 하면 괄호로 묶인 표현식 앞에 `@type` 태그를 추가하여 다른 유형으로 형변환할 수 있습니다.

```js
/**
 * @type {number | string}
 */
var numberOrString = Math.random() < 0.5 ? "hello" : 100;
var typeAssertedNumber = /** @type {number} */ (numberOrString);
```

### 타입 가져오기 (Import types)

다른 파일에서 사용하고 있는 타입들은 import 선언을 통하여 가져올 수 있습니다.
이 구문은 TypeScript에 따라 다르며 JSDoc 표준과 다릅니다:

```js
// @filename: types.d.ts
export type Pet = {
  name: string,
};

// @filename: main.js
/**
 * @param p { import("./types").Pet }
 */
function walk(p) {
  console.log(`Walking ${p.name}...`);
}
```

가져온 타입들 또한 별칭 선언에서 사용할 수 있습니다:

```js
// @filename: types.d.ts
export type Pet = {
  name: string,
};
// @filename: main.js
// ---cut---
/**
 * @typedef { import("./types").Pet } Pet
 */

/**
 * @type {Pet}
 */
var myPet;
myPet.name;
```

만약 알 수 없는 타입이거나 너무 큰 타입일 경우 모듈에서 얻어온 값의 타입을 사용할 수 있습니다:

```js
// @filename: accounts.d.ts
export const userAccount = {
  name: "Name",
  address: "An address",
  postalCode: "",
  country: "",
  planet: "",
  system: "",
  galaxy: "",
  universe: "",
};
// @filename: main.js
// ---cut---
/**
 * @type {typeof import("./accounts").userAccount }
 */
var x = require("./accounts").userAccount;
```

## `@param` 과 `@returns`

`@param`은 타입 구문인 `@type`과 동일하게 사용합니다, 하지만 매개변수 이름을 추가할 수 있습니다.
매개변수는 이름 주변에 대괄호와 함께 선택적으로 선언됩니다:

```js
// 매개변수들은 다양한 구문형식으로 선언될 수 있습니다
/**
 * @param {string}  p1 - string 매개변수.
 * @param {string=} p2 - 선택적 매개변수 (클로저 구문)
 * @param {string} [p3] - 또다른 선택적 매개변수 (JSDoc 구문).
 * @param {string} [p4="test"] - 기본값과 선택적 매개변수
 * @return {string} 이것은 결과 값입니다
 */
function stringsStringStrings(p1, p2, p3, p4) {
  // TODO
}
```

마찬가지로, 함수의 반환형일 경우:

```js
/**
 * @return {PromiseLike<string>}
 */
function ps() {}

/**
 * @returns {{ a: string, b: number }} - May use '@returns' as well as '@return'
 */
function ab() {}
```

## `@typedef`, `@callback`, and `@param`

`@typedef` 는 복잡한 타입을 정의할 때 사용합니다.
마치 `@param`과 비슷하게 동작합니다.

```js
/**
 * @typedef {Object} SpecialType - 새로운 타입인 'SpecialType'을 생성합니다
 * @property {string} prop1 - SpecialType의 string 프로퍼티
 * @property {number} prop2 - SpecialType의 number 프로퍼티
 * @property {number=} prop3 - SpecialType의 선택적 number 프로퍼티
 * @prop {number} [prop4] - SpecialType의 선택적 number 프로퍼티
 * @prop {number} [prop5=42] - SpecialType의 기본값이 존재하는 선택적 number 프로퍼티
 */

/** @type {SpecialType} */
var specialTypeObject;
specialTypeObject.prop3;
```

`object` 혹은 `Object`를 첫 번째 줄에 사용할 수 있습니다.

```js
/**
 * @typedef {object} SpecialType1 - 새로운 타입인 'SpecialType'을 생성합니다
 * @property {string} prop1 - SpecialType의 string 프로퍼티
 * @property {number} prop2 - SpecialType의 number 프로퍼티
 * @property {number=} prop3 - SpecialType의 선택적 number 프로퍼티
 */

/** @type {SpecialType1} */
var specialTypeObject1;
```

`@param` 은 한 번만 사용하는 타입과 비슷한 구문을 허용합니다.
포함된 프로퍼티의 이름은 파라미터의 이름을 접두사로 사용해야 합니다:

```js
/**
 * @param {Object} options - 위의 SpecialType와 비슷합니다.
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

`@callback`은 `@typedef`와 비슷합니다. 하지만 이것은 object 타입 대신 특정한 function 타입을 지정합니다:

```js
/**
 * @callback Predicate
 * @param {string} data
 * @param {number} [index]
 * @returns {boolean}
 */

/** @type {Predicate} */
const ok = (s) => !(s.length % 2);
```

물론, 이런 타입들은 TypeScript 구문에서 `@typedef` 단 한 줄로 선언할 수 있습니다:

```js
/** @typedef {{ prop1: string, prop2: string, prop3?: number }} SpecialType */
/** @typedef {(data: string, index?: number) => boolean} Predicate */
```

## `@template`

`@template` 태그를 사용하여 제네릭 함수를 선언할 수 있습니다:

```js
/**
 * @template T
 * @param {T} x - 제네릭 매개변수는 리턴 타입과 같게 됩니다
 * @return {T}
 */
function id(x) {
  return x;
}

const a = id("string");
const b = id(123);
const c = id({});
```

콤마 혹은 여러 태그를 통하여 여러 타입의 매개변수를 선언할 수 있습니다:

```js
/**
 * @template T,U,V
 * @template W,X
 */
```

또한 특정한 매개변수 앞에 타입을 지정할 수 있습니다.
매개변수 중 오직 첫 번째 매개변수만 제한됩니다:

```js
/**
 * @template {string} K - K는 string 혹은 string 리터럴이어야 합니다
 * @template {{ serious(): string }} Seriousalizable - serious 메서드가 있어야 합니다
 * @param {K} key
 * @param {Seriousalizable} object
 */
function seriousalize(key, object) {
  // ????
}
```

제네릭 클래스 혹은 타입 선언은 지원되지 않습니다.

## 클래스 (Classes)

클래스는 ES6 클래스로 선언할 수 있습니다.

```js
class C {
  /**
   * @param {number} data
   */
  constructor(data) {
    // 프로퍼티 타입은 추론될 수 있습니다
    this.name = "foo";

    // 또는 명시적으로 선언할 수도 있습니다
    /** @type {string | null} */
    this.title = null;

    // 만약 다른 곳에 선언되어 있다면 어노테이션으로 표기할 수 있습니다.
    /** @type {number} */
    this.size;

    this.initialize(data); // 오류가 난다면, 이니셜 라이저는 string을 예상합니다
  }
  /**
   * @param {string} s
   */
  initialize = function (s) {
    this.size = s.length;
  };
}

var c = new C(0);

// C는 new 와 함께 호출되어야합니다
// 하지만 이건 JavaScript이고, 이것은 허용되며
// 'any'로 간주됩니다.
var result = C(1);
```

다음 섹션에 설명된 대로 생성자 함수를 선언할 수 있습니다:

## `@constructor`

컴파일러는 속성 할당을 기반으로 생성자 함수를 추론합니다, 하지만 `@constructor` 태그를 사용하면 더 엄격한 검사와 제안 사항을 확인할 수 있습니다:

```js
// @checkJs
// @errors: 2345 2348
/**
 * @constructor
 * @param {number} data
 */
function C(data) {
  // 프로퍼티 타입은 추론될 수 있습니다
  this.name = "foo";

  // 또는 명시적으로 선언할 수도 있습니다
  /** @type {string | null} */
  this.title = null;

  // 만약 다른 곳에 선언되어 있다면 어노테이션으로 표기할 수 있습니다.
  /** @type {number} */
  this.size;

  this.initialize(data);
}
/**
 * @param {string} s
 */
C.prototype.initialize = function (s) {
  this.size = s.length;
};

var c = new C(0);
c.size;

var result = C(1);
```

> Note: 오류 메시지는 [a JSConfig](/docs/handbook/tsconfig-json.html) 및 [`checkJs`](/tsconfig#checkJs)가 활성화된 상태에서만 JS 코드 베이스에 나타납니다.

`@constructor`를 사용하면 생성자 함수 `C`안에 `this`가 있는지 검사하므로, `initialize` 메서드에 대한 제안사항을 받으며 만약 인자로 숫자를 넘긴다면 오류가 발생합니다. 또한 `C`를 생성하지 않고 호출만 한다면 에디터에서 경고를 표시할 수 있습니다.

유감스럽게도, 이는 호출가능한 생성자 함수는 `@constructor`를 사용하지 못함을 의미합니다.

## `@this`

컴파일러는 코드가 동작할 컨텍스트가 있다면 보통 `this`의 타입을 파악할 수 있습니다. 그렇지 않은 경우, `@this`를 사용하여 명확하게 `this`의 타입을 지정할 수 있습니다:

```js
/**
 * @this {HTMLElement}
 * @param {*} e
 */
function callbackForLater(e) {
  this.clientHeight = parseInt(e); // 잘 작동해야 합니다!
}
```

## `@extends`

Javascript 클래스를 제네릭 기반 클래스로부터 상속(extend)하면, 매개변수가 어떤 타입이 되어야 하는지 지정할 곳이 없습니다. `@extends` 태그는 이러한 타입 매개변수를 위한 위치를 제공합니다:

```js
/**
 * @template T
 * @extends {Set<T>}
 */
class SortableSet extends Set {
  // ...
}
```

`@extends`는 클래스에서만 작동합니다. 현재까지, 생성자 함수가 클래스를 상속할 수 있는 방법은 없습니다.

## `@enum`

`@enum` 태그는 멤버가 모두 지정된 객체 리터럴을 만들 수 있게 도와줍니다. Javascript 대부분의 객체 리터럴과 달리, 이 태그는 다른 멤버를 허용하지 않습니다.

```js
/** @enum {number} */
const JSDocState = {
  BeginningOfLine: 0,
  SawAsterisk: 1,
  SavingComments: 2,
};

JSDocState.SawAsterisk;
```

`@enum`은 TypeScript의 `enum`과 상당히 다르고, 더 간단합니다. 하지만 TypeScript의 열거형(enum)과 달리, `@enum`은 어떠한 타입도 가질 수 있습니다:

```js
/** @enum {function(number): number} */
const MathFuncs = {
  add1: (n) => n + 1,
  id: (n) => -n,
  sub1: (n) => n - 1,
};

MathFuncs.add1;
```

## 추가 예제 (More examples)

```js
class Foo {}
// ---cut---
var someObj = {
  /**
   * @param {string} param1 - 프로퍼티 할당 문서를 참조하세요
   */
  x: function (param1) {},
};

/**
 * 변수 할당 문서를 참조하세요
 * @return {Window}
 */
let someFunc = function () {};

/**
 * 클래스 메서드
 * @param {string} greeting 사용할 인사말
 */
Foo.prototype.sayHi = (greeting) => console.log("Hi!");

/**
 * 화살표 함수 표현식
 * @param {number} x - 곱하는 수
 */
let myArrow = (x) => x * x;

/**
 * JSX의 무상태 함수형 컴포넌트(SFC)에도 작동합니다
 * @param {{a: string, b: number}} test - Some param
 */
var sfc = (test) => <div>{test.a.charAt(0)}</div>;

/**
 * 매개변수는 클로저 구문을 사용하면 클래스 생성자로 사용할 수 있습니다.
 *
 * @param {{new(...args: any[]): object}} C - The class to register
 */
function registerClass(C) {}

/**
 * @param {...string} p1 - A 'rest' arg (array) of strings. (treated as 'any')
 */
function fn10(p1) {}

/**
 * @param {...string} p1 - A 'rest' arg (array) of strings. (treated as 'any')
 */
function fn9(p1) {
  return p1.join();
}
```

## 지원하지 않는다고 알려진 패턴 (Patterns that are known NOT to be supported)

Value space 안의 객체를 타입으로 태그하는 것은 객체가 마치 생성자 함수처럼 타입을 생성하지 않는 이상 작동하지 않습니다.

```js
function aNormalFunction() {}
/**
 * @type {aNormalFunction}
 */
var wrong;
/**
 * 'typeof'를 대신 사용하세요:
 * @type {typeof aNormalFunction}
 */
var right;
```

접미사(Postfix)는 선택적(Optional) 프로퍼티를 구체화하지 않는 객체 리터럴 타입의 프로퍼티 타입과 같습니다:

```js
/**
 * @type {{ a: string, b: number= }}
 */
var wrong;
/**
 * 프로퍼티 이름 대신 물음표 접미사를 사용하세요:
 * @type {{ a: string, b?: number }}
 */
var right;
```

`strictNullCheck`가 활성화 중인 경우에만 널러블(Nullable) 타입이 의미가 있습니다.

```js
/**
 * @type {?number}
 * With strictNullChecks: true  -- number | null
 * With strictNullChecks: false -- number
 */
var nullable;
```

유니언 타입을 사용해도 됩니다:

```js
/**
 * @type {number | null}
 * With strictNullChecks: true  -- number | null
 * With strictNullChecks: false -- number
 */
var unionNullable;
```

널러블 타입이 아닌 경우에는 아무 의미가 없으며 원래 타입으로 취급합니다:

```js
/**
 * @type {!number}
 * 타입 number를 가집니다
 */
var normal;
```

JSDoc의 타입 체계와 달리, TypeScript는 타입이 오직 null을 포함하거나 하지 않는다 표시할 수 있습니다.
널러블은 명확하게 구분되지 않습니다 -- 만약 strictNullChecks가 활성화 중이라면, `number`는 널러블하지 않습니다.
반대의 경우, `number`는 널러블합니다.

### 지원하지 않는 태그 (Unsupported tags)

TypeScript는 지원하지 않는 JSDoc 태그를 무시합니다.

태그 지원을 위한 오픈 이슈가 아래에 있습니다:

* `@const` ([issue #19672](https://github.com/Microsoft/TypeScript/issues/19672))
* `@inheritdoc` ([issue #23215](https://github.com/Microsoft/TypeScript/issues/23215))
* `@memberof` ([issue #7237](https://github.com/Microsoft/TypeScript/issues/7237))
* `@readonly` ([issue #17233](https://github.com/Microsoft/TypeScript/issues/17233))
* `@yields` ([issue #23857](https://github.com/Microsoft/TypeScript/issues/23857))
* `{@link …}` ([issue #16498](https://github.com/Microsoft/TypeScript/issues/16498))
