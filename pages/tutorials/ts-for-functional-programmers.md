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

이 소개는 TypeScript를 배우기 원하는 하스켈 또는 ML 프로그래머들을
위해 만들어졌습니다. 하스켈 타입 시스템과 TypeScript 시스템 타입이
어떻게 다른지 설명하기 위해서입니다.
JavaScript 코드의 모델링에서 발생하는 TypeScript 타입 시스템의
독특한 특징을 설명합니다.

이 소개에서는 객체 지향 프로그래밍을 다루지 않습니다.
실제로, TypeScript에 있는 객체 지향 프로그램은 OO 기능들이 있는 인기 있는
언어들과 유사합니다.

# 전제조건 (Prerequisites)

본 서론에서는 다음과 같은 내용을 알고 있아야 힙니다:

* 좋은 JavaScript 프로그램를 작성하는 방법.
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

# 하스켈에 없는 타입 (Concepts not in Haskell)

## 내장 타입들 (Concepts not in Haskell)

JavaScript에서는 7개의 내장 타입을 정의합니다:

| 타입         | 설명                                         |
| ----------- | ------------------------------------------- |
| `Number`    | 배정밀도 IEEE 754 부동소수점.                    |
| `String`    | 수정 불가능한 UTF-16 문자열.                     |
| `Boolean`   | `true` 와  `false`.                          |
| `Symbol`    | 보통 키로 사용하는 고유한 값                       |
| `Null`      | 단위 타입과 동등.                               |
| `Undefined` | 또한 단위 타입과 동등.                           |
| `Object`    | 레코드와 유사한 것.                             |

[자세한 내용을 위해서 MDN 페이지를 봐주세요](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures).

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

1. 함수 구문 매개변수 이름을 포함하는 함수 구문. 익숙해지기 꽤 어렵습니다!

   ```ts
   let fst: (a: any, d: any) => any = (a, d) => a;
   // 또는 좀 더 정확하게 말하자면:
   let snd: <T, U>(a: T, d: U) => U = (a, d) => d;
   ```

2. 객체 리터럴 타입 구문이 객체 리터럴 값 구문과 꽤 유사합니다:

   ```ts
   let o: { n: number; xs: object[] } = { n: 1, xs: [] };
   ```

3. `[T, T]` 는 `T[]` 의 서브타입입니다. 하스켈과는 다르게, 튜플은 리스트들과 관련이 없습니다.

### 박스 형태 타입 (Boxed types)

JavaScript는 프로그래머들이 해당 타입에 접근할 수 있는 메소드를
포함하는 원시타입을 동등하게 박스해 왔습니다. 예를 들면, 원시 형태의
`number` 과 박스 형태 타입의 `Number`의 다른 점을 TypeScript는
반영해왔습니다.
박스 형태 타입은 메소드가 원시 타입을 반환할 때 아주 드물게 필요합니다.

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

## Structural typing

Structural typing is a familiar concept to most functional
programmers, although Haskell and most MLs are not
structurally typed. Its basic form is pretty simple:

```ts
// @strict: false
let o = { x: "hi", extra: 1 }; // ok
let o2: { x: string } = o; // ok
```

Here, the object literal `{ x: "hi", extra: 1 }` has a matching
literal type `{ x: string, extra: number }`. That
type is assignable to `{ x: string }` since
it has all the required properties and those properties have
assignable types. The extra property doesn't prevent assignment, it
just makes it a subtype of `{ x: string }`.

Named types just give a name to a type; for assignability purposes
there's no difference between the type alias `One` and the interface
type `Two` below. They both have a property `p: string`. (Type aliases
behave differently from interfaces with respect to recursive
definitions and type parameters, however.)

```ts twoslash
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

## Unions

In TypeScript, union types are untagged. In other words, they are not
discriminated unions like `data` in Haskell. However, you can often
discriminate types in a union using built-in tags or other properties.

```ts twoslash
function start(
  arg: string | string[] | (() => string) | { s: string }
): string {
  // this is super common in JavaScript
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
    // finally, just convert a string to another string
    return s;
  }
}
```

`string`, `Array` and `Function` have built-in type predicates,
conveniently leaving the object type for the `else` branch. It is
possible, however, to generate unions that are difficult to
differentiate at runtime. For new code, it's best to build only
discriminated unions.

The following types have built-in predicates:

| Type      | Predicate                          |
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

Note that functions and arrays are objects at runtime, but have their
own predicates.

### Intersections

In addition to unions, TypeScript also has intersections:

```ts twoslash
type Combined = { a: number } & { b: string };
type Conflicting = { a: number } & { a: string };
```

`Combined` has two properties, `a` and `b`, just as if they had been
written as one object literal type. Intersection and union are
recursive in case of conflicts, so `Conflicting.a: number & string`.

## Unit types

Unit types are subtypes of primitive types that contain exactly one
primitive value. For example, the string `"foo"` has the type
`"foo"`. Since JavaScript has no built-in enums, it is common to use a set of
well-known strings instead. Unions of string literal types allow
TypeScript to type this pattern:

```ts twoslash
declare function pad(s: string, n: number, direction: "left" | "right"): string;
pad("hi", 10, "left");
```

When needed, the compiler _widens_ &mdash; converts to a
supertype &mdash; the unit type to the primitive type, such as `"foo"`
to `string`. This happens when using mutability, which can hamper some
uses of mutable variables:

```ts twoslash
// @errors: 2345
declare function pad(s: string, n: number, direction: "left" | "right"): string;
// ---cut---
let s = "right";
pad("hi", 10, s); // error: 'string' is not assignable to '"left" | "right"'
```

Here's how the error happens:

*-* `"right": "right"`
*-* `s: string` because `"right"` widens to `string` on assignment to a mutable variable.
*-* `string` is not assignable to `"left" | "right"`

You can work around this with a type annotation for `s`, but that
in turn prevents assignments to `s` of variables that are not of type
`"left" | "right"`.

```ts twoslash
declare function pad(s: string, n: number, direction: "left" | "right"): string;
// ---cut---
let s: "left" | "right" = "right";
pad("hi", 10, s);
```

# Concepts similar to Haskell

## Contextual typing

TypeScript has some obvious places where it can infer types, like
variable declarations:

```ts twoslash
let s = "I'm a string!";
```

But it also infers types in a few other places that you may not expect
if you've worked with other C-syntax languages:

```ts twoslash
declare function map<T, U>(f: (t: T) => U, ts: T[]): U[];
let sns = map((n) => n.toString(), [1, 2, 3]);
```

Here, `n: number` in this example also, despite the fact that `T` and `U`
have not been inferred before the call. In fact, after `[1,2,3]` has
been used to infer `T=number`, the return type of `n => n.toString()`
is used to infer `U=string`, causing `sns` to have the type
`string[]`.

Note that inference will work in any order, but intellisense will only
work left-to-right, so TypeScript prefers to declare `map` with the
array first:

```ts twoslash
declare function map<T, U>(ts: T[], f: (t: T) => U): U[];
```

Contextual typing also works recursively through object literals, and
on unit types that would otherwise be inferred as `string` or
`number`. And it can infer return types from context:

```ts twoslash
declare function run<T>(thunk: (t: T) => void): T;
let i: { inference: string } = run((o) => {
  o.inference = "INSERT STATE HERE";
});
```

The type of `o` is determined to be `{ inference: string }` because

1. Declaration initialisers are contextually typed by the
   declaration's type: `{ inference: string }`.
2. The return type of a call uses the contextual type for inferences,
   so the compiler infers that `T={ inference: string }`.
3. Arrow functions use the contextual type to type their parameters,
   so the compiler gives `o: { inference: string }`.

And it does so while you are typing, so that after typing `o.`, you
get completions for the property `inference`, along with any other
properties you'd have in a real program.
Altogether, this feature can make TypeScript's inference look a bit
like a unifying type inference engine, but it is not.

## Type aliases

Type aliases are mere aliases, just like `type` in Haskell. The
compiler will attempt to use the alias name wherever it was used in
the source code, but does not always succeed.

```ts twoslash
type Size = [number, number];
let x: Size = [101.1, 999.9];
```

The closest equivalent to `newtype` is a _tagged intersection_:

```ts
type FString = string & { __compileTimeOnly: any };
```

An `FString` is just like a normal string, except that the compiler
thinks it has a property named `__compileTimeOnly` that doesn't
actually exist. This means that `FString` can still be assigned to
`string`, but not the other way round.

## Discriminated Unions

The closest equivalent to `data` is a union of types with discriminant
properties, normally called discriminated unions in TypeScript:

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; x: number }
  | { kind: "triangle"; x: number; y: number };
```

Unlike Haskell, the tag, or discriminant, is just a property in each
object type. Each variant has an identical property with a different
unit type. This is still a normal union type; the leading `|` is
an optional part of the union type syntax. You can discriminate the
members of the union using normal JavaScript code:

```ts twoslash
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

Note that the return type of `area` is inferred to be `number` because
TypeScript knows the function is total. If some variant is not
covered, the return type of `area` will be `number | undefined` instead.

Also, unlike Haskell, common properties show up in any union, so you
can usefully discriminate multiple members of the union:

```ts twoslash
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

## Type Parameters

Like most C-descended languages, TypeScript requires declaration of
type parameters:

```ts
function liftArray<T>(t: T): Array<T> {
  return [t];
}
```

There is no case requirement, but type parameters are conventionally
single uppercase letters. Type parameters can also be constrained to a
type, which behaves a bit like type class constraints:

```ts
function firstish<T extends { length: number }>(t1: T, t2: T): T {
  return t1.length > t2.length ? t1 : t2;
}
```

TypeScript can usually infer type arguments from a call based on the
type of the arguments, so type arguments are usually not needed.

Because TypeScript is structural, it doesn't need type parameters as
much as nominal systems. Specifically, they are not needed to make a
function polymorphic. Type parameters should only be used to
_propagate_ type information, such as constraining parameters to be
the same type:

```ts
function length<T extends ArrayLike<unknown>>(t: T): number {}

function length(t: ArrayLike<unknown>): number {}
```

In the first `length`, T is not necessary; notice that it's only
referenced once, so it's not being used to constrain the type of the
return value or other parameters.

### Higher-kinded types

TypeScript does not have higher kinded types, so the following is not legal:

```ts
function length<T extends ArrayLike<unknown>, U>(m: T<U>) {}
```

### Point-free programming

Point-free programming &mdash; heavy use of currying and function
composition &mdash; is possible in JavaScript, but can be verbose.
In TypeScript, type inference often fails for point-free programs, so
you'll end up specifying type parameters instead of value parameters. The
result is so verbose that it's usually better to avoid point-free
programming.

## Module system

JavaScript's modern module syntax is a bit like Haskell's, except that
any file with `import` or `export` is implicitly a module:

```ts
import { value, Type } from "npm-package";
import { other, Types } from "./local-package";
import * as prefix from "../lib/third-package";
```

You can also import commonjs modules &mdash; modules written using node.js'
module system:

```ts
import f = require("single-function-package");
```

You can export with an export list:

```ts
export { f };

function f() {
  return g();
}
function g() {} // g is not exported
```

Or by marking each export individually:

```ts
export function f { return g() }
function g() { }
```

The latter style is more common but both are allowed, even in the same
file.

## `readonly` and `const`

In JavaScript, mutability is the default, although it allows variable
declarations with `const` to declare that the _reference_ is
immutable. The referent is still mutable:

```js
const a = [1, 2, 3];
a.push(102); // ):
a[0] = 101; // D:
```

TypeScript additionally has a `readonly` modifier for properties.

```ts
interface Rx {
  readonly x: number;
}
let rx: Rx = { x: 1 };
rx.x = 12; // error
```

It also ships with a mapped type `Readonly<T>` that makes
all properties `readonly`:

```ts
interface X {
  x: number;
}
let rx: Readonly<X> = { x: 1 };
rx.x = 12; // error
```

And it has a specific `ReadonlyArray<T>` type that removes
side-affecting methods and prevents writing to indices of the array,
as well as special syntax for this type:

```ts
let a: ReadonlyArray<number> = [1, 2, 3];
let b: readonly number[] = [1, 2, 3];
a.push(102); // error
b[0] = 101; // error
```

You can also use a const-assertion, which operates on arrays and
object literals:

```ts
let a = [1, 2, 3] as const;
a.push(102); // error
a[0] = 101; // error
```

However, none of these options are the default, so they are not
consistently used in TypeScript code.

## Next Steps

This doc is a high level overview of the syntax and types you would use in everyday code. From here you should:

*-* Read the full Handbook [from start to finish](/docs/handbook/intro.html) (30m)
*-* Explore the [Playground examples](/play#show-examples).
