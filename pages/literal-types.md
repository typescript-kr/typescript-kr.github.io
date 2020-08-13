---
title: Literal Types
layout: docs
permalink: /docs/handbook/literal-types.html
oneline: Using literal types with TypeScript
---

리터럴 타입은 collective 타입의 구체적인 하위 타입입니다.
이것이 의미하는 바는 타입 시스템안에서 `"Hello World"`는 `string`이지만, `string`은 `"Hello World"`가 아니란 것입니다.

오늘날 TypeScript에는 문자열과 숫자, 두 가지 리터럴 타입이 있는데 이를 사용하면 문자열이나 숫자에 정확한 값을 지정할 수 있습니다.

# 리터럴 축소 (Literal Narrowing)

`var` 또는 `let`으로 변수를 선언할 경우 이 변수의 값이 변경될 가능성이 있음을 컴파일러에게 알립니다.
반면, `const`로 변수를 선언하게 되면 TypeScript에게 이 객체는 절대 변경되지 않음을 알립니다.

```ts twoslash
// const를 사용하여 변수 helloworld가
// 절대 변경되지 않음을 보장합니다.

// 따라서, TypeScript는 문자열이 아닌 "Hello World"로 타입을 정합니다.
const helloWorld = "Hello World";

// 반면, let은 변경될 수 있으므로 컴파일러는 문자열이라고 선언할 것입니다.
let hiWorld = "Hi World";
```

무한한 수의 잠재적 케이스들 (문자열의 경우의 수는 무한대)을 유한한 수의 잠재적 케이스 (`helloWorld`의 경우의 수는 1개)로 줄여나가는 것을 축소 (narrowing)라 한다.

# 문자열 리터럴 타입 (String Literal Types)

실제로 문자열 리터럴 타입은 유니온 타입, 타입 가드 그리고 타입 별칭과 잘 결합됩니다.
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
      // 하지만 누군가는 타입을 무시하게된다면
      // 이곳에 도달하게 될 수 있습니다.
    }
  }
}

let button = new UIElement();
button.animate(0, 0, "ease-in");
button.animate(0, 0, "uneasy");
```

허용된 세 개의 문자열이 아닌 다른 문자열을 사용하게 되면 오류가 발생합니다.

```
'"uneasy"' 타입은 '"ease-in" | "ease-out" | "ease-in-out"' 타입의 매개 변수에 할당할 수 없습니다.
```

문자열 리터럴 타입은 중복 정의를 구별하는 것과 동일한 방법으로 사용될 수 있습니다:

```ts
function createElement(tagName: "img"): HTMLImageElement;
function createElement(tagName: "input"): HTMLInputElement;
// ... 추가적인 중복 정의들 ...
function createElement(tagName: string): Element {
  // ... 여기에 로직 추가 ...
}
```

# 숫자형 리터럴 타입 (Numeric Literal Types)

TypeScript에는 위의 문자열 리터럴과 같은 역할을 하는 숫자형 리터럴 타입도 있습니다.

```ts twoslash
function rollDice(): 1 | 2 | 3 | 4 | 5 | 6 {
  return (Math.floor(Math.random() * 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6;
}

const result = rollDice();
```

이는 주로 설정 값을 설명할 때 사용됩니다:

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