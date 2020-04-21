# 소개 (Introduction)

이번 장에서는 TypeScript의 타입 추론을 다루겠습니다. 즉 타입이 어디에서, 어떻게 추론되는지 이야기해보겠습니다.

# 기본 (Basic)

TypeScript에서는 타입 표기가 없는 경우 타입 정보를 제공하기 위해 타입을 추론합니다. 예를 들어, 이 코드에서

```ts
let x = 3;
```

변수 `x` 의 타입은 `number`로 추론됩니다.
이러한 추론은 변수와 멤버를 초기화하고, 매개변수의 기본값를 설정하며, 함수의 반환 타입을 결정할 때 발생합니다.

대부분의 경우에 타입 추론은 직관적입니다.
타입을 추론하는 방법에 대해 좀 더 자세히 알아보겠습니다.

# 최적 공통 타입 (Best common type)

여러 표현식에서 타입 추론이 발생할 때, 해당 표현식의 타입을 사용하여 "최적 공통 타입"을 계산합니다. 예를 들어,

```ts
let x = [0, 1, null];
```

위 예제의 `x` 타입을 추론하려면 각 배열 요소들의 타입을 고려해야 합니다.
여기서 배열의 타입으로 고를 수 있는 두 가지 후보가 있습니다: `number`와 `null`입니다.
최적 공통 타입 알고리즘은 각 후보 타입을 고려하여 모든 후보 타입을 포함할 수 있는 타입을 선택합니다.

후보 타입들로부터 최적 공통 타입을 선택하기 때문에, 모든 후보 타입을 포함할 수 있는 상위 타입이 존재해도 후보 타입 중 상위 타입이 존재하지 않으면 선택할 수 없습니다. 예를 들어:

```ts
let zoo = [new Rhino(), new Elephant(), new Snake()];
```

이상적으로는 `zoo` 변수가 `Animal[]` 타입으로 추론되길 원하지만, 배열 중 `Animal` 타입의 객체가 없기 때문에 Animal을 배열 요소 타입으로 추론하지 않습니다.
이를 해결하기 위해서는 모든 후보 타입을 포함하는 상위 타입을 표기해야 합니다.

```ts
let zoo: Animal[] = [new Rhino(), new Elephant(), new Snake()];
```

최적 공통 타입이 존재하지 않는 경우, 추론의 결과는 `(Rhino | Elephant |  Snake)[]`과 같은 유니언 배열 타입입니다.

# 문맥상 타이핑 (Contextual Typing)

TypeScript에서는 경우에 따라 "다른 방향"에서도 타입을 추론합니다.
이를 "문맥상 타이핑" 이라고 합니다. 문맥상 타이핑은 표현식의 타입이 해당 위치에 의해 암시될 때 발생합니다. 예를 들면:

```ts
window.onmousedown = function(mouseEvent) {
    console.log(mouseEvent.button);   //<- 성공
    console.log(mouseEvent.kangaroo); //<- 오류!
};
```

여기에서 TypeScript 타입 검사는 `Window.onmousedown` 함수 타입을 사용하여 할당 오른쪽에 함수 표현식의 타입을 추론합니다.
이렇게 했을 때 `mouseEvent` 매개변수의 [타입](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)이 `button` 프로퍼티는 있지만, `kangaroo` 프로퍼티는 없음을 추론할 수 있습니다.

TypeScript는 다른 문맥에서도 타입 추론을 잘해냅니다.

```ts
window.onscroll = function(uiEvent) {
    console.log(uiEvent.button); //<- 오류!
}
```

위 함수가 `Window.onscroll`에 할당되어 있다는 사실을 기반으로, TypeScript는 `uiEvent`가 이전 예제의 `MouseEvent`가 아닌 [UIEvent](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) 임을 알고 있습니다. `UIEvent` 객체에는 `button` 프로퍼티가 없어서 TypeScript가 오류를 발생시킵니다.

만약 이 함수가 문맥적으로 타입이 추론되지 않는 위치에 있다면, 함수의 인수는 암묵적으로 `any` 타입을 가지며 별도의 오류를 보고하지 않습니다. (`--noImplicitAny` 옵션을 사용하지 않는다면)

```ts
const handler = function(uiEvent) {
    console.log(uiEvent.button); //<- 성공
}
```

우리는 함수의 인수 타입을 any 타입 표기하여 재정의할 수 있습니다.

```ts
window.onscroll = function(uiEvent: any) {
    console.log(uiEvent.button);  //<- 이제 오류가 발생하지 않음
};
```

하지만 `uiEvent`는 `button` 프로퍼티가 없기 때문에 이 코드는 `undefined`을 출력합니다.

문맥상 타이핑은 많은 경우에 적용됩니다.
일반적인 경우, 함수 호출 인수, 할당의 오른쪽, 타입 단언, 객체 / 배열 리터럴의 멤버, 반환문이 있습니다.
문맥상 타입은 최적 공통 타입의 후보 타입으로도 사용됩니다. 예를 들어:

```ts
function createZoo(): Animal[] {
    return [new Rhino(), new Elephant(), new Snake()];
}
```

이 예제에서 최적 공통 타입은 4가지 후보 타입을 가집니다: `Animal`, `Rhino`, `Elephant`, and `Snake`.
이들 중, `Animal`이 최적 공통 타입 알고리즘에 의해 선택됩니다.
