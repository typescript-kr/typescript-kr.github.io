---
title: Literal Types
layout: docs
permalink: /docs/handbook/literal-types.html
oneline: Using literal types with TypeScript
---

A literal is a more concrete sub-type of a collective type.
What this means is that `"Hello World"` is a `string`, but a `string` is not `"Hello World"` inside the type system.

리터럴 타입은 collective 타입의 보다 견고한 하위 타입입니다.
이것이 의미하는 바는 타입 시스템안에서 `"Hello World"`는 `string`이지만, `string`은 `"Hello World"`가 아니란 것입니다.

There are two sets of literal types available in TypeScript today, strings and numbers, by using literal types you can allow an exact value which a string or number must have.

오늘날 TypeScript에는 문자열과 숫자의 두 가지 리터럴 타입이 있는데, 이를 사용하면 문자열이나 숫자에 정확한 값을 지정할 수 있습니다.

# Literal Narrowing

# 리터럴 축소 (Literal Narrowing)

When you declare a variable via `var` or `let`, you are telling the compiler that there is the chance that this variable will change its contents.
In contrast, using `const` to declare a variable will inform TypeScript that this object will never change.

`var` 또는 `let`으로 변수를 선언할 경우 이 변수가 내용을 변경할 가능성이 있음을 컴파일러에게 알립니다.
반면, `const`로 변수를 선언하게 되면 TypeScript에게 이 객체가 절대 변경되지 않음을 알립니다.

```ts twoslash
// We're making a guarantee that this variable
// helloWorld will never change, by using const.

// So, TypeScript sets the type to be "Hello World" not string
const helloWorld = "Hello World";

// On the other hand, a let can change, and so the compiler declares it a string
let hiWorld = "Hi World";
```

```ts twoslash
// 우리는 const를 사용하여 변수 helloworld가
// 절대 변경되지 않음을 보장합니다.

// 따라서, TypeScript는 문자열이 아닌 "Hello World"로 타입을 정합니다.
const helloWorld = "Hello World";

// 반면, let은 변경될 수 있으므로 컴파일러는 문자열이라고 선언합니다.
let hiWorld = "Hi World";
```

The process of going from an infinite number of potential cases (there are an infinite number of possible string values) to a smaller, finite number of potential case (in `helloWorld`'s case: 1) is called narrowing.

무한한 수의 잠재적 케이스들 (문자열의 경우의 수는 무한대)을 유한한 수의 잠재적 케이스 (`helloWorld`의 경우의 수는 1개)로 줄여나가는 것을 축소 (narrowing)라 한다.

# String Literal Types

# 문자열 리터럴 타입 (String Literal Types)

In practice string literal types combine nicely with union types, type guards, and type aliases.
You can use these features together to get enum-like behavior with strings.

실제로 문자열 리터럴 타입은 유니온 타입, 타입 가드 그리고 타입 별칭 잘 결합됩니다.
이런 기능을 함께 사용하여 문자열로 enum과 비슷한 형태를 갖출 수 있습니다.

```ts twoslash
// @errors: 2345
type Easing = "ease-in" | "ease-out" | "ease-in-out";

class UIElement {
  animate(dx: number, dy: number, easing: Easing) {
    if (easing === "ease-in") {
      // ...
    } else if (easing === "ease-out") {
    } else if (easing === "ease-in-out") {
    } else {
      // It's possible that someone could reach this
      // by ignoring your types though.
    }
  }
}

let button = new UIElement();
button.animate(0, 0, "ease-in");
button.animate(0, 0, "uneasy");
```

```ts twoslash
// @errors: 2345
type Easing = "ease-in" | "ease-out" | "ease-in-out";

class UIElement {
  animate(dx: number, dy: number, easing: Easing) {
    if (easing === "ease-in") {
      // ...
    } else if (easing === "ease-out") {
    } else if (easing === "ease-in-out") {
    } else {
      // 하지만 누군가는 타입을 무시함으로써
      // 이곳에 도달하게 오게될 수 있습니다.
    }
  }
}

let button = new UIElement();
button.animate(0, 0, "ease-in");
button.animate(0, 0, "uneasy");
```

You can pass any of the three allowed strings, but any other string will give the error

허용된 세 개의 문자열이 아닌 다른 문자열을 사용하게 되면 오류가 발생합니다.

```
Argument of type '"uneasy"' is not assignable to parameter of type '"ease-in" | "ease-out" | "ease-in-out"'
```

```
'"uneasy"' 타입은 '"ease-in" | "ease-out" | "ease-in-out"' 타입의 매개 변수에 할당할 수 없습니다.
```

String literal types can be used in the same way to distinguish overloads:

문자열 리터럴 타입은 중복 정의를 구별하는 것과 동일한 방법으로 사용될 수 있습니다:

```ts
function createElement(tagName: "img"): HTMLImageElement;
function createElement(tagName: "input"): HTMLInputElement;
// ... more overloads ...
function createElement(tagName: string): Element {
  // ... code goes here ...
}
```

```ts
function createElement(tagName: "img"): HTMLImageElement;
function createElement(tagName: "input"): HTMLInputElement;
// ... 추가적인 중복 정의들 ...
function createElement(tagName: string): Element {
  // ... 여기에 로직 추가 ...
}
```

# Numeric Literal Types

# 수치형 리터럴 타입 (Numeric Literal Types)

TypeScript also has numeric literal types, which act the same as the string literals above.

TypeScript에는 위의 문자열 리터럴과 같은 역할을 하는 숫자형 리터럴 타입도 있습니다.

```ts twoslash
function rollDice(): 1 | 2 | 3 | 4 | 5 | 6 {
  return (Math.floor(Math.random() * 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6;
}

const result = rollDice();
```

```ts twoslash
function rollDice(): 1 | 2 | 3 | 4 | 5 | 6 {
  return (Math.floor(Math.random() * 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6;
}

const result = rollDice();
```

A common case for their use is for describing config values:

설정 값을 설명할 때 주로 사용됩니다:

```ts twoslash
/** Creates a map centered at loc/lat */
declare function setupMap(config: MapConfig): void;
// ---cut---
interface MapConfig {
  lng: number;
  lat: number;
  tileSize: 8 | 16 | 32;
}

setupMap({ lng: -73.935242, lat: 40.73061, tileSize: 16 });
```

```ts twoslash
/** loc/lat 좌표에 지도를 생성합니다. */
declare function setupMap(config: MapConfig): void;
// ---생략---
interface MapConfig {
  lng: number;
  lat: number;
  tileSize: 8 | 16 | 32;
}

setupMap({ lng: -73.935242, lat: 40.73061, tileSize: 16 });
```