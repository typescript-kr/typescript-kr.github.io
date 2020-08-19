---
title: JSDoc Reference
layout: docs
permalink: /docs/handbook/jsdoc-supported-types.html
oneline: What JSDoc does TypeScript-powered JavaScript support?
---

아래 목록은 자바스크립트 파일에 타입 정보 제공을 위해 JSDoc 어노테이션을 사용할 때
현재 지원되는 구성의 개요를 다룹니다.

아래 명시적으로 존재하지 않은 태그(예 `@async`)는 아직 지원되지 않습니다.

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

일반적으로 이것들은 [jsdoc.app](https://jsdoc.app)에서 제공하는 태그와 같거나 상위집합을 의미합니다.
아래 코드는 무엇이 다른지 차이점을 설명하고 각 태그의 예시를 제공합니다.

**Note:** 당신은 [playground를 통하여 JSDoc를 볼 수 있습니다](/play?useJavaScript=truee=4#example/jsdoc-support).

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

// You can specify an HTML Element with DOM properties
/** @type {HTMLElement} */
var myElement = document.querySelector(selector);
element.dataset.myData = "";
```

`@type` 을 이용하여 union 타입을 지정할 수 있습니다. 예를 들어 string 혹은 boolean이 선택 가능한 공동체가 있습니다.

```js
/**
 * @type {(string | boolean)}
 */
var sb;
```

괄호는 유니온 타입에 대한 선택 사항입니다.

```js
/**
 * @type {string | boolean}
 */
var sb;
```

다양한 구문을 통하여 배열 타입을 지정할 수 있습니다.

```js
/** @type {number[]} */
var ns;
/** @type {Array.<number>} */
var nds;
/** @type {Array<number>} */
var nas;
```

또한 객체 리터럴 타입들도 지정할 수 있습니다.
예를 들어, 오브젝트에 프로퍼티 'a' (string) and 'b' (number)을 사용한 경우 다음 구문을 사용합니다:

```js
/** @type {{ a: string, b: number }} */
var var9;
```

당신은 JSDoc 구문이나 TypeScript 구문을 사용하여 문자열 및 숫자 인덱스 맵과 배열과 비슷한 오브젝트들을 특정하여 표시할 수 있습니다.

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

앞의 두 구문은 TypeScript의 타입인 `{ [x: string]: number }` 와 `{ [x: number]: any }`를 동일하게 이해합니다. 컴파일러는 이 구문들을 둘 다 이해합니다.

TypeScript나 클로저를 사용하여 함수 유형을 지정할 수 있습니다:

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

`@param`은 타입 구문인 `@type`과 동일하게 사용합니다, 하지만 매개변수의 이름을 추가할 수 있습니다.
매개변수는 이름 주변에 대괄호와 함께 선택적으로 선언됩니다:

```js
// 매개변수들은 다양한 구문형식으로 선언될 수 있습니다
/**
 * @param {string}  p1 - string 매개변수.
 * @param {string=} p2 - 선택적 매개변수 (클로저 구문)
 * @param {string} [p3] - 또다른 선택적 매개변수 (JSDoc 구문).
 * @param {string} [p4="test"] - 기본값과 선택적 매개변수
 * @return {string} 이것은 결과값입니다
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

`@typedef` 는 복잡한 타입을 정의할때 사용합니다.
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

물론, 이런 유형들은 TypeScript 구문 안에서 `@typedef` 단 한 줄로 선언할 수 있습니다:

```js
/** @typedef {{ prop1: string, prop2: string, prop3?: number }} SpecialType */
/** @typedef {(data: string, index?: number) => boolean} Predicate */
```

## `@template`

`@template` 태그를 사용하여 제네릭 함수들을 선언할 수 있습니다:

```js
/**
 * @template T
 * @param {T} x - 제네릭 매개변수는 리턴타입과 같게 됩니다
 * @return {T}
 */
function id(x) {
  return x;
}

const a = id("string");
const b = id(123);
const c = id({});
```

반점 혹은 여러 태그를 통하여 여러 타입의 매개변수를 선언할 수 있습니다:

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
 * @template {string} K - K 는 string 혹은 string 리터럴이어야합니다
 * @template {{ serious(): string }} Seriousalizable - serious 메서드가 있어야합니다
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

    // 만약 다른곳에 선언되어있다면 어노테이션으로 표기할 수 있습니다.
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

다음 섹션에 설명 된 대로 생성자 함수를 선언할 수 있습니다:

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

  // 만약 다른곳에 선언되어있다면 어노테이션으로 표기할 수 있습니다.
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

> Note: 오류 메시지는 오직 JS 기반 코드와 [a JSConfig](/docs/handbook/tsconfig-json.html) 그리고 [`checkJs`](/tsconfig#checkJs) 가 활성화 되어야 합니다.

With `@constructor`, `this` is checked inside the constructor function `C`, so you will get suggestions for the `initialize` method and an error if you pass it a number. Your editor may also show warnings if you call `C` instead of constructing it.

Unfortunately, this means that constructor functions that are also callable cannot use `@constructor`.

## `@this`

The compiler can usually figure out the type of `this` when it has some context to work with. When it doesn't, you can explicitly specify the type of `this` with `@this`:

```js
/**
 * @this {HTMLElement}
 * @param {*} e
 */
function callbackForLater(e) {
  this.clientHeight = parseInt(e); // should be fine!
}
```

## `@extends`

When Javascript classes extend a generic base class, there is nowhere to specify what the type parameter should be. The `@extends` tag provides a place for that type parameter:

```js
/**
 * @template T
 * @extends {Set<T>}
 */
class SortableSet extends Set {
  // ...
}
```

Note that `@extends` only works with classes. Currently, there is no way for a constructor function extend a class.

## `@enum`

The `@enum` tag allows you to create an object literal whose members are all of a specified type. Unlike most object literals in Javascript, it does not allow other members.

```js
/** @enum {number} */
const JSDocState = {
  BeginningOfLine: 0,
  SawAsterisk: 1,
  SavingComments: 2,
};

JSDocState.SawAsterisk;
```

Note that `@enum` is quite different from, and much simpler than, TypeScript's `enum`. However, unlike TypeScript's enums, `@enum` can have any type:

```js
/** @enum {function(number): number} */
const MathFuncs = {
  add1: (n) => n + 1,
  id: (n) => -n,
  sub1: (n) => n - 1,
};

MathFuncs.add1;
```

## More examples

```js
class Foo {}
// ---cut---
var someObj = {
  /**
   * @param {string} param1 - Docs on property assignments work
   */
  x: function (param1) {},
};

/**
 * As do docs on variable assignments
 * @return {Window}
 */
let someFunc = function () {};

/**
 * And class methods
 * @param {string} greeting The greeting to use
 */
Foo.prototype.sayHi = (greeting) => console.log("Hi!");

/**
 * And arrow functions expressions
 * @param {number} x - A multiplier
 */
let myArrow = (x) => x * x;

/**
 * Which means it works for stateless function components in JSX too
 * @param {{a: string, b: number}} test - Some param
 */
var sfc = (test) => <div>{test.a.charAt(0)}</div>;

/**
 * A parameter can be a class constructor, using Closure syntax.
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

## Patterns that are known NOT to be supported

Referring to objects in the value space as types doesn't work unless the object also creates a type, like a constructor function.

```js
function aNormalFunction() {}
/**
 * @type {aNormalFunction}
 */
var wrong;
/**
 * Use 'typeof' instead:
 * @type {typeof aNormalFunction}
 */
var right;
```

Postfix equals on a property type in an object literal type doesn't specify an optional property:

```js
/**
 * @type {{ a: string, b: number= }}
 */
var wrong;
/**
 * Use postfix question on the property name instead:
 * @type {{ a: string, b?: number }}
 */
var right;
```

Nullable types only have meaning if `strictNullChecks` is on:

```js
/**
 * @type {?number}
 * With strictNullChecks: true  -- number | null
 * With strictNullChecks: false -- number
 */
var nullable;
```

You can also use a union type:

```js
/**
 * @type {number | null}
 * With strictNullChecks: true  -- number | null
 * With strictNullChecks: false -- number
 */
var unionNullable;
```

Non-nullable types have no meaning and are treated just as their original type:

```js
/**
 * @type {!number}
 * Just has type number
 */
var normal;
```

Unlike JSDoc's type system, TypeScript only allows you to mark types as containing null or not.
There is no explicit non-nullability -- if strictNullChecks is on, then `number` is not nullable.
If it is off, then `number` is nullable.

### Unsupported tags

TypeScript ignores any unsupported JSDoc tags.

The following tags have open issues to support them:

* `@const` ([issue #19672](https://github.com/Microsoft/TypeScript/issues/19672))
* `@inheritdoc` ([issue #23215](https://github.com/Microsoft/TypeScript/issues/23215))
* `@memberof` ([issue #7237](https://github.com/Microsoft/TypeScript/issues/7237))
* `@readonly` ([issue #17233](https://github.com/Microsoft/TypeScript/issues/17233))
* `@yields` ([issue #23857](https://github.com/Microsoft/TypeScript/issues/23857))
* `{@link …}` ([issue #16498](https://github.com/Microsoft/TypeScript/issues/16498))
