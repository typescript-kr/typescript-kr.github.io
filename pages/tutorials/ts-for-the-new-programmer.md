---
title: TypeScript for the New Programmer
layout: docs
permalink: /docs/handbook/typescript-from-scratch.html
oneline: Learn TypeScript from scratch
---

첫 번째 언어로 TypeScript를 고른것을 축하드립니다 - 정말로 좋은 결정입니다!

Typescript가 Javascript의 "기호(flavor)"나 "변형(variant)"이라는 것을 들어봤을 겁니다.
TypeScript(TS)와 JavaScript(JS)의 관계는 현대 프로그래밍 언어에서 꽤 독특한 관계이니, 이 관계를 더 배우는 것은 어떻게 TypeScript를 JavaScript에 추가할지에 도움이 될 것입니다.

## JavaScript의 짧은 역사 (What is JavaScript? A Brief History)

JavaScript(ECMAScript으로도 알려져있는)는 처음에 브라우저를 위한 스크립팅 언어로 만들어졌습니다.
JavaScript가 처음 나왔을 때, 수십 줄 이상의 코드를 작성하는 것은 다소 이례적인 일이었기에 웹 페이지 속 짧은 코드들을 위해 사용할 것으로 여겨졌습니다.
때문에, 초기 웹 브라우저들은 수십 줄 이상의 코드를 실행하는데 오래 걸렸습니다.
그러나 시간이 흘러 JS가 점점 더 유명해지면서, 웹 개발자들은 JS를 이용해 상호작용을 하는 경험을 하기 시작했습니다.

웹 브라우저 개발자들은 위와 같이 늘어나는 JS 사용량에 대하여 실행 엔진(동적 컴파일)을 최적화시키고 최적화 된 것을 이용해 할 수 있는 일(API 추가)을 확장하여 웹 개발자가 더 많이 JS를 사용할 수 있게 했습니다.
현대 웹사이트에서, 브라우저는 수십만 줄의 코드로 구성된 어플리케이션을 자주 실행합니다.
이는 정적 페이지의 간단한 네트워크로 시작해서, 모든 종류의 만족스러울만한 _어플리케이션_을 위한 플랫폼으로 성장한 "웹"의 길고 점진적인 성장입니다.

이외에도, JS는 node.js를 사용하여 JS 서버들을 구현하는 것처럼, 브라우저 맥락에서 벗어나는 일에 사용하기 충분할 정도로 유명해졌습니다.
"어디서든 작동됨"과 같은 JS의 성질은 교차 플랫폼(cross-platform) 개발을 위한 매력적인 선택지이기도 합니다.
오늘날 많은 개발자들은 _오직_ JavaScript만을 이용하여 전체 스택을 프로그래밍하고 있습니다!

요약하자면, 우리에게는 빠른 사용을 위해 설계되었으며 수백만 줄의 어플리케이션들을 작성하기 위해 만들어진 완벽한 도구인 JavaScript가 있습니다.
모든 언어는 각자의 _별난 점_ - 이상한 점과 놀랄만한 점이 있으며, JavaScript의 자랑스럽지만은 않은 시작은 _많은_ 문제를 만들게 되었습니다. 예를 들어:

* JavaScript의 동일 연산자는 (`==`) 인수를 _강제로 변환하여(coerces)_, 예기치 않은 동작을 유발합니다:

  ```js
  if ("" == 0) {
    // 참입니다! 근데 왜죠??
  }
  if (1 < x < 3) {
    // *어떤* x 값이던 참입니다!
  }
  ```

* JavaScript는 또한 존재하지 않는 프로퍼티의 접근을 허용합니다:

  ```js
  const obj = { width: 10, height: 15 };
  // 왜 이게 NaN이죠? 철자가 어렵네요!
  const area = obj.width * obj.heigth;
  ```

대부분의 프로그래밍 언어는 이런 종류의 오류들이 발생하면 오류를 표출해주고, 일부는 코드가 실행되기 전인 컴파일 중에 오류를 표출해줍니다.
작은 프로그램을 작성할 때에는, 이런 이상한 점들이 화를 돋구지만 관리는 가능합니다. 그러나 수백 또는 수천 줄의 어플리케이션들을 작성할 때에는, 이러한 지속적 놀라움들은 심각한 문제입니다.

## TypeScript: 정적 타입 검사자 (TypeScript: A Static Type Checker)

앞서 몇 언어는 버그가 많은 프로그램을 아예 실행시키지 않는다고 했습니다.
프로그램을 실행시키지 않으면서 코드의 오류를 검출하는 것을 _정적 검사(checking)_이라고 합니다.
어떤 것이 오류인지와 어떤 것이 연산 되는 값에 기인하지 않음을 정하는 것이 정적 _타입_ 검사입니다.

_정적 타입 검사자_인 TypeScript는 프로그램을 실행시키기 전에 _값의 종류_를 기반으로 프로그램의 오류를 찾습니다.
예를 들어, 위의 마지막 예시에 오류가 있는 이유는 `obj`의 _타입_ 때문입니다.
다음은 TypeScript에서 볼 수 있는 오류입니다:

```
// @errors: 2551
const obj = { width: 10, height: 15 };
const area = obj.width * obj.heigth;
```

### 타입이 있는 JavaScript의 상위집합 (A Typed Superset of JavaScript)

그렇다면 TypeScript는 JavaScript와 어떤 관계일까요?

#### 구문 (Syntax)

TypeScript는 JS의 구문이 허용되는, JavaScript의 _상위집합_ 언어입니다.
구문은 프로그램을 만들기 위해 코드를 작성하는 방법을 의미합니다.
예를 들어, 다음 코드는 `)`이 없으므로 _구문_ 오류입니다:

```
// @errors: 1005
let a = (4
```

TypeScript는 독특한 구문 때문에 JavaScript 코드를 오류로 보지 않습니다.
즉, 어떻게 작성돼있는지 모르지만 작동하는 JavaScript 코드를 TypeScript 파일에 넣어도 잘 작동합니다.

#### 타입 (Types)

그러나 TypeScript는 다른 종류의 값들을 사용할 수 있는 방법이 추가된, _타입이 있는_ 상위집합입니다.
위의 `obj.heigth` 오류는 _구문_ 오류가 아닌, 값의 종류(_타입_)를 잘못 사용해서 생긴 오류입니다.

또 다른 예시로, 아래와 같은 JavaScript 코드가 브라우저에서 실행될 때, 다음과 같은 값이 출력될 _것입니다_:

```js
console.log(4 / []);
```

구문적으로 옳은(syntactically-legal) 위 코드는 JavaScript에서 `NaN`을 출력합니다.
그러나 TypeScript는 배열로 숫자를 나누는 연산이 옳지 않다고 판단하고 오류를 발생시킵니다:

```
// @errors: 2363
console.log(4 / []);
```

실제로 어떤 일이 일어나는지 보려는 의도로 숫자를 배열로 나눌 수 _있지만_, 대부분은 프로그래밍 실수입니다.
TypeScript의 타입 검사자는 최대한 많은 일반적인 오류를 검출하면서 올바른 프로그램을 만들 수 있게 설계되었습니다.
(나중에 TypeScript가 코드를 얼마나 엄격하게 검사할 수 있는지에 대한 설정에 대해 알아봅시다.)

만약 JavaScript 파일의 코드를 TypeScript 코드로 옮기면, 코드를 어떻게 작성했는지에 따라 _타입 오류_를 볼 수 있습니다.
이는 코드상의 문제이거나, TypeScript가 지나치게 보수적인 것일 수 있습니다.
위와 같은 오류를 제거하기 위해 가이드는 다양한 TypeScript 구문을 추가하는 방법을 보여줍니다.

#### 런타임 특성 (Runtime Behavior)

TypeScript는 JavaScript의 _런타임 특성(runtime behavior)_을 가진 프로그래밍 언어입니다.
예를 들어, JavaScript에서 0으로 나누는 행동은 런타임 예외로 처리하지 않고 `Infinity`값을 반환합니다.
논리적으로, TypeScript는 JavaScript 코드의 런타임 특성을 **절대** 변화시키지 않습니다.

즉 TypeScript가 코드에 타입 오류가 있음을 검출해도, JavaScript 코드를 TypeScript로 이동시키는 것은 같은 방식으로 실행시킬 것을 **보장합니다**

JavaScript와 똑같은 런타임 행동을 유지하는 것은 프로그램 작동을 중단시킬 수 있는 미묘한 차이를 걱정하지 않아도 되기 때문에 TypeScript의 기본적인 약속입니다.

<!--
Missing subsection on the fact that TS extends JS to add syntax for type
specification.  (Since the immediately preceding text was raving about
how JS code can be used in TS.)
-->

#### 삭제된 타입 (Erased Types)

개략적으로, TypeScript의 컴파일러가 코드 검사를 마치면 타입을 _삭제해서_ 결과적으로 "컴파일된" 코드를 만듭니다.
즉 코드가 한 번 컴파일되면, 결과로 나온 일반 JS 코드에는 타입 정보가 없습니다.

타입 정보가 없는 것은 TypeScript가 추론한 타입에 따라 프로그램의 _특성_을 변화시키지 않는다는 의미입니다.
결론적으로 컴파일 도중에는 타입 오류가 표출될 수 있지만, 타입 시스템 자체는 프로그램이 실행될 때 작동하는 방식과 관련이 없습니다.

마지막으로, TypeScript는 추가 런타임 라이브러리를 제공하지 않습니다.
TypeScript는 프로그램은 JavaScript 프로그램과 같은 표준 라이브러리 (또는 외부 라이브러리)를 사용하므로, TypeScript 관련 프레임워크를 추가로 공부할 필요가 없습니다.
<!--
Should extend this paragraph to say that there's an exception of
allowing you to use newer JS features and transpile the code to an older
JS, and this might add small stubs of functionality when needed.  (Maybe
with an example --- something like `?.` would be good in showing readers
that this document is maintained.)
-->

## JavaScript와 TypeScript의 학습 (Learning JavaScript and TypeScript)

종종 "JavaScript 또는 TypeScript를 배워야 할까요?"와 같은 질문을 볼 수 있습니다.

정답은 JavaScript를 배우지 않고선 TypeScript를 배울 수 없다는 것입니다!
TypeScript는 JavaScript와 구문과 런타임 특성을 공유하므로, JavaScript에서 배운 모든 것들은 동시에 TypeScript를 배울 때 도움이 될 것입니다.

프로그래머들을 위한 JavaScript 학습 자원이 많습니다; TypeScript를 작성할 때 그런 학습 자원을 무시해선 _안됩니다_.
예를 들어 `javascript`태그가 붙은 질문들이 `typescript`태그가 붙은 질문보다 약 20배는 많지만, _모든_ `javascript`질문들은 TypeScript에도 적용할 수 있습니다.

만약 "TypeScript에서 리스트를 정렬하는 법"과 같은 것을 찾는 경우, 기억하세요: **TypeScript는 컴파일-타임 타입 검사자가 있는 JavaScript의 런타임입니다**.
리스트를 TypeScript에서 정렬하는 방법은 JavaScript에서 똑같은 방법으로 할 수 있습니다.
만약 TypeScript를 직접적으로 사용하는 자원을 찾았다면 그것도 좋지만, 런타임 작업을 실행하기 위한 일상적인 질문을 TypeScript 관련 답변에만 제한시킬 필요는 없습니다.

---

여기서, JavaScript 기초 몇 가지를 배우는 것을 추천합니다 ([Mozilla 웹 문서의 JavaScript 가이드](https://developer.mozilla.org/docs/Web/JavaScript/Guide)가 괜찮겠네요.)

익숙해지셨다면, 다시 돌아와서 [JavaScript 프로그래머들을 위한 TypeScript](/docs/handbook/typescript-in-5-minutes.html)을 읽어보시고, [핸드북](/docs/handbook/intro.html)을 시작하시거나 [예제](/play#show-examples)를 보세요.

<!-- Note: I'll be happy to write the following... -->
<!--
## Types

    * What's a type? (For newbies)
      * A type is a *kind* of value
      * Types implicitly define what operations make sense on them
      * Lots of different kinds, not just primitives
      * We can make descriptions for all kinds of values
      * The `any` type -- a quick desctiption, what it is, and why it's bad
    * Inference 101
      * Examples
      * TypeScript can figure out types most of the time
      * Two places we'll ask you what the type is: Function boundaries, and later-initialized values
    * Co-learning JavaScript
      * You can+should read existing JS resources
      * Just paste it in and see what happens
      * Consider turning off 'strict' -->