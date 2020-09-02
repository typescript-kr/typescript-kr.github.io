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

왜냐면 TypeScript는 구조적이고, 명칭적인 시스템인만큼 타입 매개변수를 필요로
하지 않습니다.
특히 함수로 여러가지 기능을 만들 필요가 없습니다.
타입 매개변수는 매개변수를 같은 타입으로 제한하는 것처럼 타입 정보를 _전파하는데만_
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

*-* 전체 핸드북을 읽으세요 [from start to finish](/docs/handbook/intro.html) (30m)
*-* [Playground examples](/play#show-examples)를 말합니다.
