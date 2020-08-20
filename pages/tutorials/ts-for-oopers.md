---
title: TypeScript for Java/C# Programmers
layout: docs
permalink: /docs/handbook/typescript-in-5-minutes-oop.html
oneline: Learn TypeScript if you have a background in object-oriented languages
---

TypeScript는 C#, Java와 같이 정적 타이핑을 사용하는 언어에 익숙한 프로그래머들에게 인기 있는 선택입니다.

TypeScript의 타입 시스템은 더 나은 코드 완성, 오류의 조기 발견, 프로그램 부분 간의 더 명확한 통신과 같이 정적 타이핑이 가지는 많은 이점을 제공합니다.
TypeScript는 이러한 개발자에게 친숙한 기능을 많이 제공하지만, JavaScript(또한 TypeScript도 마찬가지로)가 기존의 객체 지향 프로그래밍(OOP) 언어와 어떤 차이가 있는지 다시 살펴볼 필요가 있습니다.
이러한 차이점을 이해하는 것은 더 나은 JavaScript 코드를 작성하는데 도움을 줄 것이고, C#/Java에서 TypeScript로 바로 입문한 프로그래머가 겪는 흔한 함정을 피할 수 있을 것입니다.

## JavaScript 함께 배우기 (Co-learning JavaScript)

만약 JavaScript에 이미 익숙하지만 주로 Java또는 C#을 사용하는 프로그래머라면, 이 소개 페이지는 흔히 접할 수 있는 오해와 함정에 대한 설명에 도움을 줄 수 있습니다.
TypeScript 모델이 유형화하는 방법 중 일부는 Java나 C#과 상당히 다르며, TypeScript를 학습하는 데에 있어 이 부분을 염두에 두는 것이 중요합니다.

만약 JavaScript를 처음 접하는 Java나 C# 프로그래머라면, JavaScript의 런타임 동작을 이해하기 위해 우선적으로 타입을 _제외한_ JavaScript의 일부분을 배우는 것이 좋습니다.
TypeScript는 코드를 _실행하는_ 방식을 바꾸지 않기 때문에, 실제로 무언가 동작하는 코드를 작성하기 위해서는 여전히 JavaScript가 어떻게 작동하는지 배워야 합니다!

TypeScript가 JavaScript와 동일한 *런타임*을 사용하므로, 특정한 런타임 동작(문자열을 숫자로 변환하기, 경고 표시, 디스크에 파일 쓰기 등)을 구현하려는 리소스는 항상 TypeScript 프로그램에 똑같이 잘 적용된다는 점을 기억하는 것은 매우 중요합니다.
TypeScript에 특정된 리소스에만 제한을 두지 마십시오!

## 클래스 다시 생각하기 (Rethinking the Class)

C#과 Java는 _의무적 OOP_ 언어라고 부릅니다.
이러한 언어에서 *클래스*는 코드 구성의 기본 단위일 뿐만 아니라 런타임 시 모든 데이터 _그리고_ 동작의 기본적인 컨테이너입니다.
기능과 데이터를 전부 클래스에 무리하게 담는 것은 일부 문제에 대해선 좋은 도메인 모델이 될 수 있지만, 도메인이 모두 이러한 방식으로 표현될 *필요*는 없습니다.

### 자유로운 함수와 데이터 (Free Functions and Data)

JavaScript에서 함수는 어디에나 있을 수 있고, 데이터를 미리 정의된 ‘class’나 ‘struct’에 속하지 않고 자유롭게 전달할 수 있습니다.
이러한 유연성은 대단히 효과적입니다.
묵시적인 OOP 계층 없이 데이터를 처리하는 “자유로운” (클래스와 연관되지 않은) 함수는 JavaScript로 프로그램을 작성하기 위한 모델로 선호됩니다.

### 정적 클래스 (Static Classes)

추가적으로, C#과 Java의 싱글턴과 정적 클래스같은 특정 구조는 TypeScript에서 필요하지 않습니다.

## TypeScript의 객체지향프로그래밍 (OOP in TypeScript)

하지만, 원한다면 계속 클래스를 사용해도 됩니다!
일부 문제는 기존의 OOP 계층으로 해결하기 적합하며, TypeScript가 JavaScript의 클래스를 지원하므로 이러한 모델을 더 효과적으로 만듭니다.
TypeScript는 인터페이스, 상속, 정적 메서드 구현과 같은 일반적인 양식을 지원합니다.

우리는 이 가이드의 뒷부분에서 클래스에 대해 다룰 것입니다.

## 타입 다시 생각하기 (Rethinking Types)

TypeScript의 *타입*에 대한 이해는 사실 C#이나 Java와 상당히 다릅니다.
몇 가지 차이점을 살펴봅시다.

### Nominal Reified Type Systems

C# 또는 Java에서 주어진 값이나 객체는 기본형인 ‘null’, 또는 정의된 클래스 타입 중 정확히 하나의 타입을 가집니다.
런타임 시점에서 정확한 타입을 묻기 위해 `value.GetType()` 또는 `value.getClass()`와 같은 메서드를 호출할 수 있습니다.
이러한 타입의 정의는 특정한 이름을 갖고 클래스의 어딘가 존재하며, 명시적인 상속관계나 공통적으로 구현된 인터페이스가 없는 이상 두 클래스가 유사한 형태를 가졌다 해도 서로 대체하여 사용할 수 없습니다.

이러한 양상은 *reified, nominal* 타입 시스템을 설명합니다.
코드에서 사용한 타입은 런타임 시점에 존재하며, 타입은 구조가 아닌 선언을 통해 연관 지어집니다.

### 집합으로서의 타입 (Types as Sets)

C# 또는 Java에서 런타임 타입과 그것의 컴파일 타임 선언 사이의 일대일 대응관계를 생각하는 것은 중요합니다.

TypeScript에서 타입은 공통의 무언가를 공유하는 *값의 집합*으로 생각하는 것이 좋습니다.
타입은 집합에 불과하기 때문에, 특정한 값은 동시에 _수많은_ 집합에 속할 수 있습니다.

일단 타입을 집합으로 생각하기 시작하면, 특정 연산이 매우 자연스러워집니다.
예를 들어, C#에서는 ‘문자열’과 ‘정수’ *둘 다 가능한* 값의 경우를 나타내는 타입이 전혀 없기 때문에 이 값을 인자로 전달하는 것은 이상합니다.

TypeScript에서 모든 타입이 단순히 집합이라는 것을 깨닫는 순간 이는 매우 자연스러워집니다.
‘문자열’ 집합 또는 ‘숫자’ 집합에 속할 수 있는 값을 어떻게 설명하시겠습니까?
이것은 단순히 그 집합들의 *union*: ‘string | number’에 속합니다.

TypeScript는 집합론에 의거한 타입을 이용하는 여러 방법들을 제공하며. 타입을 집합으로 생각하기 시작하면 더 직관적입니다.

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
