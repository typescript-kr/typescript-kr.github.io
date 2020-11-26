---
title: TypeScript for JavaScript Programmers
layout: docs
permalink: /docs/handbook/typescript-in-5-minutes.html
oneline: Learn how TypeScript extends JavaScript
---

현대 프로그래밍 언어에서 TypeScript와 JavaScript의 관계는 다소 독특합니다.
TypeScript은 JavaScript 위에 레이어로서 자리잡고 있는데, JavaScript의 기능들을 제공하면서 그 위에 자체 레이어를 추가합니다. 이 레이어가 TypeScript 타입 시스템입니다.

JavaScript는 이미 `string`, `number`, `object`, `undefined` 같은 원시 타입을 가지고 있지만, 전체 코드베이스에 일관되게 할당되었는지는 미리 확인해 주지 않습니다. TypeScript는 이 레이어로서 동작합니다.

이는 이미 존재하고 잘 동작하는 JavaScript 코드는 동시에 TypeScript 코드라는 의미지만, TypeScript의 타입 검사기는 사용자가 생각한 일과 JavaScript가 실제로 하는 일 사이의 불일치를 강조할 수 있습니다.

이 튜토리얼은 TypeScript가 추가하는 타입 시스템 언어 확장을 이해하는데 중점을 두고 타입 시스템에 대한 5분 개요를 제공합니다.

## 타입 추론 (Types by Inference)

TypeScript는 JavaScript 언어를 알고 있으며 대부분의 경우 타입을 생성해줄 것입니다.
예를 들어 변수를 생성하면서 동시에 특정 값에 할당하는 경우, TypeScript는 그 값을 해당 변수의 타입으로 사용할 것입니다.

```ts
let helloWorld = "Hello World";
//  ^?
```

JavaScript가 동작하는 방식을 이해함으로써 TypeScript는 JavaScript 코드를 받아들이면서 타입을 가지는 타입 시스템을 구축할 수 있습니다. 이는 코드에서 타입을 명시하기 위해 추가로 문자를 사용할 필요가 없는 타입 시스템을 제공합니다. 이것이 위의 예제에서 TypeScript가 `helloWorld`가 `string`임을 알게 되는 방식입니다.

JavaScript와 함께 VS Code를 사용하고 작업을 할 때 편집기의 자동 완성 기능을 사용해왔을 것입니다.
이는 TypeScript에 필수불가결한 JavaScript에 대한 이해가 JavaScript 작업을 개선하기 위해 내부적으로 사용되었기 때문입니다.

## 타입 정의하기 (Defining Types)

JavaScript는 다양한 디자인 패턴을 가능하게 하는 동적 언어입니다. 몇몇 디자인 패턴은 자동으로 타입을 제공하기 힘들 수 있는데 (동적 프로그래밍을 사용하고 있을 것이기 때문에) 이러한 경우에 TypeScript는 TypeScript에게 타입이 무엇이 되어야 하는지 명시 가능한 JavaScript 언어의 확장을 지원합니다.

다음은 `name: string`과 `id: number`을 포함하는 추론 타입을 가진 객체를 생성하는 예제입니다.

```ts
const user = {
  name: "Hayes",
  id: 0,
};
```

이 객체의 형태를 명시적으로 나타내기 위해서는 `interface` 로 선언합니다.

```ts
interface User {
  name: string;
  id: number;
}
```

이제 변수 선언 뒤에  `: TypeName`의 구문을 사용해 JavaScript 객체가 새로운 `interface`의 형태를 따르고 있음을 선언할 수 있습니다.

```ts
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

```ts
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

```ts
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

```ts
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

## 타입 구성 (Composing Types)

객체들을 조합하여 더 크고 복잡한 객체를 만드는 방법과 유사하게 TypeScript에 타입으로 이를 수행하는 도구가 있습니다.
여러가지 타입을 이용하여 새 타입을 작성하기 위해 일상적인 코드에서 가장 많이 사용되는 두 가지 코드로는 유니언(Union)과 제네릭(Generic)이 있습니다.

### 유니언 (Unions)

유니언은 타입이 여러 타입 중 하나일 수 있음을 선언하는 방법입니다. 예를 들어, `boolean` 타입을 `true` 또는 `false`로 설명할 수 있습니다:

```
type MyBool = true | false;
```

_참고:_ `MyBool`위에 마우스를 올린다면, `boolean`으로 분류된 것을 볼 수 있습니다 - 구조적 타입 시스템의 프로퍼티며, 나중에 살펴보겠습니다.

유니언 타입이 가장 많이 사용된 사례 중 하나는 값이 다음과 같이 허용되는 `string` 또는 `number`의 [리터럴](/docs/handbook/literal-types.html)집합을 설명하는 것입니다:

```
type WindowStates = "open" | "closed" | "minimized";
type LockStates = "locked" | "unlocked";
type OddNumbersUnderTen = 1 | 3 | 5 | 7 | 9;
```

유니언은 다양한 타입을 처리하는 방법을 제공하는데, 예를 들어 `array` 또는 `string`을 받는 함수가 있을 수 있습니다.

```
function getLength(obj: string | string[]) {
  return obj.length;
}
```

TypeScript는 코드가 시간에 따라 변수가 변경되는 방식을 이해하며, 이러한 검사를 사용해 타입을 골라낼 수 있습니다.

| Type      | Predicate                          |
| --------- | ---------------------------------- |
| string    | `typeof s === "string"`            |
| number    | `typeof n === "number"`            |
| boolean   | `typeof b === "boolean"`           |
| undefined | `typeof undefined === "undefined"` |
| function  | `typeof f === "function"`          |
| array     | `Array.isArray(a)`                 |

예를 들어, `typeof obj === "string"`을 이용하여 `string`과 `array`를 구분할 수 있으며 TypeScript는 객체가 다른 코드 경로에 있음을 알게 됩니다.

<!-- prettier-ignore -->
```
function wrapInArray(obj: string | string[]) {
  if (typeof obj === "string") {
    return [obj];
//          ^?
  } else {
    return obj;
  }
}
```

### 제네릭 (Generics)

TypeScript 제네릭 시스템에 대해 자세히 알아볼 수 있지만, 1분 정도의 수준 높은 설명을 하기 위해, 제네릭은 타입에 변수를 제공하는 방법입니다.

배열이 일반적인 예시이며, 제네릭이 없는 배열은 어떤 것이든 포함할 수 있습니다. 제네릭이 있는 배열은 배열 안의 값을 설명할 수 있습니다.

```ts
type StringArray = Array<string>;
type NumberArray = Array<number>;
type ObjectWithNameArray = Array<{ name: string }>;
```

제네릭을 사용하는 고유 타입을 선언할 수 있습니다:

```
// @errors: 2345
interface Backpack<Type> {
  add: (obj: Type) => void;
  get: () => Type;
}

// 이 줄은 TypeScript에 `backpack`이라는 상수가 있음을 알리는 지름길이며
// const backpack: Backpack<string>이 어디서 왔는지 걱정할 필요가 없습니다.
declare const backpack: Backpack<string>;

// 위에서 Backpack의 변수 부분으로 선언해서, object는 string입니다.
const object = backpack.get();

// backpack 변수가 string이므로, add 함수에 number를 전달할 수 없습니다.
backpack.add(23);
```

## 구조적 타입 시스템 (Structural Type System)

TypeScript의 핵심 원칙 중 하나는 타입 검사가 값이 있는 _형태_에 집중한다는 것입니다.
이는 때때로 "덕 타이핑(duck typing)" 또는 "구조적 타이핑" 이라고 불립니다.

구조적 타입 시스템에서 두 객체가 같은 형태를 가지면 같은 것으로 간주됩니다.

```
interface Point {
  x: number;
  y: number;
}

function printPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}

// "12, 26"를 출력합니다
const point = { x: 12, y: 26 };
printPoint(point);
```

`point`변수는 `Point`타입으로 선언된 적이 없지만, TypeScript는 타입 검사에서 `point`의 형태와 `Point`의 형태를 비교합니다.
둘 다 같은 형태이기 때문에, 통과합니다.

형태 일치에는 일치시킬 객체의 필드의 하위 집합만 필요합니다.

```
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

마지막으로, 정확하게 마무리 짓기 위해, 구조적으로 클래스와 객체가 형태를 따르는 방법에는 차이가 없습니다:

```
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

객체 또는 클래스에 필요한 모든 속성이 존재한다면, TypeScript는 구현 세부 정보에 관계없이 일치하게 봅니다.

## 다음 단계 (Next Steps)

해당 문서는 일상적인 코드에서 사용하는 구문 및 도구의 종류에 대한 수준 높은 5분 개요입니다. 여기에서:

* 전체 핸드북을 [처음부터 끝까지](/docs/handbook/intro.html) 읽으세요(30분)
* [Playground 예시](/play#show-examples)를 탐색하세요.