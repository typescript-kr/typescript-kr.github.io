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

1. 선언 초기화는 선언 타입: `{ inference: string }`에 따라서
   문맥적으로 타입이 정해집니다.
2. 호출하는 리턴 타입은 추론을 위한 문맥적인 타입을 사용하며, 또한
   컴파일러는 `T={ inference: string }`으로 추론가능합니다.
3. 화살표 함수는 매개변수에 입력하여 문맥상 타입을 사용므로,
   컴파일러에서는 `o: { inference: string }` 를 제공합니다.

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
