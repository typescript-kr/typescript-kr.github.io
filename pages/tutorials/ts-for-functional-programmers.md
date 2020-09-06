---
title: TypeScript for Functional Programmers
layout: docs
permalink: /docs/handbook/typescript-in-5-minutes-func.html
oneline: Learn TypeScript if you have a background in functional programming
---

TypeScript는 웹에 전통적인 객체 지향 프로그램를 가져오기 위해서
마이크로소프트 프로그래머들이 JavaScript에 전통적인 객체 지향 타입을
가져오기 위한 시도로 시작되었습니다. 개발되어 가면서 TypeScript의
타입 시스템은 네이티브 자바스크립터가 작성한 모델 코드로 발전되었습니다.
결과적인 시스템은 강력하면서 흥미롭고 지저분합니다.

이 소개는 TypeScript를 배우고자 하는 Haskell 또는 ML 프로그래머를
위해 만들어졌습니다. Haskell 타입 시스템과 TypeScript 타입 시스템의
차이를 설명합니다.
또한 JavaScript 코드의 모델링에서 발생하는 TypeScript 타입 시스템의
독특한 특징을 설명합니다.

이 소개에서는 객체 지향 프로그래밍을 다루지 않습니다.
실제로, TypeScript의 객체 지향 프로그램은 OO 기능이 있는 다른 인기 언어의
프로그램과 유사합니다.

# 전제조건 (Prerequisites)

본 서론에서는 다음 사항을 알고 있다고 가정합니다:

* JavaScript로 프로그래밍 하기 위한 핵심 개념.
* C 계열 언어의 타입 구문.

JavaScript의 핵심 개념을 배우고 싶다면
[JavaScript: The Good Parts](http://shop.oreilly.com/product/9780596517748.do)를 추천합니다.
많은 가변성을 가진 call-by-value 렉시컬한 스코프 언어로
프로그램을 작성하는 방법을 알고 있다면 굳이 책을 안 읽어도
상관없습니다.
[R<sup>4</sup>RS Scheme](https://people.csail.mit.edu/jaffer/r4rs.pdf)가 좋은 예입니다.

[C++ 프로그래밍 언어](http://www.stroustrup.com/4th.html)는
C-스타일 타입 구문에 대해서 배우기 좋습니다.
C++ 달리 TypeScript는 후위 타입을 사용합니다, 예를 들면: `string x` 대신에 `x: string`.

# Haskell에는 없는 개념 (Concepts not in Haskell)

## 내장 타입 (Built-in types)

JavaScript에서는 7개의 내장 타입을 정의합니다:

| 타입         | 설명                                         |
| ----------- | ------------------------------------------- |
| `Number`    | 배정밀도 IEEE 754 부동소수점.                    |
| `String`    | 수정 불가능한 UTF-16 문자열.                     |
| `Boolean`   | `true` 와  `false`.                          |
| `Symbol`    | 보통 키로 사용하는 고유한 값.                       |
| `Null`      | 단위 타입과 동등.                               |
| `Undefined` | 또한 단위 타입과 동등.                           |
| `Object`    | 레코드와 유사한 것.                             |

[자세한 내용은 MDN 페이지를 참고하세요](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures).

TypeScript에는 기본 내장된 타입에 해당하는 원시 타입이 있습니다:

* `number`
* `string`
* `boolean`
* `symbol`
* `null`
* `undefined`
* `object`

### 다른 중요한 TypeScript 타입 (Other important TypeScript types)

| 타입            | 설명                                                         |
| -------------- | ----------------------------------------------------------- |
| `unknown`      | 최상위 타입.                                                   |
| `never`        | 하위 타입.                                                     |
| 객체 리터럴       | 예, `{ property: Type }`                                     |
| `void`         | 리턴 타입으로 사용하기 위해 의도된 `undefined` 의 서브타입.             |
| `T[]`          | 수정가능한 배열들, 또한 `Array<T>` 으로 사용가능                      |
| `[T, T]`       | 고정된 길이지만 수정 가능한 튜플                                     |
| `(t: T) => U`  | 함수                                                          |

유의하세요:

1. 함수 구문에는 매개변수 이름이 포함되어 있습니다. 익숙해지기 꽤 어렵습니다!

   ```ts
   let fst: (a: any, d: any) => any = (a, d) => a;
   // 또는 좀 더 정확하게 말하자면:
   let snd: <T, U>(a: T, d: U) => U = (a, d) => d;
   ```

2. 객체 리터럴 타입 구문이 객체 리터럴 값 구문과 꽤 유사합니다:

   ```ts
   let o: { n: number; xs: object[] } = { n: 1, xs: [] };
   ```

3. `[T, T]` 는 `T[]` 의 서브타입입니다. Haskell과 달리, 튜플은 리스트와 관련이 없습니다.

### 박스 형태 타입 (Boxed types)

JavaScript는 프로그래머들이 해당 타입에 접근할 수 있는 메서드를
포함하는 원시타입을 동등하게 박스해 왔습니다. 예를 들면, 원시 형태의
`number` 과 박스 형태 타입의 `Number`의 다른 점을 TypeScript는
반영해왔습니다.
박스 형태 타입은 메서드가 원시 타입을 반환할 때 아주 드물게 필요합니다.

```ts
(1).toExponential();
// 동등하게
Number.prototype.toExponential.call(1);
```

숫자 리터럴에서 메서드를 호출하려면 파서를 지원하기 위해 메서드를 괄호
안에 넣어야 한다는 점에 유의하십시오.

## 점진적인 타이핑 (Gradual typing)

TypeScript는 표현식의 타입을 알 수 없을 때마다 `any` 타입을
사용합니다. `Dynamic`와 비교하면,`any` 는 타입이라고 부르기에
과하다고 할 수도 있습니다.
이 타입이 나타날 때마다 타입을 체크하지 않습니다. 예를 들어, `any[]`
에 어떤 값이든 체크하지 않고 넣어도 상관없습니다:

```ts
// tsconfig.json 파일에 "noImplicitAny": false 를 삽입, anys: any[]
const anys = [];
anys.push(1);
anys.push("oh no");
anys.push({ anything: "goes" });
```

그리고 `any` 타입은 어디서든 간에 사용가능합니다:

```ts
anys.map(anys[1]); // 오 안되죠, "oh no" 함수가 아닙니다.
```

`any` 전염될 수 있는데, 역시 &mdash; 만약에 `any` 타입의 표현식과 함께 변수를 초기화하면,
변수 역시 `any` 타입을 가집니다.

```ts
let sepsis = anys[0] + anys[1]; // 어떤 의미로도 가능합니다.
```

TypeScript는 `any`를 제공할 때 에러가 발생되면,
`tsconfig.json`에서 `"noImplicitAny": true` 또는 `"strict": true`를 설정해야 합니다.

## 구조적인 타이핑 (Structural typing)

비록 하스켈과 대부분의 ML은 구조적으로 타이핑하지 않지만,
구조적 타이핑은 대부분의 함수형 프로그래머에게는 익숙한 개념입니다.
기본 형태는 아주 간단합니다:

```ts
// @strict: false
let o = { x: "hi", extra: 1 }; // 성공
let o2: { x: string } = o; // 성공
```

여기서, 객체 리터럴 `{ x: "hi", extra : 1 }`에 매치되는
`{ x : string, extra : number }` 가 있습니다. 이
타입은 필수 프로퍼티가 모두 있고 해당 프로퍼티에 할당 가능한 타입이 있으므로
`{ x : string }` 에 할당할 수 있습니다.
나머지 프로퍼티는 할당을 막지 않고, `{x : string}`의 서브타입으로
만듭니다.

네임드 타입들은 타입에서 이름을 붙일 뿐입니다. 할당을 위해서라면 타입 별칭
 `One` 과 인터페이스 타입 `Two` 사이에는 별 다른 점이 없습니다.
둘 다 `p: string` 프로퍼티를 가지고 있습니다.
(단, 타입 별칭은 재귀 정의와 타입 매개변수에 관련한 인터페이스에서는 다르게
동작합니다.)

```ts
// @errors: 2322
type One = { p: string };
interface Two {
  p: string;
}
class Three {
  p = "Hello";
}

let x: One = { p: "hi" };
let two: Two = x;
two = new Three();
```

## 유니언 (Unions)

TypeScript에서 유니언 타입은 태그되지 않습니다. 다르게 말하면,
하스켈에서 `data` 와 달리 유니언은 구별하지 않습니다.
그러나 다른 프로퍼티나 내장된 태그를 사용하는 유니언으로 타입을 구별할 수 있습니다.

```ts
function start(
  arg: string | string[] | (() => string) | { s: string }
): string {
  // JavaScript에서 아주 일반적입니다
  if (typeof arg === "string") {
    return commonCase(arg);
  } else if (Array.isArray(arg)) {
    return arg.map(commonCase).join(",");
  } else if (typeof arg === "function") {
    return commonCase(arg());
  } else {
    return commonCase(arg.s);
  }

  function commonCase(s: string): string {
    // 마지막으로, 다른 문자열로 변환합니다
    return s;
  }
}
```

`string`, `Array` 와 `Function` 은  타입 조건자가
내장되어 있고, `else` 브랜치를 위한 객체 타입은 편의를 위해
남겨두는 게 좋습니다.
그러나 런타임에 구별하기 어려운 유니언을 생성할 수 있습니다.
새로운 코드의 경우, 구별하는 유니언만 구축하는 게 가장 좋습니다.

다음 타입들은 조건자를 가지고 있다:

| 타입       | 조건자                               |
| --------- | ---------------------------------- |
| string    | `typeof s === "string"`            |
| number    | `typeof n === "number"`            |
| bigint    | `typeof m === "bigint"`            |
| boolean   | `typeof b === "boolean"`           |
| symbol    | `typeof g === "symbol"`            |
| undefined | `typeof undefined === "undefined"` |
| function  | `typeof f === "function"`          |
| array     | `Array.isArray(a)`                 |
| object    | `typeof o === "object"`            |

함수와 배열은 런타임에서 객체이지만 고유의 조건자를 가지고 있다는 걸
기록합시다.

### 교집합

유니언과 더불어 TypeScript은 교집합까지 가지고 있습니다:

```ts
type Combined = { a: number } & { b: string };
type Conflicting = { a: number } & { a: string };
```

`Combined` 은 마치 하나의 객체 리터럴 타입으로 작성된 것 처럼
`a` 와 `b` 두 개의 속성을 가지고 있습니다. 교집합과 유니언은 재귀적인
케이스에서 충돌을 일으켜서 `Conflicting.a: number & string` 입니다.

## 유니언 타입 (Unit types)

유니언 타입은 정확히 하나의 원시 값을 포함하고 있는 원시 타입의 서브타입입니다.
예를 들면, 문자열 `"foo"` 는 타입 `"foo"`를 가지고 있습니다.
JavaScript는 내장된 enum이 없기 때문에 잘 알려진 문자열 세트를
대신해서 쓰는게 흔합니다.
문자열 리터럴 타입 유니언은 TypeScript에서 이 패턴을 따라갑니다:

```ts
declare function pad(s: string, n: number, direction: "left" | "right"): string;
pad("hi", 10, "left");
```

필요한 경우에 컴파일러로 확장가능합니다_ &mdash; 상위 타입으로
변환합니다 &mdash; 원시 타입에서 유닛 타입으로, `string`에서 `"foo"`으로
수정가능할 때 일어나며, 수정가능한 변수를 일부 사용할 때 제대로
동작하지 않을 수 있습니다:

```ts
// @errors: 2345
declare function pad(s: string, n: number, direction: "left" | "right"): string;
// ---cut---
let s = "right";
pad("hi", 10, s); // 오류: 'string'은 '"left" | "right"'에 할당할 수 없습니다.
```

이런 에러가 나타날 수 있습니다:

*-* `"right": "right"`
*-* `s: string` 은 `"right"` 가 수정가능한 변수에 할당될 때 `string` 으로 확장이 가능합니다.
*-* `string` 은 `"left" | "right"`에 할당할 수 없습니다.

`s`에 타입 표기를 사용하여 해결 가능하지만,
그 결과 `"left" | "right"` 타입이 아닌 변수가
`s`에 할당되는 것을 방지하게 됩니다.

```ts
declare function pad(s: string, n: number, direction: "left" | "right"): string;
// ---cut---
let s: "left" | "right" = "right";
pad("hi", 10, s);
```

# Haskell과 비슷한 개념 (Concepts similar to Haskell)

## 문맥적인 타이핑 (Contextual typing)

TypeScript는 변수 선언과 같이 타입을 추론할 수 있는
몇 가지 분명한 방법이 있습니다:

```ts
let s = "I'm a string!";
```

하지만 다른 C-계열 언어로 작업한 적이 있다면 예상하지 못했던
다른 방법으로 타입 추론이 가능합니다:

```ts
declare function map<T, U>(f: (t: T) => U, ts: T[]): U[];
let sns = map((n) => n.toString(), [1, 2, 3]);
```

여기에서, 이 예시의 `n: number`에서 또한, `T` 과 `U`는 호출 전에
추론되지 않았음에도 불구하고.
실제로 `[1,2,3]` 으로 `T=number`을 추론한 다음에,
`n => n.toString()`의 리턴 타입으로 `U=string`을 추론하여,
`sns`가 `string[]` 타입을 가지도록 합니다.

추론은 어떤 순서로든 작동하지만, intellisense는 왼쪽에서 오른쪽으로만
작동하므로, TypeScript는 배열과 함께 `map`을 먼저 선언하는 것을
선호합니다:

```ts
declare function map<T, U>(ts: T[], f: (t: T) => U): U[];
```

문맥적인 타이핑은 또한 객체 리터럴을 통해 재귀적으로 작동하며, 그렇지 않으면
`string`이나 `number`로 추론 가능한 유닛 타입으로 작동합니다.
그리고 문맥을 통해서 리턴 타입을 추론할 수 있습니다:

```ts
declare function run<T>(thunk: (t: T) => void): T;
let i: { inference: string } = run((o) => {
  o.inference = "INSERT STATE HERE";
});
```

`o` 의 타입은 `{ inference: string }` 으로 결정되었습니다. 왜냐하면

1. 선언 이니셜라이저는 선언 타입: `{ inference: string }`에 따라서
   문맥적으로 타입이 정해집니다.
2. 호출의 리턴 타입은 추론을 위해 문맥적인 타입을 사용하기 때문에,
   컴파일러는 `T={ inference: string }`으로 추론합니다.
3. 화살표 함수는 매개변수에 타입을 지정하기 위해 문맥적인 타입을 사용하므로,
   컴파일러는 `o: { inference: string }`를 제공합니다.

입력하는 동안, `o.` 를 타이핑 후에,
실제 프로그램에 있는 다른 속성과 함께 속성 `inference` 으로
보완할 수 있습니다.
이 기능은 TypeScript의 추론을 통해 통합적인 타입 추론 엔진처럼
보이겠지만, 그렇지 않습니다.

## 타입 별칭 (Type aliases)

타입 별칭은 Haskell의 `type`과 마찬가지로 단순한 별칭입니다.
컴파일러는 소스 코드에서 사용된 별칭 이름을 사용하려고
시도하지만 항상 성공하지는 않습니다.

```ts
type Size = [number, number];
let x: Size = [101.1, 999.9];
```

`newtype`과 가장 유사한 것은 _태그된 교차 타입(tagged intersection)_ 입니다:

```ts
type FString = string & { __compileTimeOnly: any };
```

`FString`은 컴파일러가 실제로는 존재하지 않는 `__compileTimeOnly`라는
프로퍼티를 가지고 있다고 생각하는 점을 제외하면 일반 문자열과 같습니다.
`FString`은 여전히 `string`에 할당 가능하지만,
그 반대는 불가능하다는 것을 의미합니다.

## 판별 유니언 (Discriminated Unions)

`data`와 가장 유사한 것은 보통 TypeScript에서 판별 유니언이라 불리는,
 판별 프로퍼티를 갖는 타입의 유니언입니다:

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; x: number }
  | { kind: "triangle"; x: number; y: number };
```

하스켈과 달리, 태그 또는 판별은 각각 객체 타입에서 단지 속성에 불구합니다.
특이 케이스는 다른 유닛 타입과 함께 동일한 속성을 가집니다.
아직 평범한 유니언타입입니다; 리드하는 `|` 는
유니언 타입 구문의 선택적인 부분입니다. 유니언을 사용하는 평범한 JavaScript
코드로 구별가능합니다:

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; x: number }
  | { kind: "triangle"; x: number; y: number };

function area(s: Shape) {
  if (s.kind === "circle") {
    return Math.PI * s.radius * s.radius;
  } else if (s.kind === "square") {
    return s.x * s.x;
  } else {
    return (s.x * s.y) / 2;
  }
}
```

`area` 의 리턴 타입은 `number` 를 나타내는데, TypeScript가 함수가 전체라는
걸 알고 있기 때문에 유의해야할 필요가 있습니다. 몇몇 특이 케이스가 커버되지 않으면
`area` 의 리턴 타입은 `number | undefined` 으로 대신될 것입니다.

또한, 하스켈과 달리 흔한 속성들은 어떤 유니언에도 나타나며,
그래서 유용하게 여러 개의 유니언 구분가능합니다:

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; x: number }
  | { kind: "triangle"; x: number; y: number };
// ---cut---
function height(s: Shape) {
  if (s.kind === "circle") {
    return 2 * s.radius;
  } else {
    // s.kind: "square" | "triangle"
    return s.x;
  }
}
```

## 타입 매개변수 (Type Parameters)

대부분의 C-계열 언어처럼, TypeScript는 타입 매개변수의 선언을
요구합니다:

```ts
function liftArray<T>(t: T): Array<T> {
  return [t];
}
```

대소문자에 대한 요구 조건은 없지만, 타입 매개 변수는 일반적으로 단일 대문자입니다.
타입 매개 변수는 타입 클래스 제약과 비슷하게 동작하는
타입으로 제한될 수 있습니다.

```ts
function firstish<T extends { length: number }>(t1: T, t2: T): T {
  return t1.length > t2.length ? t1 : t2;
}
```

TypeScript는 일반적으로 인자 타입에 기반하여 호출로부터 타입 인자를 추론할 수 있기 때문에
대게 타입 인자를 필요로 하지 않습니다.

왜냐하면 TypeScript는 구조적이기 때문에, 이름 기반의 시스템만큼 타입 매개 변수를 필요로
하지 않습니다. 특히 함수를 다형성으로 만들
필요는 없습니다. 타입 매개변수는 매개변수를 같은 타입으로
제한하는 것처럼 타입 정보를 _전파하는데만_
쓰여야 합니다:

```ts
function length<T extends ArrayLike<unknown>>(t: T): number {}

function length(t: ArrayLike<unknown>): number {}
```

첫 번째 `length`에서 T는 필요하지 않습니다; 오직 한 번만 참조되며,
다른 매개변수나 리턴 값의 타입을 제한하는데 사용되지 않는다는 것을
알아둬야 합니다.

### 상위 유형의 타입 (Higher-kinded types)

TypeScript는 상위 유형의 타입이 없습니다. 그러므로 다음과 같이 하는 건 허용하지 않습니다:

```ts
function length<T extends ArrayLike<unknown>, U>(m: T<U>) {}
```

### 포인트-프리 프로그래밍 (Point-free programming)

포인트-프리 프로그래밍은 &mdash; 커링 및 함수 합성의 과도한 사용
&mdash; JavaScript에서 가능하지만 장황할 수 있습니다.
TypeScript에서 포인트-프리 프로그래밍에 대한 타입 추론이 실패하는 경우가 많으므로,
값 매개변수 대신 타입 매개변수를 지정하게 됩니다.
그 결과는 너무 장황해서 보통 포인트-프리 프로그래밍은 피하는 게
좋습니다.

## 모듈 시스템 (Module system)

`import` 또는 `export`가 포함된 파일이 암시적으로 모듈이라는 점을 제외하면
JavaScript의 최신 모듈 구문은 Haskell과 약간 유사합니다:

```ts
import { value, Type } from "npm-package";
import { other, Types } from "./local-package";
import * as prefix from "../lib/third-package";
```

commonjs 모듈로 가져올 수 있습니다 &mdash; node.js' 모듈 시스템으로
사용된 모듈:

```ts
import f = require("single-function-package");
```

export 목록으로 내보낼 수 있습니다:

```ts
export { f };

function f() {
  return g();
}
function g() {} // g is not exported
```

또는 개별적으로 표시해서:

```ts
export function f { return g() }
function g() { }
```

후자의 스타일이 더 일반적이지만 같은 파일 내에서도 둘 다
허용됩니다.

## `readonly` 와 `const` (`readonly` and `const`)

JavaScript에서, 수정 가능함이 기본이지만,
_참조_가 수정 불가능함을 선언하기 위해 `const`로 변수를 선언할 수 있습니다.
참조 대상은 여전히 수정 가능합니다:

```js
const a = [1, 2, 3];
a.push(102); // ):
a[0] = 101; // D:
```

TypeScript는 추가적으로 프로퍼티에 `readonly` 제어자를 사용할 수 있습니다.

```ts
interface Rx {
  readonly x: number;
}
let rx: Rx = { x: 1 };
rx.x = 12; // error
```

매핑된 타입 `Readonly<T>` 은 모든 프로퍼티를 `readonly` 으로
만들어 버립니다:

```ts
interface X {
  x: number;
}
let rx: Readonly<X> = { x: 1 };
rx.x = 12; // error
```

그리고 부작용을 일으키는 메서드를 제거하고 배열 인덱스에 대한 변경을 방지하는
특정 `ReadonlyArray<T>` 타입과,
이 타입에 대한 특수 구문이 있습니다:

```ts
let a: ReadonlyArray<number> = [1, 2, 3];
let b: readonly number[] = [1, 2, 3];
a.push(102); // error
b[0] = 101; // error
```

배열과 객체 리터럴에서 동작하는 const-assertion만
사용할 수 있습니다:

```ts
let a = [1, 2, 3] as const;
a.push(102); // error
a[0] = 101; // error
```

그러나 이러한 기능들은 기본적인 기능이 아니므로 TypeScript 코드에
일관적으로 사용하지 않아도 됩니다.

## 다음 단계 (Next Steps)

이 문서는 일상적인 코드에서 높은 수준의 구문과 타입에 대한 개요를 담고 있습니다. 여기서부터는 아래를 참고하시면 됩니다:

*-* 전체 핸드북을 [처음부터 끝까지](/docs/handbook/intro.html) 읽으세요 (30m)
*-* [Playground 예시](/play#show-examples)를 보세요.