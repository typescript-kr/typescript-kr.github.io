---
title: TypeScript for Functional Programmers
layout: docs
permalink: /docs/handbook/typescript-in-5-minutes-func.html
oneline: Learn TypeScript if you have a background in functional programming
---

TypeScript began its life as an attempt to bring traditional object-oriented types
to JavaScript so that the programmers at Microsoft could bring
traditional object-oriented programs to the web. As it has developed, TypeScript's type
system has evolved to model code written by native JavaScripters. The
resulting system is powerful, interesting and messy.

This introduction is designed for working Haskell or ML programmers
who want to learn TypeScript. It describes how the type system of
TypeScript differs from Haskell's type system. It also describes
unique features of TypeScript's type system that arise from its
modelling of JavaScript code.

This introduction does not cover object-oriented programming. In
practice, object-oriented programs in TypeScript are similar to those
in other popular languages with OO features.

# Prerequisites

In this introduction, I assume you know the following:

* How to program in JavaScript, the good parts.
* Type syntax of a C-descended language.

If you need to learn the good parts of JavaScript, read
[JavaScript: The Good Parts](http://shop.oreilly.com/product/9780596517748.do).
You may be able to skip the book if you know how to write programs in
a call-by-value lexically scoped language with lots of mutability and
not much else.
[R<sup>4</sup>RS Scheme](https://people.csail.mit.edu/jaffer/r4rs.pdf) is a good example.

[The C++ Programming Language](http://www.stroustrup.com/4th.html) is
a good place to learn about C-style type syntax. Unlike C++,
TypeScript uses postfix types, like so: `x: string` instead of `string x`.

# Concepts not in Haskell

## Built-in types

JavaScript defines 7 built-in types:

| Type        | Explanation                                 |
| ----------- | ------------------------------------------- |
| `Number`    | a double-precision IEEE 754 floating point. |
| `String`    | an immutable UTF-16 string.                 |
| `Boolean`   | `true` and `false`.                         |
| `Symbol`    | a unique value usually used as a key.       |
| `Null`      | equivalent to the unit type.                |
| `Undefined` | also equivalent to the unit type.           |
| `Object`    | similar to records.                         |

[See the MDN page for more detail](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures).

TypeScript has corresponding primitive types for the built-in types:

* `number`
* `string`
* `boolean`
* `symbol`
* `null`
* `undefined`
* `object`

### Other important TypeScript types

| Type           | Explanation                                                 |
| -------------- | ----------------------------------------------------------- |
| `unknown`      | the top type.                                               |
| `never`        | the bottom type.                                            |
| object literal | eg `{ property: Type }`                                     |
| `void`         | a subtype of `undefined` intended for use as a return type. |
| `T[]`          | mutable arrays, also written `Array<T>`                     |
| `[T, T]`       | tuples, which are fixed-length but mutable                  |
| `(t: T) => U`  | functions                                                   |

Notes:

1. Function syntax includes parameter names. This is pretty hard to get used to!

   ```ts
   let fst: (a: any, d: any) => any = (a, d) => a;
   // or more precisely:
   let snd: <T, U>(a: T, d: U) => U = (a, d) => d;
   ```

2. Object literal type syntax closely mirrors object literal value syntax:

   ```ts
   let o: { n: number; xs: object[] } = { n: 1, xs: [] };
   ```

3. `[T, T]` is a subtype of `T[]`. This is different than Haskell, where tuples are not related to lists.

### Boxed types

JavaScript has boxed equivalents of primitive types that contain the
methods that programmers associate with those types. TypeScript
reflects this with, for example, the difference between the primitive
type `number` and the boxed type `Number`. The boxed types are rarely
needed, since their methods return primitives.

```ts
(1).toExponential();
// equivalent to
Number.prototype.toExponential.call(1);
```

Note that calling a method on a numeric literal requires it to be in
parentheses to aid the parser.

## Gradual typing

TypeScript uses the type `any` whenever it can't tell what the type of
an expression should be. Compared to `Dynamic`, calling `any` a type
is an overstatement. It just turns off the type checker
wherever it appears. For example, you can push any value into an
`any[]` without marking the value in any way:

```ts twoslash
// with "noImplicitAny": false in tsconfig.json, anys: any[]
const anys = [];
anys.push(1);
anys.push("oh no");
anys.push({ anything: "goes" });
```

And you can use an expression of type `any` anywhere:

```ts
anys.map(anys[1]); // oh no, "oh no" is not a function
```

`any` is contagious, too &mdash; if you initialise a variable with an
expression of type `any`, the variable has type `any` too.

```ts
let sepsis = anys[0] + anys[1]; // this could mean anything
```

To get an error when TypeScript produces an `any`, use
`"noImplicitAny": true`, or `"strict": true` in `tsconfig.json`.

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
