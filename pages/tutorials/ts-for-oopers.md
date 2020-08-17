---
title: TypeScript for Java/C# Programmers
layout: docs
permalink: /docs/handbook/typescript-in-5-minutes-oop.html
oneline: Learn TypeScript if you have a background in object-oriented languages
---

TypeScript는 C#, Java와 같이 정적 타이핑을 사용하는 언어에 익숙한 프로그래머들에게 인기 있는 선택입니다.

TypeScript의 타입 시스템은 더 나은 코드 완성, 오류의 조기 발견, 프로그램 부분 간의 더 명확한 통신과 같이 정적 타이핑이 가지는 많은 이점을 제공합니다.
TypeScript는 이러한 개발자에게 친숙한 기능을 많이 제공하지만, JavaScript(또한 TypeScript도 마찬가지로)가 기존의 객체 지향 프로그래밍(OOP) 언어와 어떤 차이가 있는지 다시 살펴볼 필요가 있습니다.
이러한 차이점을 이해하는 것은 더 나은 JavaScript 코드를 작성하는데 도움을 줄 것이고, C#/Java에서 TypeScript로 바로 입문한 프로그래머가 겪는 흔한 함정들을 피할 수 있을 것입니다.

## JavaScript 함께 배우기 (Co-learning JavaScript)

만약 JavaScript에 이미 익숙하지만 주로 Java또는 C#을 사용하는 프로그래머라면, 이 소개 페이지는 흔히 접할 수 있는 오해와 함정에 대한 설명에 도움을 줄 수 있습니다.
TypeScript 모델이 유형화하는 방법 중 일부는 Java나 C#과 상당히 다르며, TypeScript를 학습하는 데에 있어 이 부분을 염두에 두는 것이 중요합니다.

만약 JavaScript를 처음 접하는 Java나 C# 프로그래머라면, JavaScript의 런타임 동작을 이해하기 위해 우선적으로 타입을 _제외한_ JavaScript의 일부분을 배우는 것이 좋습니다.
TypeScript는 코드를 _실행하는_ 방식을 바꾸지 않기 때문에, 실제로 무언가 동작하는 코드를 작성하기 위해서는 여전히 JavaScript가 어떻게 작동하는지 배워야 합니다!

TypeScript가 JavaScript와 동일한 _런타임_을 사용하므로, 특정한 런타임 동작(문자열을 숫자로 변환하기, 경고 표시, 디스크에 파일 쓰기 등)을 구현하려는 리소스는 항상 TypeScript 프로그램에 똑같이 잘 적용된다는 점을 기억하는 것은 매우 중요합니다.
TypeScript에 특정된 리소스에만 제한을 두지 마십시오!

## Rethinking the Class

C# and Java are what we might call _mandatory OOP_ languages.
In these languages, the _class_ is the basic unit of code organization, and also the basic container of all data _and_ behavior at runtime.
Forcing all functionality and data to be held in classes can be a good domain model for some problems, but not every domain _needs_ to be represented this way.

### Free Functions and Data

In JavaScript, functions can live anywhere, and data can be passed around freely without being inside a pre-defined `class` or `struct`.
This flexibility is extremely powerful.
"Free" functions (those not associated with a class) working over data without an implied OOP hierarchy tends to be the preferred model for writing programs in JavaScript.

### Static Classes

Additionally, certain constructs from C# and Java such as singletons and static classes are unnecessary in TypeScript.

## OOP in TypeScript

That said, you can still use classes if you like!
Some problems are well-suited to being solved by a traditional OOP hierarchy, and TypeScript's support for JavaScript classes will make these models even more powerful.
TypeScript supports many common patterns such as implementing interfaces, inheritance, and static methods.

We'll cover classes later in this guide.

## Rethinking Types

TypeScript's understanding of a _type_ is actually quite different from C# or Java's.
Let's explore some differences.

### Nominal Reified Type Systems

In C# or Java, any given value or object has one exact type - either `null`, a primitive, or a known class type.
We can call methods like `value.GetType()` or `value.getClass()` to query the exact type at runtime.
The definition of this type will reside in a class somewhere with some name, and we can't use two classes with similar shapes in lieu of each other unless there's an explicit inheritance relationship or commonly-implemented interface.

These aspects describe a _reified, nominal_ type system.
The types we wrote in the code are present at runtime, and the types are related via their declarations, not their structures.

### Types as Sets

In C# or Java, it's meaningful to think of a one-to-one correspondence between runtime types and their compile-time declarations.

In TypeScript, it's better to think of a type as a _set of values_ that share something in common.
Because types are just sets, a particular value can belong to _many_ sets at the same time.

Once you start thinking of types as sets, certain operations become very natural.
For example, in C#, it's awkward to pass around a value that is _either_ a `string` or `int`, because there isn't a single type that represents this sort of value.

In TypeScript, this becomes very natural once you realize that every type is just a set.
How do you describe a value that either belongs in the `string` set or the `number` set?
It simply belongs to the _union_ of those sets: `string | number`.

TypeScript provides a number of mechanisms to work with types in a set-theoretic way, and you'll find them more intuitive if you think of types as sets.

### Erased Structural Types

In TypeScript, objects are _not_ of a single exact type.
For example, if we construct an object that satisfies an interface, we can use that object where that interface is expected even though there was no declarative relationship between the two.

```ts twoslash
interface Pointlike {
  x: number;
  y: number;
}
interface Named {
  name: string;
}

function printPoint(point: Pointlike) {
  console.log("x = " + point.x + ", y = " + point.y);
}

function printName(x: Named) {
  console.log("Hello, " + x.name);
}

const obj = {
  x: 0,
  y: 0,
  name: "Origin",
};

printPoint(obj);
printName(obj);
```

TypeScript's type system is _structural_, not nominal: We can use `obj` as a `Pointlike` because it has `x` and `y` properties that are both numbers.
The relationships between types are determined by the properties they contain, not whether they were declared with some particular relationship.

TypeScript's type system is also _not reified_: There's nothing at runtime that will tell us that `obj` is `Pointlike`.
In fact, the `Pointlike` type is not present _in any form_ at runtime.

Going back to the idea of _types as sets_, we can think of `obj` as being a member of both the `Pointlike` set of values and the `Named` set of values.

### Consequences of Structural Typing

OOP programmers are often surprised by two particular aspects of structural typing.

#### Empty Types

The first is that the _empty type_ seems to defy expectation:

```ts twoslash
class Empty {}

function fn(arg: Empty) {
  // do something?
}

// No error, but this isn't an 'Empty' ?
fn({ k: 10 });
```

TypeScript determines if the call to `fn` here is valid by seeing if the provided argument is a valid `Empty`.
It does so by examining the _structure_ of `{ k: 10 }` and `class Empty { }`.
We can see that `{ k: 10 }` has _all_ of the properties that `Empty` does, because `Empty` has no properties.
Therefore, this is a valid call!

This may seem surprising, but it's ultimately a very similar relationship to one enforced in nominal OOP languages.
A subclass cannot _remove_ a property of its base class, because doing so would destroy the natural subtype relationship between the derived class and its base.
Structural type systems simply identify this relationship implicitly by describing subtypes in terms of having properties of compatible types.

#### Identical Types

Another frequent source of surprise comes with identical types:

```ts
class Car {
  drive() {
    // hit the gas
  }
}
class Golfer {
  drive() {
    // hit the ball far
  }
}

// No error?
let w: Car = new Golfer();
```

Again, this isn't an error because the _structures_ of these classes are the same.
While this may seem like a potential source of confusion, in practice, identical classes that shouldn't be related are not common.

We'll learn more about how classes relate to each other in the Classes chapter.

### Reflection

OOP programmers are accustomed to being able to query the type of any value, even a generic one:

```csharp
// C#
static void PrintType<T>() {
    Console.WriteLine(typeof(T).Name);
}
```

Because TypeScript's type system is fully erased, information about e.g. the instantiation of a generic type parameter is not available at runtime.

JavaScript does have some limited primitives like `typeof` and `instanceof`, but remember that these operators are still working on the values as they exist in the type-erased output code.
For example, `typeof (new Car())` will be `"object"`, not `Car` or `"Car"`.

---

This is an overview, from here you should read [through the handbook](/docs/handbook/intro.html) or explore the [Playground examples](/play#show-examples)
