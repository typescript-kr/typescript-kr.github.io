---
title: TypeScript for JavaScript Programmers
layout: docs
permalink: /docs/handbook/typescript-in-5-minutes.html
oneline: Learn how TypeScript extends JavaScript
---

<<<<<<< HEAD
현대 프로그래밍 언어에서 TypeScript와 JavaScript의 관계는 다소 독특합니다.
TypeScript은 JavaScript 위에 레이어로서 자리잡고 있는데, JavaScript의 기능들을 제공하면서 그 위에 자체 레이어를 추가합니다. 이 레이어가 TypeScript 타입 시스템입니다.

JavaScript는 이미 `string`, `number`, `object`, `undefined` 같은 원시 타입을 가지고 있지만, 전체 코드베이스에 일관되게 할당되었는지는 미리 확인해 주지 않습니다. TypeScript는 이 레이어로서 동작합니다.
=======
현대 프로그래밍 언어에서 TypeScript와 JavaScript 사이의 관계는 다소 독특합니다.
TypeScript은 JavaScript 위에 레이어로서 자리잡고 있는데, JavaScript의 기능들을 제공하면서 그 위에 자체 레이어를 추가합니다.
이 레이어가 TypeScript 타입 시스템입니다.

JavaScript는 이미 `string`, `number`, `object`, `undefined` 같은 원시 타입을 가지고 있지만, 이것이 전체 코드베이스에 일관되게 할당되었는지는 미리 확인해주지 않습니다. TypeScript는 이를 위한 레이어로 동작합니다.
>>>>>>> ab2e42454878f207e9134190a8140a3a632365bb

이는 이미 존재하고 잘 동작하는 JavaScript 코드는 동시에 TypeScript 코드라는 의미지만, TypeScript의 타입 검사기는 사용자가 생각한 일과 JavaScript가 실제로 하는 일 사이의 불일치를 강조할 수 있습니다.

이 튜토리얼은 TypeScript가 추가하는 타입 시스템 언어 확장을 이해하는데 중점을 두고 타입 시스템에 대한 5분 개요를 제공합니다.

<<<<<<< HEAD
## 타입 추론 (Types by Inference)
=======
## 타입 추론
>>>>>>> ab2e42454878f207e9134190a8140a3a632365bb

TypeScript는 JavaScript 언어를 알고 있으며 대부분의 경우 타입을 생성해줄 것입니다.
예를 들어 변수를 생성하면서 동시에 특정 값에 할당하는 경우, TypeScript는 그 값을 해당 변수의 타입으로 사용할 것입니다.


```ts twoslash
let helloWorld = "Hello World";
//  ^?
```

<<<<<<< HEAD
JavaScript가 동작하는 방식을 이해함으로써 TypeScript는 JavaScript 코드를 받아들이면서 타입을 가지는 타입 시스템을 구축할 수 있습니다. 이는 코드에서 타입을 명시하기 위해 추가로 문자를 사용할 필요가 없는 타입 시스템을 제공합니다. 이것이 위의 예제에서 TypeScript가 `helloWorld`가 `string`임을 알게 되는 방식입니다.
=======
JavaScript가 동작하는 방식을 이해함으로써 TypeScript는 JavaScript 코드를 받아들이면서 타입을 가지는 타입 시스템을 구축할 수 있습니다.
이는 코드에서 타입을 명시하기 위해 추가로 문자를 사용할 필요가 없는 타입 시스템을 제공합니다. 이것이 위의 예제에서 TypeScript가 `helloWorld`가 `string`임을 알게 되는 방식입니다.
>>>>>>> ab2e42454878f207e9134190a8140a3a632365bb

JavaScript와 함께 VS Code를 사용하고 작업을 할 때 편집기의 자동 완성 기능을 사용해왔을 것입니다.
이는 TypeScript에 필수불가결한 JavaScript에 대한 이해가 JavaScript 작업을 개선하기 위해 내부적으로 사용되었기 때문입니다.

<<<<<<< HEAD
## 타입 정의하기 (Defining Types)
=======
## 타입 정의하기
>>>>>>> ab2e42454878f207e9134190a8140a3a632365bb

JavaScript는 다양한 디자인 패턴을 가능하게 하는 동적 언어입니다. 몇몇 디자인 패턴은 자동으로 타입을 제공하기 힘들 수 있는데 (동적 프로그래밍을 사용하고 있을 것이기 때문에) 이러한 경우에 TypeScript는 TypeScript에게 타입이 무엇이 되어야 하는지 명시 가능한 JavaScript 언어의 확장을 지원합니다.

다음은 `name: string`과 `id: number`을 포함하는 추론 타입을 가진 객체를 생성하는 예제입니다.

```ts twoslash
const user = {
  name: "Hayes",
  id: 0,
};
```

이 객체의 형태를 명시적으로 나타내기 위해서는 `interface` 로 선언합니다.

```ts twoslash
interface User {
  name: string;
  id: number;
}
```

이제 변수 선언 뒤에  `: TypeName`의 구문을 사용해 JavaScript 객체가 새로운 `interface`의 형태를 따르고 있음을 선언할 수 있습니다.

```ts twoslash
interface User {
  name: string;
  id: number;
}
// ---cut---
const user: User = {
  name: "Hayes",
  id: 0,
};
```

해당 인터페이스에 맞지 않는 객체를 생성하면 TypeScript는 경고를 줍니다.

```ts twoslash
// @errors: 2322
interface User {
  name: string;
  id: number;
}

const user: User = {
  username: "Hayes",
  id: 0,
};
```

JavaScript는 클래스와 객체 지향 프로그래밍을 지원하기 때문에, TypeScript 또한 동일합니다. - 인터페이스는 클래스로도 선언할 수 있습니다.

```ts twoslash
interface User {
  name: string;
  id: number;
}

class UserAccount {
  name: string;
  id: number;

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}

const user: User = new UserAccount("Murphy", 1);
```

인터페이스는 함수에서 매개변수와 리턴 값을 명시하는데 사용되기도 합니다.

```ts twoslash
// @noErrors
interface User {
  name: string;
  id: number;
}
// ---cut---
function getAdminUser(): User {
  //...
}

function deleteUser(user: User) {
  // ...
}
```

JavaScript에서 사용할 수 있는 적은 종류의 원시 타입이 이미 있습니다.: `boolean`, `bigint`, `null`, `number`, `string`, `symbol`, `object`와 `undefined`는 인터페이스에서 사용할 수 있습니다. TypeScript는 몇 가지를 추기해 목록을 확장합니다. 예를 들어, `any` (무엇이든 허용합니다), [`unknown`](/en/play#example/unknown-and-never) (이 타입을 사용하는 사람이 타입이 무엇인지 선언했는가를 확인하십시오), [`never`](/en/play#example/unknown-and-never) (이 타입은 발생될 수 없습니다) `void` (`undefined`를 리턴하거나 리턴 값이 없는 함수).

타입을 구축하기 위한 두 가지 구문이 있다는 것을 꽤 빠르게 알 수 있을 것입니다.: [Interfaces and Types](/play/?e=83#example/types-vs-interfaces) - `interface`를 우선적으로 사용하고 특정 기능이 필요할 때 `type`을 사용해야 합니다.

## Composing Types

Similar to how you would create larger complex objects by composing them together TypeScript has tools for doing this with types.
The two most popular techniques you would use in everyday code to create new types by working with many smaller types are Unions and Generics.

### Unions

A union is a way to declare that a type could be one of many types. For example, you could describe a `boolean` type as being either `true` or `false`:

```ts twoslash
type MyBool = true | false;
```

_Note:_ If you hover over `MyBool` above, you'll see that it is classed as `boolean` - that's a property of the Structural Type System, which we'll get to later.

One of the most popular use-cases for union types is to describe a set of `string`s or `number`s [literal](/docs/handbook/literal-types.html) which a value is allowed to be:

```ts twoslash
type WindowStates = "open" | "closed" | "minimized";
type LockStates = "locked" | "unlocked";
type OddNumbersUnderTen = 1 | 3 | 5 | 7 | 9;
```

Unions provide a way to handle different types too, for example you may have a function which accepts an `array` or a `string`.

```ts twoslash
function getLength(obj: string | string[]) {
  return obj.length;
}
```

TypeScript understands how code changes what the variable could be with time, you can use these checks to narrow the type down.

| Type      | Predicate                          |
| --------- | ---------------------------------- |
| string    | `typeof s === "string"`            |
| number    | `typeof n === "number"`            |
| boolean   | `typeof b === "boolean"`           |
| undefined | `typeof undefined === "undefined"` |
| function  | `typeof f === "function"`          |
| array     | `Array.isArray(a)`                 |

For example, you could differentiate between a `string` and an `array`, using `typeof obj === "string"` and TypeScript will know what the object is down different code paths.

<!-- prettier-ignore -->
```ts twoslash
function wrapInArray(obj: string | string[]) {
  if (typeof obj === "string") {
    return [obj];
//          ^?
  } else {
    return obj;
  }
}
```

### Generics

You can get very deep into the TypeScript generic system, but at a 1 minute high-level explanation, generics are a way to provide variables to types.

A common example is an array, an array without generics could contain anything. An array with generics can describe what values are inside in the array.

```ts
type StringArray = Array<string>;
type NumberArray = Array<number>;
type ObjectWithNameArray = Array<{ name: string }>;
```

You can declare your own types which use generics:

```ts twoslash
// @errors: 2345
interface Backpack<Type> {
  add: (obj: Type) => void;
  get: () => Type;
}

// This line is a shortcut to tell TypeScript there is a
// constant called `backpack`, and to not worry about where it came from
declare const backpack: Backpack<string>;

// object is a string, because we declared it above as the variable part of Backpack
const object = backpack.get();

// Due to backpack variable being a string, you cannot pass a number to the add function
backpack.add(23);
```

## Structural Type System

One of TypeScript's core principles is that type checking focuses on the _shape_ which values have.
This is sometimes called "duck typing" or "structural typing".

In a structural type system if two objects have the same shape, they are considered the same.

```ts twoslash
interface Point {
  x: number;
  y: number;
}

function printPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}

// prints "12, 26"
const point = { x: 12, y: 26 };
printPoint(point);
```

The `point` variable is never declared to be a `Point` type, but TypeScript compares the shape of `point` to the shape of `Point` in the type-check.
Because they both have the same shape, then it passes.

The shape matching only requires a subset of the object's fields to match.

```ts twoslash
// @errors: 2345
interface Point {
  x: number;
  y: number;
}

function printPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}
// ---cut---
const point3 = { x: 12, y: 26, z: 89 };
printPoint(point3); // prints "12, 26"

const rect = { x: 33, y: 3, width: 30, height: 80 };
printPoint(rect); // prints "33, 3"

const color = { hex: "#187ABF" };

printPoint(color);
```

Finally, to really nail this point down, structurally there is no difference between how classes and objects conform to shapes:

```ts twoslash
// @errors: 2345
interface Point {
  x: number;
  y: number;
}

function printPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}
// ---cut---
class VirtualPoint {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

const newVPoint = new VirtualPoint(13, 56);
printPoint(newVPoint); // prints "13, 56"
```

If the object or class has all the required properties, then TypeScript will say they match regardless of the implementation details.

## Next Steps

This doc is a high level 5 minute overview of the sort of syntax and tools you would use in everyday code. From here you should:

* Read the full Handbook [from start to finish](/docs/handbook/intro.html) (30m)
* Explore the [Playground examples](/play#show-examples).
