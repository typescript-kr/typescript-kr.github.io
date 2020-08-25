---
title: Unions and Intersection Types
layout: docs
permalink: /docs/handbook/unions-and-intersections.html
oneline: How to use unions and intersection types in TypeScript
---

지금까지, 핸드북은 원자 객체의 타입들을 다뤄왔습니다.
하지만, 더 많은 타입을 모델링할수록 처음부터 타입을 만들어내기보다는 이미 존재하는 타입을 구성하거나 결합하는 방법들을 찾게 될 것입니다.

교차 타입과 유니언 타입은 타입을 구성할 수 있는 방법 중 하나입니다.

# 유니언 타입 (Union Types)

가끔, `number`나 `string`을 매개변수로 기대하는 라이브러리를 사용할 때가 있습니다.
예를 들어, 다음 함수를 사용할 때입니다:

```ts
/**
 * 문자열을 받고 왼쪽에 "padding"을 추가합니다.
 * 만약 'padding'이 문자열이라면, 'padding'은 왼쪽에 더해질 것입니다.
 * 만약 'padding'이 숫자라면, 그 숫자만큼의 공백이 왼쪽에 더해질 것입니다.
 */
function padLeft(value: string, padding: any) {
  if (typeof padding === "number") {
    return Array(padding + 1).join(" ") + value;
  }
  if (typeof padding === "string") {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}

padLeft("Hello world", 4); // "Hello world"를 반환합니다.
```

위 예제에서 `padLeft`의 문제는 매개변수 `padding`이 `any` 타입으로 되어있다는 것입니다.
즉, `number`나 `string` 둘 다 아닌 인수로 함수를 호출할 수 있다는 것이고, TypeScript는 이를 괜찮다고 받아들일 것입니다.

```ts
declare function padLeft(value: string, padding: any): string;
// ---생략---
// 컴파일 타임에는 통과하지만, 런타임에는 오류가 발생합니다.
let indentedString = padLeft("Hello world", true);
```

전통적인 객체지향 코드에서, 타입의 계층을 생성하여 두 타입을 추상화할 수 있습니다.
이는 더 명시적일 수는 있지만, 조금 과하다고 할 수도 있습니다.
기존 방법의 `padLeft`에서 좋은 점 중 하나는 원시 값을 단지 전달할 수 있다는 것입니다.
즉 사용법이 간단하고 간결합니다.
또한 이 새로운 방법은 단지 다른 곳에 이미 존재하는 함수를 사용하고자 할 때 도움이 되지 않습니다.

`any` 대신에, _유니언 타입_을 매개변수 `padding`에 사용할 수 있습니다:

```ts
// @errors: 2345
/**
 * 문자열을 받고 왼쪽에 "padding"을 추가합니다.
 * 만약 'padding'이 문자열이라면, 'padding'은 왼쪽에 더해질 것입니다.
 * 만약 'padding'이 숫자라면, 그 숫자만큼의 공백이 왼쪽에 더해질 것입니다.
 */
function padLeft(value: string, padding: string | number) {
  // ...
}

let indentedString = padLeft("Hello world", true);
```

유니언 타입은 여러 타입 중 하나가 될 수 있는 값을 의미합니다.
세로 막대 (`|`)로 각 타입을 구분하여, `number | string | boolean`은 값의 타입이 `number`, `string` 혹은 `boolean`이 될 수 있음을 의미합니다.

## 공통 필드를 갖는 유니언 (Unions with Common Fields)

유니언 타입인 값이 있으면, 유니언에 있는 모든 타입에 공통인 멤버들에만 접근할 수 있습니다.

```ts
// @errors: 2339

interface Bird {
  fly(): void;
  layEggs(): void;
}

interface Fish {
  swim(): void;
  layEggs(): void;
}

declare function getSmallPet(): Fish | Bird;

let pet = getSmallPet();
pet.layEggs();

// 두 개의 잠재적인 타입 중 하나에서만 사용할 수 있습니다.
pet.swim();
```

여기서 유니언 타입은 약간 까다로울 수 있으나, 익숙해지는 데 약간의 직관만 있으면 됩니다.
만약 값이 `A | B` 타입을 갖고 있으면, _확신할_ 수 있는 것은 그 값이 `A`_와_`B` 둘 다 가지고 있는 멤버들을 갖고 있다는 것뿐입니다.
이 예제에서, `Bird`는 `fly`라는 멤버를 갖고 있습니다.
`Bird | Fish`로 타입이 지정된 변수가 `fly` 메서드를 가지고 있는지 확신할 수 없습니다.
만약 변수가 실제로 런타임에 `Fish`이면, `pet.fly()`를 호출하는 것은 오류입니다.

## 유니언 구별하기 (Discriminating Unions)

유니언을 사용하는 데 있어서 일반적인 기술은 TypeScript가 현재 가능한 타입 추론의 범위를 좁혀나가게 해줄 수 있는 리터럴 타입을 갖는 단일 필드를 사용하는 것입니다. 예를 들어, 하나의 공통 필드를 가지고 있는 세 가지 타입의 유니언을 만들어 보겠습니다.

```ts
type NetworkLoadingState = {
  state: "loading";
};

type NetworkFailedState = {
  state: "failed";
  code: number;
};

type NetworkSuccessState = {
  state: "success";
  response: {
    title: string;
    duration: number;
    summary: string;
  };
};

// 위 타입들 중 단 하나를 대표하는 타입을 만들었지만,
// 그것이 무엇에 해당하는지 아직 확실하지 않습니다.
type NetworkState =
  | NetworkLoadingState
  | NetworkFailedState
  | NetworkSuccessState;
```

위 타입들은 모두 `state`라는 필드를 갖고 있으며, 그들 각자만의 필드도 갖고 있습니다:

<table class='tg' width="100%">
  <tbody>
    <tr>
      <th><code>NetworkLoadingState</code></th>
      <th><code>NetworkFailedState</code></th>
      <th><code>NetworkSuccessState</code></th>
    </tr>
    <tr class='highlight'>
      <td>state</td>
      <td>state</td>
      <td>state</td>
    </tr>
    <tr>
      <td></td>
      <td>code</td>
      <td>response</td>
    </tr>
    </tbody>
</table>

`state` 필드가 `NetworkState` 안의 모든 타입에 공통으로 존재한다는 점을 안다면 - 존재 여부를 체크하지 않고도 접근할 수 있습니다.

리터럴 타입으로서 `state`를 갖고 있다면, `state`의 값은 대응하는 동일한 문자열과 대조되고 TypeScript는 현재 어떤 타입이 사용되고 있는지 알 것입니다.

<table class='tg' width="100%">
  <tbody>
    <tr>
      <th><code>NetworkLoadingState</code></th>
      <th><code>NetworkFailedState</code></th>
      <th><code>NetworkSuccessState</code></th>
    </tr>
    <tr>
      <td><code>"loading"</code></td>
      <td><code>"failed"</code></td>
      <td><code>"success"</code></td>
    </tr>
    </tbody>
</table>

이 경우, 런타임에 나타나는 타입의 범위를 좁히기 위하여 `switch`문을 사용할 수 있습니다.

```ts
// @errors: 2339
type NetworkLoadingState = {
  state: "loading";
};

type NetworkFailedState = {
  state: "failed";
  code: number;
};

type NetworkSuccessState = {
  state: "success";
  response: {
    title: string;
    duration: number;
    summary: string;
  };
};
// ---생략---
type NetworkState =
  | NetworkLoadingState
  | NetworkFailedState
  | NetworkSuccessState;

function networkStatus(state: NetworkState): string {
  // 현재 TypeScript는 셋 중 어떤 것이
  // state가 될 수 있는 잠재적인 타입인지 알 수 없습니다.

  // 모든 타입에 공유되지 않는 프로퍼티에 접근하려는 시도는
  // 오류를 발생시킵니다.
  state.code;

  // state에 swtich문을 사용하여, TypeScript는 코드 흐름을 분석하면서
  // 유니언 타입을 좁혀나갈 수 있습니다.
  switch (state.state) {
    case "loading":
      return "Downloading...";
    case "failed":
      // 여기서 타입은 NetworkFailedState일 것이며,
      // 따라서 `code` 필드에 접근할 수 있습니다.
      return `Error ${state.code} downloading`;
    case "success":
      return `Downloaded ${state.response.title} - ${state.response.summary}`;
  }
}
```

# 교차 타입 (Intersection Types)

교차 타입은 유니언 타입과 밀접한 관련이 있지만, 사용 방법은 매우 다릅니다.
교차 타입은 여러 타입을 하나로 결합합니다.
기존 타입을 합쳐 필요한 모든 기능을 가진 하나의 타입을 얻을 수 있습니다.
예를 들어, `Person & Serializable & Loggable`은 `Person` _과_ `Serializable` _그리고_ `Loggable`입니다.
즉, 이 타입의 객체는 세 가지 타입의 모든 멤버를 갖게 됩니다.

예를 들어, 동일한 에러 핸들링을 하게 되는 여러 네트워크 요청이 있다면 해당 에러 핸들링을 분리하여 하나의 응답 타입에 대응하는 타입들로 결합된 자체 타입으로 만들 수 있습니다.

```ts
interface ErrorHandling {
  success: boolean;
  error?: { message: string };
}

interface ArtworksData {
  artworks: { title: string }[];
}

interface ArtistsData {
  artists: { name: string }[];
}

// 이 인터페이스들은
// 하나의 에러 핸들링과 그들 자체의 데이터로 구성됩니다.

type ArtworksResponse = ArtworksData & ErrorHandling;
type ArtistsResponse = ArtistsData & ErrorHandling;

const handleArtistsResponse = (response: ArtistsResponse) => {
  if (response.error) {
    console.error(response.error.message);
    return;
  }

  console.log(response.artists);
};
```

## 교차 타입을 통한 믹스인 (Mixins via Intersections)

교차 타입들은 [믹스인 패턴](/docs/handbook/mixins.html)을 실행하기 위해 사용됩니다.

```ts
class Person {
  constructor(public name: string) {}
}

interface Loggable {
  log(name: string): void;
}

class ConsoleLogger implements Loggable {
  log(name: string) {
    console.log(`Hello, I'm ${name}.`);
  }
}

// 두 객체를 받아 하나로 합칩니다.
function extend<First extends {}, Second extends {}>(
  first: First,
  second: Second
): First & Second {
  const result: Partial<First & Second> = {};
  for (const prop in first) {
    if (first.hasOwnProperty(prop)) {
      (result as First)[prop] = first[prop];
    }
  }
  for (const prop in second) {
    if (second.hasOwnProperty(prop)) {
      (result as Second)[prop] = second[prop];
    }
  }
  return result as First & Second;
}

const jim = extend(new Person("Jim"), ConsoleLogger.prototype);
jim.log(jim.name);
```-